import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

// Replace these with your actual User Pool ID and Client ID
const userPoolId = "ap-southeast-2_0RpTGxp6c";
const clientId = "1rhukc2hl118rejuis4hftarf8";

// Create a Cognito JWT Verifier
const idVerifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  clientId: clientId,
  tokenUse: "id",
});

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(401).json({ message: "Unauthorized, token verification failed" });
  }
};
