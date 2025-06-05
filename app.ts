import express from "express";
// import employeeRouter from "./employee_router";
// import employeeRouter from "./routes/employee.route";
// import loggerMiddleware from "./middlewares/loggerMiddleware";
// import { dataSource } from "./db/data-source";
// import errorMiddleware from "./middlewares/errorMiddleware";
// import authRouter from "./routes/auth.routes";
// import authMiddleware from "./middlewares/auth.middleware";

const server = express();
server.use(express.json());
// server.use(loggerMiddleware);

// server.use("/employee", authMiddleware, employeeRouter);
// server.use("/auth", authRouter);
// server.use(errorMiddleware);

// server.get("/", (req, res) => {
//   console.log(req.url);
//   res.status(200).send("Hello world typescript");
// });


// Database connection configuration
// const dbConfig = {
//   user: 'postgres',
//   password: 'postgres',
//   host: 'localhost',
//   port: '5432',
//   database: 'training',
// };

(async () => {
//   try {
//     await dataSource.initialize();
//     console.log("Connected to the database");
//   } catch (error) {
//     console.log("Error connecting to the database", error);
//     process.exit(1);
//   }
  server.listen(3000, () => {
    console.log("server listening to 3000");
  });
})();

// const client = new Client(dbConfig);

// client.connect()
//   .then(() => {
//     console.log("Connected to the database");
//     client.query('SELECT * FROM employee', (err, result) => {
//       if (!err) {
//         console.log('Query result:', result.rows);
//       }
//       client.end();
//     });
//   })
//   .catch((err) => {
//     console.log("Error connecting to the database", err);
//   });

