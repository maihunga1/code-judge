import { UserModel } from "../db/models/user.model";
import { UserDB } from "../db/user.db";

export class UserService {
  private readonly userDB: UserDB;

  constructor() {
    this.userDB = new UserDB();
  }

  async getUserByID(userID: string): Promise<UserModel | null> {
    return this.userDB.getUserByID(userID);
  }
}

export const userService = new UserService();
