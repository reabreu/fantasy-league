import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import getConfig from "next/config";
import Header from "../components/Header";

const Tournaments = ({ tournaments }) => {
  const [data, setData] = useState(tournaments);

  const syncTournaments = async () => {
    const res = await axios.get(`/api/tournaments/sync`);
    setData(res.data.tournaments);
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
      <p>Tournaments:</p>
      <button onClick={syncTournaments}>Sync Tournaments</button>
      <table>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
          </tr>
          {data.map(({ id, name, slug }) => (
            <tr key={id}>
              <td>
                <Link
                  href="/admin/tournaments/[pid]"
                  as={`/admin/tournaments/${id}`}
                >
                  <a>{id}</a>
                </Link>
              </td>
              <td>{name}</td>
              <td>{slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Tournaments.getInitialProps = async ({ req }) => {
  // Only holds and publicRuntimeConfig from next.config.js nothing else.
  const { publicRuntimeConfig } = getConfig();
  const res = await axios.get(`${publicRuntimeConfig.apiURL}/tournaments`);
  return { tournaments: res.data.tournaments };
};

export default Tournaments;
