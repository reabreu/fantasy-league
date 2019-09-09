import { keys } from "./keys";
import { createConnection, getConnection } from "typeorm";
import { User } from "./entity/User";
import { League } from "./entity/League";
import { Tournament } from "./entity/Tournament";
import { Team } from "./entity/Team";
import { Serie } from "./entity/Serie";
import { Player } from "./entity/Player";
import { Match } from "./entity/Match";
import { Game } from "./entity/Game";
import { TournamentTeam } from "./entity/TournamentTeam";
import { InitialUsers1567189651689 } from "./migration/1567189651689-InitialUsers";

export const setDatabaseConnection = () =>
  createConnection({
    type: "postgres",
    host: keys.pgHost,
    port: parseInt(keys.pgPort),
    username: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
    entities: [
      User,
      League,
      Tournament,
      Serie,
      Team,
      Player,
      TournamentTeam,
      Match,
      Game
    ],
    synchronize: true,
    logging: false,
    migrationsRun: true,
    migrations: [InitialUsers1567189651689]
  })
    .then(() => {
      console.log("Succefully connected to the db");
    })
    .catch(error => console.log(error));
