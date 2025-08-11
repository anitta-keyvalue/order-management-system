import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  deletedAt: Date;
}

export default AbstractEntity;
