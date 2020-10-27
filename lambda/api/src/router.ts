import { ClientError } from "./ClientError";
import { Controller, getStationsController, getProgramsController, postProgramController } from "./controllers";

export function router(httpMethod: string, path: string): Controller {
  if (httpMethod === "GET") {
    if ("/stations" === path) {
      return getStationsController;
    }
    if (/^\/programs\/\w+/.test(path)) {
      return getProgramsController;
    }
  }
  if (httpMethod === "POST") {
    if ("/program" === path) {
      return postProgramController;
    }
  }
  throw new ClientError(`no routes. httpMethod: ${httpMethod}, requestPath: ${path}`);
}
