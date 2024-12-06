// src/entities/TaskList.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Project } from "./Project";
import { Task } from "./Task"; // Import Task entity for the relationship

@Entity() // Marks the class as a database entity
export class TaskList {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column() // Name of the task list
  name: string;

  @Column("text", { nullable: true }) // Optional description for the task list
  description: string;

  @CreateDateColumn() // Automatically set when the task list is created
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.taskList) // One-to-many relationship: one TaskList can have many Tasks
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.taskLists) // Many-to-one relationship: many TaskLists belong to one Project
  @JoinColumn({ name: "projectId" }) // Foreign key column in the TaskList entity
  project: Project; // Reference to the Project entity
}
