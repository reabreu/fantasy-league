import Head from "next/head";
import React from "react";
import Link from "next/link";
import axios from "axios";
import getConfig from "next/config";

// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig();

const Players = ({ data }) => {
  return (
    <div>
      <Head>
        <title>Fantasy League Backoffice</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Link href="/admin/">
        <a>Home</a>
      </Link>
      <p>Admin updated: {data}</p>
    </div>
  );
};

Players.getInitialProps = async ({ req }) => {
  const { data } = await axios.get(`${publicRuntimeConfig.apiURL}/`);
  return { data };
};

export default Players;
