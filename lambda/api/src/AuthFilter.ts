import * as admin from "firebase-admin";
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
  if (admin.apps.length === 0) {
    const serviceAccountJson = await getServiceAccountJson();
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken.uid;
}

export const authTargetControllers = [postProgramController, getQueuedProgramsController];
