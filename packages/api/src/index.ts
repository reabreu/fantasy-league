import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as routes from "./routes";
import { setDatabaseConnection } from "./setDatabaseConnection";

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set DB connection
setDatabaseConnection();

// Routes
app.get("/", async (req, res) => {
  res.send(`Hi im the api ;)`);
});
app.use("/leagues", routes.leaguesRouter);
app.use("/series", routes.seriesRouter);
app.use("/tournaments", routes.tournamentsRouter);

app.listen(3000, err => {
  console.log("Listening");
});
