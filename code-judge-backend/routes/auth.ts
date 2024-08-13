import express from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { Router } from "express";

const auth = express.Router();
auth.post("/login", loginUser);
auth.post("/register", registerUser);

export default auth;
