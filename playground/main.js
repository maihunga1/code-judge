const { Leetcode } = require("@codingsnack/leetcode-api");

const main = async () => {
  // csrfToken after you've logged in
  const csrfToken = "";
  // LEETCODE_SESSION after you've logged in
  const session = "";

  const lc = new Leetcode({ csrfToken, session });

  const problem = await lc.getProblem("two-sum");
  console.log(problem);
};

main();
