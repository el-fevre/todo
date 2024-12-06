import { NextApiRequest, NextApiResponse } from "next";

import { AppDataSource } from "../../db/ormconfig";
import { User } from "../../db/entities/User";
import argon from "argon2";
import jsonwebtoken from "jsonwebtoken";

// Request body type
interface LoginRequestBody {
  email: string;
  password: string;
}

// Helper function for error responses
const sendErrorResponse = (
  res: NextApiResponse,
  message: string,
  status = 400
) => {
  res.status(status).json({ success: false, message });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return sendErrorResponse(res, "Method not allowed", 405);
  }

  const { email, password }: LoginRequestBody = req.body;

  // Validate input
  if (!email || !password) {
    return sendErrorResponse(res, "Email and password are required.");
  }

  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    // Find the user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return sendErrorResponse(res, "Invalid email or password.");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await argon.verify(user.password, password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, "Invalid email or password.");
    }

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "30min",
      }
    );

    // Send a success response (or generate a token here, e.g., JWT)
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email }, // Exclude password from the response
    });
  } catch (error) {
    console.error("Error in login API:", error);
    sendErrorResponse(res, "Internal server error", 500);
  }
}
