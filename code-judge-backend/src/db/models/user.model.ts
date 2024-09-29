import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  userID: string;
  email: string;
  username: string;
  created: Date;
}

export class UserModel {
  userID: string;
  email: string;
  username: string;
  created: Date;

  constructor(data: User) {
    this.userID = data.userID;
    this.email = data.email;
    this.username = data.username;
    this.created = data.created;
  }
}
