import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import getConfig from "next/config";

// Only holds and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig();

const Series = ({ series }) => {
  const [data, setData] = useState(series);

  const syncSeries = async () => {
    const res = await axios.get(`/api/series/sync`);
    setData(res.data.series);
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
      <p>Series:</p>
      <button onClick={syncSeries}>Sync Series</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Full Name</th>
            <th>Slug</th>
          </tr>
          {data.map(({ id, name, slug, full_name }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{full_name}</td>
              <td>{slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Series.getInitialProps = async ({ req }) => {
  const res = await axios.get(`${publicRuntimeConfig.apiURL}/series`);
  return { series: res.data.series };
};

export default Series;
