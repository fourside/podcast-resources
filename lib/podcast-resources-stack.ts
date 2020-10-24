import { Stack, StackProps, Construct } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from "@aws-cdk/aws-lambda";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";

const PARCEL_CACHE_BASE_DIR = "./parcelCache";
export class PodcastResourcesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Bucket(this, "radiko-programs", {
      bucketName: "radiko-programs",
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
      },
    });

    const xmlProcessorFunction = new NodejsFunction(this, "xmlProcessor", {
      entry: "lambda/xmlProcessor/src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_12_X,
      cacheDir: `${PARCEL_CACHE_BASE_DIR}/xml`,
      logRetention: RetentionDays.ONE_MONTH,
    });

    new Rule(this, "radikoXml", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "0",
      }),
      targets: [new LambdaFunction(xmlProcessorFunction)],
    });
  }
}
