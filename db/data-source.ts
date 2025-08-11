import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "user",
  password: "password",
  database: "oms",
  extra: { max: 5, min: 2 },
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ["dist/entities/*.js"],
  migrations: ["dist/db/migrations/*.js"],
});