const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

exports.handler = async (event) => {
  try {
    const userID = event.requestContext.authorizer.jwt.claims.sub;

    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE userID = ? LIMIT 1",
      [userID]
    );

    await connection.end();

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify("User not found"),
      };
    }

    const data = rows[0];

    return {
      userID: data.userID,
      email: data.email,
      username: data.username,
      created: data.created,
    };
  } catch (error) {
    console.error("Error connecting to the RDS:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error connecting to the RDS"),
    };
  }
};
