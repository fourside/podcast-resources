import { store } from "./storeRadikoToS3";

export async function handler(event: unknown): Promise<void> {
  console.log(JSON.stringify(event));
  try {
    const bucketName = process.env.bucketName;
    if (!bucketName) {
      throw new Error("not passed bucketName");
    }
    await store(bucketName);
  } catch (e) {
    console.error(e);
  }
}
