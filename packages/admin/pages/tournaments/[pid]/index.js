import getConfig from "next/config";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";

const TournamentPID = ({ tournament }) => {
  const router = useRouter();
  const [data, setData] = useState(tournament);
  const { serie, league, name, teams } = data;

  const syncTeams = async () => {
    const res = await axios.get(
      `/api/tournaments/${router.query.pid}/sync/teams`
    );
    setData(res.data.tournament);
  };

  const syncMatches = async () => {
    const res = await axios.get(
      `/api/tournaments/${router.query.pid}/sync/matches`
    );
    // setData(res.data.tournament);
  };

  return (
    <div>
      <Header />
      <h1>
        Tournament: {league.name} - {serie.full_name} {name}
      </h1>
      <h2>Teams & Players:</h2>
      <button onClick={syncTeams}>Sync teams and players</button>
      {teams.map(({ team, players }) => {
        return (
          <div key={team.id}>
            <h3>{team.name}</h3>
            <table>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>First Name</th>
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Image</th>
                </tr>

                {players.map(
                  ({
                    id,
                    first_name,
                    name,
                    last_name,
                    role,
                    slug,
                    image_url
                  }) => {
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{first_name}</td>
                        <td>{name}</td>
                        <td>{last_name}</td>
                        <td>{role}</td>
                        <td>
                          <img width="35px" src={image_url} />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        );
      })}
      <h2>Matches:</h2>
      <button onClick={syncMatches}>Sync Matches</button>
    </div>
  );
};

TournamentPID.getInitialProps = async ({ query }) => {
  const { publicRuntimeConfig } = getConfig();
  const res = await axios.get(
    `${publicRuntimeConfig.apiURL}/tournaments/${query.pid}`
  );
  return { tournament: res.data.tournament };
};

export default TournamentPID;
