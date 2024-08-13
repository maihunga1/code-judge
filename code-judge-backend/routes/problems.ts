import express from "express";
import {
  getProblemByName,
  getPublicList,
} from "../controllers/problemController";

const problems = express.Router();
problems.get("/:title", getProblemByName);
problems.get("/list", getPublicList);

export default problems;
