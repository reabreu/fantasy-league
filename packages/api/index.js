const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  connectionTimeoutMillis: 5000
});

pgClient.on("error", () => console.log("Lost PG connection"));

app.get("/", async (req, res) => {
  const query = await pgClient.query("SELECT NOW()");
  res.send(`Hi im the api ${query.rows[0].now}`);
});

app.listen(3000, err => {
  console.log("Listening");
});
