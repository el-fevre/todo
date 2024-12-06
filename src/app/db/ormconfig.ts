// src/ormconfig.ts

import { DataSource } from "typeorm";
import { Project } from "./entities/Project"; // Import Project entity
import { Task } from "./entities/Task"; // Import Task entity
import { TaskList } from "./entities/TaskList"; // Import TaskList entity
import { Team } from "./entities/Team"; // Import Team entity

export const AppDataSource = new DataSource({
  type: "postgres", // Use 'postgres' for PostgreSQL
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "mypassword",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: false, // Set to false in production and use migrations
  logging: true,
  entities: ["src/app/db/entities/*.ts"],
  migrations: ["src/app/db/migrations/*.ts"],
  subscribers: ["src/app/db/subscribers/*.ts"],
});
