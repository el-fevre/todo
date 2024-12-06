// src/pages/api/tasks/index.ts

import { NextApiRequest, NextApiResponse } from "next";

import { AppDataSource } from "../../db/ormconfig";
import { Task } from "../../db/entities/Task";
import { validate } from "class-validator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const taskRepository = AppDataSource.getRepository(Task);

      const tasks = await taskRepository.find();
      return res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { title, description }: Partial<Task> = req.body;

    try {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const taskRepository = AppDataSource.getRepository(Task);

      const newTask = new Task();
      newTask.title = title || "";
      newTask.description = description;
      newTask.status = "pending";

      // Validate the task
      const errors = await validate(newTask);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: errors.map((e) =>
            Object.values(e.constraints || {}).join(", ")
          ),
        });
      }

      const savedTask = await taskRepository.save(newTask);
      return res.status(201).json({ success: true, task: savedTask });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
