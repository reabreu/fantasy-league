import Head from "next/head";
import React from "react";
import axios from "axios";
import getConfig from "next/config";
import Link from "next/link";

const Index = ({ data }) => {
  return (
    <div>
      <Head>
        <title>Fantasy League</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Link href="/about">
        <a>About</a>
      </Link>
      <p>Client updated: {data}</p>
    </div>
  );
};

Index.getInitialProps = async ({ req }) => {
  const isServer = !!req;
  const { publicRuntimeConfig } = getConfig();
  const apiEndpoint = isServer ? publicRuntimeConfig.apiURL : "/api";
  const { data } = await axios.get(`${apiEndpoint}/`);
  return { data };
};

export default Index;
