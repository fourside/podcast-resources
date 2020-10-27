import { APIGatewayProxyEvent, APIGatewayProxyResult as Response } from "aws-lambda";
import { ClientError } from "./ClientError";
import { PostBody, validatePostBody } from "./PostBody";
import { getStations, getPrograms } from "./s3GetClient";

export type Controller = (RequestContext: RequestContext) => Promise<Response>;

export async function getStationsController(requestContext: RequestContext): Promise<Response> {
  const { bucket } = requestContext;
  const stations = getStations(bucket);
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
  const stationId = pathParameters["stationId"];
  if (!existsStationId(bucket, stationId)) {
    throw new ClientError(`no station id in stations: id=${stationId}`);
  }
  const programs = getPrograms(bucket, stationId);
  return {
    statusCode: 200,
    body: JSON.stringify(programs),
  };
}

export async function postProgramController(requestContext: RequestContext): Promise<Response> {
  const { bucket, body } = requestContext;
  if (!body) {
    throw new ClientError(`no request body`);
  }
  const validationResult = validatePostBody(body);
  if (!validationResult.isValid) {
    throw new ClientError(validationResult.message || "validation error");
  }
  if (!existsStationId(bucket, body.stationId)) {
    throw new ClientError(`no station id in stations: id=${body.stationId}`);
  }
  // TODO: send message to sqs
  return {
    statusCode: 201,
    body: "",
  };
}

type RequestContext = {
  bucket: string;
  pathParameters: { [name: string]: string } | null;
  body: PostBody;
};

export function requestContextFactory(event: APIGatewayProxyEvent, bucket: string): RequestContext {
  const body = event.body ? JSON.parse(event.body) : undefined;
  return {
    bucket,
    pathParameters: event.pathParameters,
    body,
  };
}

async function existsStationId(bucket: string, stationId: string): Promise<boolean> {
  const stations = await getStations(bucket);
  return stations.map((station) => station.id).includes(stationId);
}
