import Head from "next/head";
import React from "react";
import Link from "next/link";
import axios from "axios";

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
      <p>{data}</p>
    </div>
  );
};

Players.getInitialProps = async ({ req }) => {
  const { data } = await axios.get("http://api:3000/");
  return { data };
};

export default Players;
