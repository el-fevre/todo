import { NextApiRequest, NextApiResponse } from "next";

import { AppDataSource } from "../../db/ormconfig";
import { User } from "../../db/entities/User";
import argon from "argon2";
import { validate } from "class-validator";

// Request body type
interface RegisterRequestBody {
  email: string;
  password: string;
}

// Helper function for error response
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

  const { email, password }: RegisterRequestBody = req.body;

  // Validate input
  if (!email || !password) {
    return sendErrorResponse(res, "Email and password are required.");
  }

  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    // Check if the user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(res, "User with this email already exists.");
    }

    // Hash the password
    const hashedPassword = await argon.hash(password, { hashLength: 12 });

    // Create a new user
    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    // Validate the User entity (using class-validator)
    const errors = await validate(newUser);
    if (errors.length > 0) {
      return sendErrorResponse(
        res,
        "Validation failed: " +
          errors
            .map((e) => Object.values(e.constraints || {}).join(", "))
            .join("; ")
      );
    }

    // Save the user to the database
    const savedUser = await userRepository.save(newUser);

    // Send a success response
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: { id: savedUser.id, email: savedUser.email }, // Exclude password from the response
    });
  } catch (error) {
    console.error("Error in register API:", error);
    sendErrorResponse(res, "Internal server error", 500);
  }
}
