import { S3, config } from "aws-sdk";
import { TransformedStations } from "../../shared/stations.type";
import { TransformedPrograms } from "../../shared/programs.type";

config.update({ region: "ap-northeast-1" });
const s3Client = new S3();

export async function getStations(bucket: string): Promise<TransformedStations[]> {
  const fileName = "stations.json";
  const params: S3.Types.GetObjectRequest = {
    Bucket: bucket,
    Key: fileName,
  };
  return getObject<TransformedStations[]>(params);
}

export async function getPrograms(bucket: string, stationId: string): Promise<TransformedPrograms[]> {
  const fileName = `programs/${stationId}.json`;
  const params: S3.Types.GetObjectRequest = {
    Bucket: bucket,
    Key: fileName,
  };
  return getObject<TransformedPrograms[]>(params);
}

async function getObject<T>(params: S3.Types.GetObjectRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    s3Client.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else if (typeof data.Body === "string") {
        const body = JSON.parse(data.Body) as T;
        resolve(body);
      } else {
        reject("S3 object's body is not string");
      }
    });
  });
}
