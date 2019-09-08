import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { keys } from "./keys";
import { createConnection, getConnection } from "typeorm";
import { User } from "./entity/User";
import { League } from "./entity/League";
import { Tournament } from "./entity/Tournament";
import { Team } from "./entity/Team";
import { Serie } from "./entity/Serie";
import { Player } from "./entity/Player";
import { TournamentTeam } from "./entity/TournamentTeam";
import { InitialUsers1567189651689 } from "./migration/1567189651689-InitialUsers";
import axios from "axios";

//Create PandaScore axios instance
const pandaScoreAxios = axios.create({
  baseURL: keys.pandaScoreURL,
  headers: {
    authorization: `Bearer ${keys.pandaScoreKEY}`
  }
});

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
  entities: [User, League, Tournament, Serie, Team, Player, TournamentTeam],
  synchronize: true,
  logging: false,
  migrationsRun: true,
  migrations: [InitialUsers1567189651689]
})
  .then(() => {
    console.log("Succefully connected to the db");
  })
  .catch(error => console.log(error));

// routes
app.get("/", async (req, res) => {
  res.send(`Hi im the api2`);
});

app.get("/leagues", async (req, res) => {
  try {
    const leagues = await getConnection()
      .getRepository(League)
      .createQueryBuilder("league")
      .getMany();

    res.send({ leagues });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/leagues/sync", async (req, res) => {
  try {
    const results = await pandaScoreAxios.get(
      "/leagues?&filter[slug]=league-of-legends-lec,league-of-legends-lcs"
    );

    for (let index = 0; index < results.data.length; index++) {
      const league = results.data[index];

      const leagueDB = await getConnection()
        .createQueryBuilder()
        .select("league.name")
        .from(League, "league")
        .where("league.id = :id", { id: league.id })
        .getOne();

      if (typeof leagueDB !== "undefined") continue;

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(League)
        .values([league])
        .execute();
    }

    const leagues = await getConnection()
      .getRepository(League)
      .createQueryBuilder("league")
      .getMany();

    res.send({ leagues });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/series", async (req, res) => {
  try {
    const series = await getConnection()
      .getRepository(Serie)
      .createQueryBuilder("serie")
      .leftJoinAndSelect("serie.league", "league")
      .getMany();

    res.send({ series });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/series/sync", async (req, res) => {
  try {
    const leagues = await getConnection()
      .getRepository(League)
      .createQueryBuilder("league")
      .getMany();

    const leagueIds = leagues.map(({ id }) => id).join(",");
    const result = await pandaScoreAxios.get(
      `/series?&filter[league_id]=${leagueIds}`
    );

    for (let index = 0; index < result.data.length; index++) {
      const serie = result.data[index];

      const leagueDB = await getConnection()
        .createQueryBuilder()
        .select("serie.full_name")
        .from(Serie, "serie")
        .where("serie.id = :id", { id: serie.id })
        .getOne();

      if (typeof leagueDB !== "undefined") continue;

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Serie)
        .values([serie])
        .execute();
    }

    const series = await getConnection()
      .getRepository(Serie)
      .createQueryBuilder("serie")
      .getMany();

    res.send({ series });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/tournaments", async (req, res) => {
  try {
    const tournaments = await getConnection()
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .getMany();

    res.send({ tournaments });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/tournaments/sync", async (req, res) => {
  try {
    const series = await getConnection()
      .getRepository(Serie)
      .createQueryBuilder("serie")
      .getMany();

    const leagueIds = series.map(({ id }) => id).join(",");
    const result = await pandaScoreAxios.get(
      `/tournaments?&filter[serie_id]=${leagueIds}`
    );

    for (let index = 0; index < result.data.length; index++) {
      const tournament = result.data[index];

      const leagueDB = await getConnection()
        .createQueryBuilder()
        .select("tournament.name")
        .from(Tournament, "tournament")
        .where("tournament.id = :id", { id: tournament.id })
        .getOne();

      if (typeof leagueDB !== "undefined") continue;

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Tournament)
        .values([tournament])
        .execute();
    }

    const tournaments = await getConnection()
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .getMany();

    res.send({ tournaments });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/tournament/:id", async (req, res) => {
  try {
    const tournament = await getConnection()
      .getRepository(Tournament)
      .findOne({
        relations: ["league", "serie", "teams"],
        where: {
          id: req.params.id
        }
      });

    res.send({ tournament });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/tournament/:id/sync/teams", async (req, res) => {
  try {
    const tournament = await getConnection()
      .getRepository(Tournament)
      .findOne({
        id: req.params.id
      });

    // 1) Sync all teams
    const teams = await pandaScoreAxios.get(
      `/tournaments/${tournament.id}/teams`
    );

    for (let index = 0; index < teams.data.length; index++) {
      const team = teams.data[index];

      const teamDB = await await getConnection()
        .getRepository(Team)
        .findOne({
          id: team.id
        });

      if (typeof teamDB === "undefined") {
        await getConnection()
          .getRepository(Team)
          .save(team);
      }

      // 2) Create Tournament/Team relationship if it doesnt exist
      const tournamentTeamDB = await getConnection()
        .getRepository(TournamentTeam)
        .findOne({
          tournament_id: tournament.id,
          team_id: team.id
        });

      if (typeof tournamentTeamDB !== "undefined") continue;

      const tournamentTeam = new TournamentTeam();
      tournamentTeam.tournament_id = tournament.id;
      tournamentTeam.team_id = team.id;

      await getConnection()
        .getRepository(TournamentTeam)
        .save(tournamentTeam);
    }

    // 3) Sync all players
    const players = await pandaScoreAxios.get(
      `/tournaments/${tournament.id}/players?per_page=100`
    );

    for (let index = 0; index < players.data.length; index++) {
      const player = players.data[index];
      if (!player.current_team) continue;

      let playerDB = await getConnection()
        .getRepository(Player)
        .findOne({
          id: player.id
        });

      if (typeof playerDB === "undefined") {
        await getConnection()
          .getRepository(Player)
          .save(player);
      }

      // 4) Create Tournament/Team/Relationship relationship
      playerDB = await getConnection()
        .getRepository(Player)
        .findOne({
          id: player.id
        });

      const tournamentTeamDB = await getConnection()
        .getRepository(TournamentTeam)
        .findOne({
          tournament_id: tournament.id,
          team_id: player.current_team.id
        });

      if (typeof tournamentTeamDB === "undefined") continue;

      tournamentTeamDB.players.push(playerDB);
      await getConnection()
        .getRepository(TournamentTeam)
        .save(tournamentTeamDB);
    }

    // 5) Return updated tournament
    const updatedTournament = await getConnection()
      .getRepository(Tournament)
      .findOne({
        relations: ["league", "serie", "teams"],
        where: {
          id: req.params.id
        }
      });

    res.send({ tournament: updatedTournament });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.listen(3000, err => {
  console.log("Listening");
});
