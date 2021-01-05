import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { router } from "./router";
import { getStationsController, requestContextFactory } from "./controllers";
import { ClientError } from "./ClientError";
import { authFilter, authTargetControllers } from "./AuthFilter";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log(JSON.stringify(event));
  try {
    const bucketName = process.env.bucketName;
    if (!bucketName) {
      throw new Error("not passed bucketName");
    }
    const { httpMethod, path, headers } = event;
    const controller = router(httpMethod, path);
    console.log("controller", controller.name);

    const isNeedAuth = authTargetControllers.find((c) => c === controller);
    if (isNeedAuth) {
      const isAuth = await authFilter(headers);
      if (!isAuth) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            message: "not authenticated",
          }),
        };
      }
    }
    const requestContext = requestContextFactory(event, bucketName);
    const response = await controller(requestContext);
    console.log("response", response);
    return response;
  } catch (err) {
    console.error(err);
    if (err instanceof ClientError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: err.message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "error",
      }),
    };
  }
}
