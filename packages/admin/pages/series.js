import Head from "next/head";
import React, { useState } from "react";
import axios from "axios";
import getConfig from "next/config";
import Header from "../components/Header";

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
      <Header />
      <p>Series:</p>
      <button onClick={syncSeries}>Sync Series</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Full Name</th>
            <th>Slug</th>
            <th>League</th>
          </tr>
          {data.map(({ id, name, slug, full_name, league }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{full_name}</td>
              <td>{slug}</td>
              <td>{league.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Series.getInitialProps = async ({ req }) => {
  // Only holds and publicRuntimeConfig from next.config.js nothing else.
  const { publicRuntimeConfig } = getConfig();
  const res = await axios.get(`${publicRuntimeConfig.apiURL}/series`);
  return { series: res.data.series };
};

export default Series;
