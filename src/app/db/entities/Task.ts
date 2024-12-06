// src/entities/Task.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TaskList } from "./TaskList";

@Entity() // This decorator marks this class as a database entity
export class Task {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column() // Title of the task
  title: string;

  @Column("text", { nullable: true }) // Optional description for the task
  description: string | undefined;

  @Column({ default: "pending" }) // Task status: pending, in-progress, completed
  status: string;

  @CreateDateColumn() // Automatically set when the task is created
  createdAt: Date;

  @UpdateDateColumn() // Automatically set when the task is updated
  updatedAt: Date;

  @ManyToOne(() => TaskList, (taskList) => taskList.tasks) // Many-to-one relationship: many tasks can belong to one task list
  @JoinColumn({ name: "taskListId" }) // Foreign key column in the Task entity
  taskList: TaskList; // Reference to the TaskList entity
}
