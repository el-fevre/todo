// src/entities/Team.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Project } from "./Project"; // Import Project entity for the relationship

@Entity() // Marks the class as a database entity
export class Team {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column() // Name of the team
  name: string;

  @Column("text", { nullable: true }) // Optional description for the team
  description: string;

  @CreateDateColumn() // Automatically set when the team is created
  createdAt: Date;

  @OneToMany(() => Project, (project) => project.team) // One-to-many relationship: one Team can have many Projects
  projects: Project[];
}
