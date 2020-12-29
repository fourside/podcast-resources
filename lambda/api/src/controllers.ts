import { APIGatewayProxyEvent, APIGatewayProxyResult as Response } from "aws-lambda";
import { ClientError } from "./ClientError";
import { PostBody, validatePostBody } from "./PostBody";
import { getStations, getPrograms } from "./s3GetClient";
import { sendMessage, receiveMessages } from "./sqsClient";

export type Controller = (RequestContext: RequestContext) => Promise<Response>;

export async function getStationsController(requestContext: RequestContext): Promise<Response> {
  const { bucket } = requestContext;
  const stations = await getStations(bucket);
  return {
    statusCode: 200,
    body: JSON.stringify(stations),
  };
}

export async function getProgramsController(requestContext: RequestContext): Promise<Response> {
  const { bucket, pathParameters } = requestContext;
  if (!pathParameters) {
    throw new ClientError("no pathparameter in get programs");
  }
  // ;( `A sibling ({program}) of this resource already has a variable path part -- only one is allowed`
  const stationId = pathParameters["program"];
  if (!(await existsStationId(bucket, stationId))) {
    throw new ClientError(`no station id in stations: id=${stationId}`);
  }
  const programs = await getPrograms(bucket, stationId);
  return {
    statusCode: 200,
    body: JSON.stringify(programs),
  };
}

export async function postProgramController(requestContext: RequestContext): Promise<Response> {
  const { bucket, body, requestId } = requestContext;
  if (!body) {
    throw new ClientError(`no request body`);
  }
  const validationResult = validatePostBody(body);
  if (!validationResult.isValid) {
    throw new ClientError(validationResult.message || "validation error");
  }
  if (!(await existsStationId(bucket, body.stationId))) {
    throw new ClientError(`no station id in stations: id=${body.stationId}`);
  }
  const result = await sendMessage(body, requestId);
  console.log("send sqs", result);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: "",
  };
}

export async function getQueuedProgramsController(requestContext: RequestContext): Promise<Response> {
  const result = await receiveMessages();
  if (!result.Messages) {
    return {
      statusCode: 204,
      body: "",
    };
  }
  const messages = result.Messages.reduce<any>((acc, cur) => {
    if (cur.Body) {
      const body = JSON.parse(cur.Body);
      acc.push(body);
    }
    return acc;
  }, []);
  return {
    statusCode: 200,
    body: JSON.stringify(messages),
  };
}

type RequestContext = {
  bucket: string;
  pathParameters: { [name: string]: string } | null;
  body: PostBody;
  requestId: string;
};

export function requestContextFactory(event: APIGatewayProxyEvent, bucket: string): RequestContext {
  const body = event.body ? JSON.parse(event.body) : undefined;
  return {
    bucket,
    pathParameters: event.pathParameters,
    body,
    requestId: event.requestContext.requestId,
  };
}

async function existsStationId(bucket: string, stationId: string): Promise<boolean> {
  const stations = await getStations(bucket);
  return stations.map((station) => station.id).includes(stationId);
}
