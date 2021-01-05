import { initializeApp, credential, auth } from "firebase-admin";
import { getServiceAccountJson } from "./ssmClient";

export async function authFilter(headers: { [name: string]: string }): Promise<boolean> {
  const authorizationValue = headers["Authorization"];
  if (!authorizationValue) {
    throw new Error("not sent Authorization header");
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
