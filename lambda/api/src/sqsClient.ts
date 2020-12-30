import { SQS, config } from "aws-sdk";
import { PostBody } from "./PostBody";

config.update({ region: "ap-northeast-1" });
const sqsClient = new SQS();

export async function sendMessage(postBody: PostBody, requestId: string): Promise<SQS.SendMessageResult> {
  const queueUrl = process.env.queueUrl;
  if (!queueUrl) {
    throw new Error("not passed queueUrl");
  }
  const params: SQS.Types.SendMessageRequest = {
    QueueUrl: queueUrl,
    MessageGroupId: "RadikoQueue",
    MessageDeduplicationId: requestId,
    MessageBody: JSON.stringify(postBody),
  };
  return sqsClient.sendMessage(params).promise();
}

export async function receiveMessages(): Promise<SQS.ReceiveMessageResult> {
  const queueUrl = process.env.queueUrl;
  if (!queueUrl) {
    throw new Error("not passed queueUrl");
  }

  const params: SQS.Types.ReceiveMessageRequest = {
    QueueUrl: queueUrl,
    VisibilityTimeout: 0,
  };
  return sqsClient.receiveMessage(params).promise();
}

export async function receiveDeadLetterMessages(): Promise<SQS.ReceiveMessageResult> {
  const queueUrl = process.env.deadLetterQueueUrl;
  if (!queueUrl) {
    throw new Error("not passed deadLetterQueueUrl");
  }

  const params: SQS.Types.ReceiveMessageRequest = {
    QueueUrl: queueUrl,
    VisibilityTimeout: 0,
  };
  return sqsClient.receiveMessage(params).promise();
}
