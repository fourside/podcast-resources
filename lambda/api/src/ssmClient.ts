import { SSM, config } from "aws-sdk";

config.update({ region: "ap-northeast-1" });

const ssm = new SSM();
const ssmPath = "/podcast-table/firebase-admin/json";

export async function getServiceAccountJson(): Promise<string> {
  const request: SSM.Types.GetParameterRequest = {
    Name: ssmPath,
    WithDecryption: true,
  };
  const result = await ssm.getParameter(request).promise();
  const serviceAccountJson = result.Parameter?.Value;
  if (!serviceAccountJson) {
    throw new Error(`not found service account json in SSM of ${ssmPath}`);
  }
  return serviceAccountJson;
}
