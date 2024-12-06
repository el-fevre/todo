// src/entities/Project.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TaskList } from "./TaskList"; // Import TaskList entity for the relationship
import { Team } from "./Team";

@Entity() // Marks the class as a database entity
export class Project {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column() // Name of the project
  name: string;

  @Column("text", { nullable: true }) // Optional description for the project
  description: string;

  @CreateDateColumn() // Automatically set when the project is created
  createdAt: Date;

  @CreateDateColumn() // Automatically set when the project is updated
  updatedAt: Date;

  @OneToMany(() => TaskList, (taskList) => taskList.project) // One-to-many relationship: one Project can have many TaskLists
  taskLists: TaskList[];

  @ManyToOne(() => Team, (team) => team.projects) // Many-to-one relationship: many Projects belong to one Team
  @JoinColumn({ name: "teamId" }) // Foreign key column in the Project entity
  team: Team; // Reference to the Team entity
}
