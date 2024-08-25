import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();

export const createTable = async () => {
  const dynamodbClient = new AWS.DynamoDB();
  const params = {
    TableName: 'Users',
    KeySchema: [{ AttributeName: 'username', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'username', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    await dynamodbClient.createTable(params).promise();
    console.log('Table Users created successfully');
  } catch (error) {
    if (error instanceof Error) {
      // Now `error` is known to be of type `Error`
      if (error.name !== 'ResourceInUseException') {
        console.error('Error creating table:', error.message);
      }
    } else {
      console.error('An unknown error occurred');
    }
  }
};