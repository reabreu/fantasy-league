import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { keys } from "./keys";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { InitialUsers1567189651689 } from "./migration/1567189651689-InitialUsers";

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

createConnection({
  type: "postgres",
  host: keys.pgHost,
  port: parseInt(keys.pgPort),
  username: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  entities: [User],
  synchronize: true,
  logging: false,
  migrationsRun: true,
  migrations: [InitialUsers1567189651689]
})
  .then(connection => {
    // here you can start to work with your entities
    console.log("ready");
  })
  .catch(error => console.log(error));

// routes
app.get("/", async (req, res) => {
  res.send(`Hi im the api`);
});

app.listen(3000, err => {
  console.log("Listening");
});
