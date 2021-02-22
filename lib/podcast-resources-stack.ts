import { Stack, StackProps, Construct, Duration } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from "@aws-cdk/aws-lambda";
import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { RestApi, LambdaIntegration, Cors } from "@aws-cdk/aws-apigateway";
import { Queue } from "@aws-cdk/aws-sqs";
import { PolicyStatement, Effect } from "@aws-cdk/aws-iam";

export class PodcastResourcesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "radiko-programs", {
      bucketName: "radiko-programs",
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: true,
        restrictPublicBuckets: true,
      },
    });

    const xmlProcessorFunction = new NodejsFunction(this, "xml", {
      entry: "lambda/xml/src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_14_X,
      logRetention: RetentionDays.ONE_MONTH,
      timeout: Duration.minutes(10),
      environment: {
        bucketName: bucket.bucketName,
      },
    });

    bucket.grantWrite(xmlProcessorFunction);

    new Rule(this, "radikoXml", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "0",
      }),
      targets: [new LambdaFunction(xmlProcessorFunction)],
    });

    const deadLetterQueue = new Queue(this, "radikoDeadLetterQueue", {
      queueName: "radikoDeadLetter.fifo",
      fifo: true,
      visibilityTimeout: Duration.minutes(240),
      retentionPeriod: Duration.days(8),
      contentBasedDeduplication: true,
    });

    const queue = new Queue(this, "radikoQueue", {
      queueName: "radiko.fifo",
      fifo: true,
      visibilityTimeout: Duration.minutes(240),
      retentionPeriod: Duration.days(1),
      contentBasedDeduplication: true,
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 1,
      },
    });

    const apiBackend = new NodejsFunction(this, "radikoApiBackend", {
      entry: "lambda/api/src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_14_X,
      logRetention: RetentionDays.ONE_MONTH,
      environment: {
        bucketName: bucket.bucketName,
        queueUrl: queue.queueUrl,
        deadLetterQueueUrl: deadLetterQueue.queueUrl,
        env: process.env.ENV || "prod",
      },
    });

    bucket.grantRead(apiBackend);
    queue.grantSendMessages(apiBackend);
    queue.grantConsumeMessages(apiBackend);
    deadLetterQueue.grantConsumeMessages(apiBackend);

    const ssmGetParamPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["ssm:GetParameter"],
      resources: ["*"],
    });
    apiBackend.addToRolePolicy(ssmGetParamPolicy);

    const radikoApi = new RestApi(this, "radikoApi");
    const integration = new LambdaIntegration(apiBackend);

    const getStations = radikoApi.root.addResource("stations", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET"],
      },
    });
    getStations.addMethod("GET", integration);

    const getPrograms = radikoApi.root.addResource("programs");
    const getProgram = getPrograms.addResource("{program}", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET"],
      },
    });
    getProgram.addMethod("GET", integration);

    const postProgram = radikoApi.root.addResource("program", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["POST"],
      },
    });
    postProgram.addMethod("POST", integration);
  }
}
