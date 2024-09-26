SSM = require("@aws-sdk/client-ssm");
require("dotenv").config();

const parameter_name = "/n11744260/rds/db-password";
const client = new SSM.SSMClient({ region: "ap-southeast-2" });

async function main() {
  try {
    response = await client.send(
      new SSM.GetParameterCommand({
        Name: parameter_name,
      })
    );

    console.log(response.Parameter.Value);
  } catch (error) {
    console.log(error);
  }
}

main();
