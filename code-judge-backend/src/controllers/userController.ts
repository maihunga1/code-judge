import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const users = [
  {
    username: "username1",
    password: "password1",
  }, {
    username: "username2",
    password: "password2",
  }
];

export class UserController {
  public loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = users.find(user => user.username === username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a token for the user
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' }
      );
      return res.json({ message: 'Successfully logged in', token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  public registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      // Check if the user already exists in the hardcoded users array
      const userExists = users.some(user => user.username === username);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      users.push({ username, password });
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
}

export const userController = new UserController();
