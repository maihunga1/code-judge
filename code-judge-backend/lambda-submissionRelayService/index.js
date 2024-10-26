const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const dotenv = require("dotenv");

dotenv.config();

const sqsClient = new SQSClient({ region: "ap-southeast-2" });

exports.handler = async (event) => {
  try {
    const userID = event.requestContext.authorizer.jwt.claims.sub;

    const params = {
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify({
        ...JSON.parse(event.body),
        userID: userID,
      }), // add userID to the payload
    };

    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionID: response.MessageId }),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not send message" + error }),
    };
  }
};
