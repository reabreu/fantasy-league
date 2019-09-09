import * as express from "express";
import { getConnection } from "typeorm";
import { Serie } from "../entity/Serie";
import { League } from "../entity/League";
import { pandaScoreAxios } from "../axios";

export const seriesRouter = express.Router();

seriesRouter.get("/", async (req, res) => {
  try {
    const series = await getConnection()
      .getRepository(Serie)
      .find({
        relations: ["league"]
      });

    res.send({ series });
  } catch (e) {
    console.log("Error:", e);
  }
});

seriesRouter.get("/sync", async (req, res) => {
  try {
    const connection = await getConnection();
    const leagues = await connection.getRepository(League).find();

    const leagueIds = leagues.map(({ id }) => id).join(",");
    const result = await pandaScoreAxios.get(
      `/series?&filter[league_id]=${leagueIds}`
    );

    for (let index = 0; index < result.data.length; index++) {
      const serie = result.data[index];

      const serieDB = await connection.getRepository(Serie).findOne({
        where: {
          id: serie.id
        }
      });

      if (typeof serieDB !== "undefined") continue;

      await connection
        .createQueryBuilder()
        .insert()
        .into(Serie)
        .values([serie])
        .execute();
    }

    const series = await connection.getRepository(Serie).find({
      relations: ["league"]
    });

    res.send({ series });
  } catch (e) {
    console.log("Error:", e);
  }
});
