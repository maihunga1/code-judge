import { RowDataPacket } from "mysql2";
import preparedStatements, { StatementName } from "./statement";
import { User, UserModel } from "./models/user.model";
import { memcacheClient } from "./cache";

export class UserDB {
  async getUserByID(userID: string): Promise<UserModel | null> {
    const cachedUser = await memcacheClient.get<UserModel>(`user:${userID}`);
    if (cachedUser) return cachedUser;

    const statement = preparedStatements.getPreparedStatement(
      StatementName.GET_USER_BY_ID
    );

    try {
      const [rows] = await statement.execute([userID]);

      if (Array.isArray(rows) && rows.length > 0) {
        const userData = rows[0] as User & RowDataPacket;

        const user = new UserModel(userData);

        await memcacheClient.set(`user:${userID}`, user, 60 * 60 * 24);

        return user;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
}

export const userDB = new UserDB();
