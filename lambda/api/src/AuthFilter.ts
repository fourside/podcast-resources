import { initializeApp, credential, auth } from "firebase-admin";
import { getQueuedProgramsController, postProgramController } from "./controllers";
import { getServiceAccountJson } from "./ssmClient";

export async function authFilter(headers: { [name: string]: string }): Promise<boolean> {
  const authorizationValue = headers["Authorization"];
  if (!authorizationValue) {
    console.log("not sent Authorization header");
    return false;
  }
  const idToken = authorizationValue.replace(/^Bearer +/i, "");
  const uid = await verifyToken(idToken);
  return !!uid;
}

async function verifyToken(idToken: string): Promise<string> {
  const serviceAccountJson = await getServiceAccountJson();
  initializeApp({
    credential: credential.cert(serviceAccountJson),
  });

  const decodedToken = await auth().verifyIdToken(idToken);
  return decodedToken.uid;
}

export const authTargetControllers = [postProgramController, getQueuedProgramsController];
