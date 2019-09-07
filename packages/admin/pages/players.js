import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import getConfig from "next/config";

// Only holds and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig();

const Players = ({ players }) => {
  const [data, setData] = useState(players);

  const syncSeries = async () => {
    const res = await axios.get(`/api/players/sync`);
    setData(res.data.players);
  };

  return (
    <div>
      <Head>
        <title>Fantasy League Backoffice</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Link href="/admin/leagues">
        <a>Leagues</a>
      </Link>
      <Link href="/admin/series">
        <a>Series</a>
      </Link>
      <Link href="/admin/tournaments">
        <a>Tournaments</a>
      </Link>
      <Link href="/admin/teams">
        <a>Teams</a>
      </Link>
      <Link href="/admin/players">
        <a>Players</a>
      </Link>
      <p>Players:</p>
      <button onClick={syncSeries}>Sync Players</button>
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
          {data.map(
            ({
              id,
              first_name,
              hometown,
              last_name,
              name,
              role,
              slug,
              image_url
            }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{first_name}</td>
                <td>{name}</td>
                <td>{last_name}</td>
                <td>{role}</td>
                <td>{slug}</td>
                <td>{hometown}</td>
                <td>
                  <img width="80px" src={image_url} />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

Players.getInitialProps = async ({ req }) => {
  const res = await axios.get(`${publicRuntimeConfig.apiURL}/players`);
  return { players: res.data.players };
};

export default Players;
