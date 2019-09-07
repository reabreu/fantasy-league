import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import getConfig from "next/config";

// Only holds and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig();

const Leagues = ({ leagues }) => {
  const [data, setData] = useState(leagues);

  const syncLeagues = async () => {
    const res = await axios.get(`/api/leagues/sync`);
    setData(res.data.leagues);
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
      <p>Leagues:</p>
      <button onClick={syncLeagues}>Sync Leagues</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Logo</th>
          </tr>
          {data.map(({ id, name, slug, image_url }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{slug}</td>
              <td>
                <img width="50px" src={image_url} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Leagues.getInitialProps = async ({ req }) => {
  const res = await axios.get(`${publicRuntimeConfig.apiURL}/leagues`);
  return { leagues: res.data.leagues };
};

export default Leagues;
