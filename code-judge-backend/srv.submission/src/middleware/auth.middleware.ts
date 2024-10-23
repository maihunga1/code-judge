import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { configService } from "../services";
// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const userPoolId = configService.get("/n11744260/auth/userPoolID");
const clientId = configService.get("/n11744260/auth/clientID");

if (!userPoolId || !clientId) {
  throw new Error("User Pool ID or Client ID is undefined");
}

// Create a Cognito JWT Verifier
const idVerifier = CognitoJwtVerifier.create({
  userPoolId,
  clientId,
  tokenUse: "id",
});

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized, token not found" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    // Verify the token
    const verifiedToken = await idVerifier.verify(token);

    // Attach user information to the request object
    req.user = verifiedToken;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    return res
      .status(401)
      .json({ message: "Unauthorized, token verification failed" });
  }
};
