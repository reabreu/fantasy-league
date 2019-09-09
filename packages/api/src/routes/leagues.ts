import * as express from "express";
import { getConnection } from "typeorm";
import { League } from "../entity/League";
import { pandaScoreAxios } from "../axios";

export const leaguesRouter = express.Router();

leaguesRouter.get("/", async (req, res) => {
  try {
    const leagues = await getConnection()
      .getRepository(League)
      .find();

    res.send({ leagues });
  } catch (e) {
    console.log("Error:", e);
  }
});

leaguesRouter.get("/sync", async (req, res) => {
  try {
    const results = await pandaScoreAxios.get(
      "/leagues?&filter[slug]=league-of-legends-lec,league-of-legends-lcs"
    );

    for (let index = 0; index < results.data.length; index++) {
      const league = results.data[index];

      const leagueDB = await getConnection()
        .getRepository(League)
        .findOne({
          where: {
            id: league.id
          }
        });

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
      .find();

    res.send({ leagues });
  } catch (e) {
    console.log("Error:", e);
  }
});
