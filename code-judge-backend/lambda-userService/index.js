const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// can't use ssm due to security groups config, can't be bothered to fix
dotenv.config();

exports.handler = async (event) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT,
    });

    await connection.ping();
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify("Connection to RDS was successful!"),
    };
  } catch (error) {
    console.error("Error connecting to the RDS:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error connecting to the RDS"),
    };
  }
};
