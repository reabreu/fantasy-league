import getConfig from "next/config";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";

const TournamentPID = ({ tournament }) => {
  const router = useRouter();
  const [data, setData] = useState(tournament);
  const { slug, serie, league, name } = data;

  const syncTeams = async () => {
    const res = await axios.get(
      `/api/tournament/${router.query.pid}/sync/teams`
    );
    setData(res.data.tournament);
  };

  return (
    <div>
      <h1>
        Tournament: {league.name} - {serie.full_name} {name}
      </h1>
      <h2>Teams:</h2>
      <button onClick={syncTeams}>Sync teams</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Acronym</th>
            <th>Logo</th>
          </tr>
        </tbody>
      </table>
      <h2>Players:</h2>
      <button>Sync Players</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>First Name</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Slug</th>
            <th>Hometown</th>
            <th>Image</th>
          </tr>
        </tbody>
      </table>
      <h2>Matches:</h2>
      <button>Sync Matches</button>
    </div>
  );
};

TournamentPID.getInitialProps = async ({ query }) => {
  const { publicRuntimeConfig } = getConfig();
  const res = await axios.get(
    `${publicRuntimeConfig.apiURL}/tournament/${query.pid}`
  );
  return { tournament: res.data.tournament };
};

export default TournamentPID;
