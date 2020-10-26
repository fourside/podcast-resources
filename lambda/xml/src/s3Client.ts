import { S3, config } from "aws-sdk";
import { transformStations } from "./transformStations";
import { transformPrograms } from "./transformPrograms";

config.update({ region: "ap-northeast-1" });
const s3Client = new S3();

type Stations = ReturnType<typeof transformStations>;
type Programs = ReturnType<typeof transformPrograms>;

export async function putStations(bucket: string, stations: Stations): Promise<S3.PutObjectOutput> {
  const fileName = "stations.json";
  return await put(bucket, fileName, stations);
}

export async function putPrograms(bucket: string, stationId: string, programs: Programs): Promise<S3.PutObjectOutput> {
  const fileName = `programs/${stationId}.json`;
  return await put(bucket, fileName, programs);
}

async function put(bucket: string, fileName: string, json: unknown): Promise<S3.PutObjectOutput> {
  const params: S3.Types.PutObjectRequest = {
    Bucket: bucket,
    Key: fileName,
    Body: JSON.stringify(json),
  };
  return new Promise((resolve, reject) => {
    s3Client.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
