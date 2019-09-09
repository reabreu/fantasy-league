import * as express from "express";
import { getConnection } from "typeorm";
import { Serie } from "../entity/Serie";
import { Tournament } from "../entity/Tournament";
import { Team } from "../entity/Team";
import { Player } from "../entity/Player";
import { Match } from "../entity/Match";
import { Game } from "../entity/Game";
import { TournamentTeam } from "../entity/TournamentTeam";
import { pandaScoreAxios } from "../axios";

export const tournamentsRouter = express.Router();

tournamentsRouter.get("/", async (req, res) => {
  try {
    const tournaments = await getConnection()
      .getRepository(Tournament)
      .find();

    res.send({ tournaments });
  } catch (e) {
    console.log("Error:", e);
  }
});

tournamentsRouter.get("/sync", async (req, res) => {
  try {
    const connection = await getConnection();
    const series = await connection.getRepository(Serie).find();

    const leagueIds = series.map(({ id }) => id).join(",");
    const result = await pandaScoreAxios.get(
      `/tournaments?&filter[serie_id]=${leagueIds}`
    );

    for (let index = 0; index < result.data.length; index++) {
      const tournament = result.data[index];

      const tournamentDB = await connection.getRepository(Tournament).findOne({
        where: {
          id: tournament.id
        }
      });

      if (typeof tournamentDB !== "undefined") continue;

      await getConnection()
        .getRepository(Tournament)
        .save(tournament);
    }

    const tournaments = await getConnection()
      .getRepository(Tournament)
      .find();

    res.send({ tournaments });
  } catch (e) {
    console.log("Error:", e);
  }
});

tournamentsRouter.get("/:id", async (req, res) => {
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

tournamentsRouter.get("/:id/sync/teams", async (req, res) => {
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

tournamentsRouter.get("/:id/sync/matches", async (req, res) => {
  try {
    const result = await pandaScoreAxios.get(
      `/matches?&filter[tournament_id]=${req.params.id}&per_page=100`
    );

    for (let index = 0; index < result.data.length; index++) {
      const match = result.data[index];

      const matchDB = await await getConnection()
        .getRepository(Match)
        .findOne({
          id: match.id
        });

      if (typeof matchDB === "undefined") {
        await getConnection()
          .getRepository(Match)
          .save(match);
      }

      // Sync games for each match
      const games = await pandaScoreAxios.get(`/matches/${match.id}/games`);

      for (let index2 = 0; index2 < games.data.length; index2++) {
        const game = games.data[index2];

        const gameDB = await await getConnection()
          .getRepository(Game)
          .findOne({
            id: game.id
          });

        if (typeof gameDB === "undefined") {
          await getConnection()
            .getRepository(Game)
            .save(game);
        }
      }
    }

    res.send({ ok: "ok" });
  } catch (e) {
    console.log("Error:", e);
  }
});
