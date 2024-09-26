SecretsManager = require("@aws-sdk/client-secrets-manager");
require("dotenv").config();

const secret_name = "n11744260-rds-secret";
const client = new SecretsManager.SecretsManagerClient({
  region: "ap-southeast-2",
});

async function main() {
  try {
    response = await client.send(
      new SecretsManager.GetSecretValueCommand({
        SecretId: secret_name,
      })
    );
    const secret = response.SecretString;
    console.log(secret);
  } catch (error) {
    console.log(error);
  }
}

main();
