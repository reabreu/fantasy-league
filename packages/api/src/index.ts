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
  entities: [User, League, Tournament, Serie, Team, Player],
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
      .createQueryBuilder("tournament")
      .where("tournament.id = :id", { id: req.params.id })
      .leftJoinAndSelect("tournament.serie", "serie")
      .leftJoinAndSelect("tournament.league", "league")
      .getOne();

    res.send({ tournament });
  } catch (e) {
    console.log("Error:", e);
  }
});

app.get("/tournament/:id/sync/teams", async (req, res) => {
  try {
    try {
      const tournament = await getConnection()
        .getRepository(Tournament)
        .createQueryBuilder("tournament")
        .where("tournament.id = :id", { id: req.params.id })
        .getOne();

      // 1) Sync all teams
      const teams = await pandaScoreAxios.get(
        `/tournaments/${tournament.id}/teams`
      );

      for (let index = 0; index < teams.data.length; index++) {
        const team = teams.data[index];

        const leagueDB = await getConnection()
          .createQueryBuilder()
          .select("team.name")
          .from(Team, "team")
          .where("team.id = :id", { id: team.id })
          .getOne();

        if (typeof leagueDB !== "undefined") continue;

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Team)
          .values([team])
          .execute();
      }

      // 2) Create Tournament/Team relationship

      // 3) Sync all players
      // const players = await pandaScoreAxios.get(
      //   `/tournaments/${tournament.id}/players?per_page=100`
      // );

      // for (let index = 0; index < players.data.length; index++) {
      //   const player = players.data[index];

      //   const leagueDB = await getConnection()
      //     .createQueryBuilder()
      //     .select("player.name")
      //     .from(Player, "player")
      //     .where("player.id = :id", { id: player.id })
      //     .getOne();

      //   if (typeof leagueDB !== "undefined") continue;

      //   await getConnection()
      //     .createQueryBuilder()
      //     .insert()
      //     .into(Player)
      //     .values([player])
      //     .execute();
      // }

      // 4) Create Tournament/Team/Relationship relationship

      // 5) Return updated tournament
      const updatedTournament = await getConnection()
        .getRepository(Tournament)
        .createQueryBuilder("tournament")
        .where("tournament.id = :id", { id: req.params.id })
        .leftJoinAndSelect("tournament.serie", "serie")
        .leftJoinAndSelect("tournament.league", "league")
        .getOne();

      res.send({ tournament: updatedTournament });
    } catch (e) {
      console.log("Error:", e);
    }
  } catch (e) {
    console.log("Error:", e);
  }
});

// app.get("/teams", async (req, res) => {
//   try {
//     const teams = await getConnection()
//       .getRepository(Team)
//       .createQueryBuilder("team")
//       .getMany();

//     res.send({ teams });
//   } catch (e) {
//     console.log("Error:", e);
//   }
// });

// app.get("/teams/sync", async (req, res) => {
//   try {
//     const tournaments = await getConnection()
//       .getRepository(Tournament)
//       .createQueryBuilder("tournament")
//       .getMany();

//     for (let index = 0; index < tournaments.length; index++) {
//       const tournament = tournaments[index];

//       const teams = await pandaScoreAxios.get(
//         `/tournaments/${tournament.id}/teams`
//       );

//       for (let index2 = 0; index2 < teams.data.length; index2++) {
//         const team = teams.data[index2];

//         const leagueDB = await getConnection()
//           .createQueryBuilder()
//           .select("team.name")
//           .from(Team, "team")
//           .where("team.id = :id", { id: team.id })
//           .getOne();

//         if (typeof leagueDB !== "undefined") continue;

//         await getConnection()
//           .createQueryBuilder()
//           .insert()
//           .into(Team)
//           .values([team])
//           .execute();
//       }
//     }

//     const teams = await getConnection()
//       .getRepository(Team)
//       .createQueryBuilder("team")
//       .getMany();

//     res.send({ teams });
//   } catch (e) {
//     console.log("Error:", e);
//   }
// });

// app.get("/players", async (req, res) => {
//   try {
//     const players = await getConnection()
//       .getRepository(Player)
//       .createQueryBuilder("player")
//       .getMany();

//     res.send({ players });
//   } catch (e) {
//     console.log("Error:", e);
//   }
// });

// app.get("/players/sync", async (req, res) => {
//   try {
//     const tournaments = await getConnection()
//       .getRepository(Tournament)
//       .createQueryBuilder("tournament")
//       .getMany();

//     for (let index = 0; index < tournaments.length; index++) {
//       const tournament = tournaments[index];

//       const teams = await pandaScoreAxios.get(
//         `/tournaments/${tournament.id}/players`
//       );

//       for (let index2 = 0; index2 < teams.data.length; index2++) {
//         const player = teams.data[index2];

//         const leagueDB = await getConnection()
//           .createQueryBuilder()
//           .select("player.name")
//           .from(Player, "player")
//           .where("player.id = :id", { id: player.id })
//           .getOne();

//         if (typeof leagueDB !== "undefined") continue;

//         await getConnection()
//           .createQueryBuilder()
//           .insert()
//           .into(Player)
//           .values([player])
//           .execute();
//       }
//     }

//     const players = await getConnection()
//       .getRepository(Player)
//       .createQueryBuilder("player")
//       .getMany();

//     res.send({ players });
//   } catch (e) {
//     console.log("Error:", e);
//   }
// });

app.listen(3000, err => {
  console.log("Listening");
});
