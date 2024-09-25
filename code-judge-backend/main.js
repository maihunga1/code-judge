require("dotenv").config();

// const S3 = require("@aws-sdk/client-s3");

// const bucketName = "n11744260-leetcode";

// async function main() {
//   // Creating a client for sending commands to S3
//   const s3Client = new S3.S3Client({ region: "ap-southeast-2" });

//   // Command for listing objects in the /problems folder, one level deep
//   const listCommand = new S3.ListObjectsV2Command({
//     Bucket: bucketName,
//     Prefix: "problems/",
//     // Delimiter: "/",
//   });

//   // Send the command to list objects
//   try {
//     const response = await s3Client.send(listCommand);

//     console.log(response);
//     // console.log("Objects in /problems folder:");
//     // response.CommonPrefixes.forEach((item) => {
//     //   console.log(item.Prefix);
//     // });
//     // response.Contents.forEach((item) => {
//     //   console.log(item.Key);
//     // });
//   } catch (err) {
//     console.log(err);
//   }
// }

// main();

const { createClient } = require("redis");

async function main() {
  const client = await createClient({
    url: "n11744260-leetcode-0001-001.n11744260-leetcode.km2jzi.apse2.cache.amazonaws.com:6379",
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  await client.set("key", "value");
  const value = await client.get("key");
  console.log(value);
  await client.disconnect();
}

main();
