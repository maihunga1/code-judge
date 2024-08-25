import bcrypt from 'bcrypt';
import { dynamodb } from '../utils/dynamoDbClient';

const TABLE_NAME = 'Users';

export const userService = {
  findUserByUsername: async (username: string) => {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { username }
    }).promise();
    return result.Item;
  },
  createUser: async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: { username, password: hashedPassword }
    }).promise();
  }
};