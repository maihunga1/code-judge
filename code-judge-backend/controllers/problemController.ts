import { Request, Response } from "express";
import { Leetcode } from "@codingsnack/leetcode-api";

// csrfToken after you've logged in
const csrfToken =
  "mB8j4j3DeH1JG3NftAED54DYGiOpYy2pfBEoAmDuB7l60dLZCsHTDJ0N3FoUgJJH";
// LEETCODE_SESSION after you've logged in
const session =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTEzMDc1ODgiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI0ZWFkM2YzNzUxODNjYzYwOTk2Yzk2MTdlOTg5YTFhZDEwNjFjYzVkYmFkNmMyMWY1MDEyZjRlMmQwNmVlYWVlIiwiaWQiOjExMzA3NTg4LCJlbWFpbCI6Im1haWh1bmdhMkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im1haWh1bmdfYWkiLCJ1c2VyX3NsdWciOiJtYWlodW5nX2FpIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2F2YXRhcnMvYXZhdGFyXzE2OTg4MzIwMjEucG5nIiwicmVmcmVzaGVkX2F0IjoxNzIzMjcwOTA1LCJpcCI6IjIwMDE6ODAwMzplYzczOjIwMTo1MDk1OjkyZTM6ODBjYjo4YjE0IiwiaWRlbnRpdHkiOiIzNjJkN2ZlM2Q4YjI1ODFiZmZhMzU5ZjBlZWRhNzEwNiIsInNlc3Npb25faWQiOjY3MTkzMjQ4LCJkZXZpY2Vfd2l0aF9pcCI6WyI2ZWJjNWI0MWU3YTNhNDQ5NGU3Mjc3ZDEzZDA2ZjZkNSIsIjIwMDE6ODAwMzplYzczOjIwMTo1MDk1OjkyZTM6ODBjYjo4YjE0Il19.NCmqzBfhSzwg8iAMlppS_JGvvdKvVuGZNvbimJs540U";

const lc = new Leetcode({ csrfToken, session });

const getProblemByName = async (req: Request, res: Response) => {
  try {
    const problemTitle = req.params.title;
    const problem = await lc.getProblem(problemTitle);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    return res.json(problem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPublicList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.query;

    // Validate listId parameter
    if (!listId) {
      return res.status(400).json({ error: `listId parameter is required.` });
    }

    const publicList = await lc.getPublicList(listId.toString());
    res.json(publicList);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Failed to fetch.`,
      details: (error as Error).message,
    });
  }
};

export { getProblemByName, getPublicList };
