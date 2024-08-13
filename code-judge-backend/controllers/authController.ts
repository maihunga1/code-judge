import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Mock user database
const users: { username: string; password: string }[] = [
  { username: "admin", password: "admin" },
];

export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "1h",
      }
    );
    return res.json({ message: "Successfully logged in", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

export const registerUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExists = users.some((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
};
