import Head from "next/head";
import React from "react";
import axios from "axios";
import getConfig from "next/config";

// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig();

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
      <p>Client updated: {data}</p>
    </div>
  );
};

Index.getInitialProps = async ({ req }) => {
  const { data } = await axios.get(`${publicRuntimeConfig.apiURL}/`);
  return { data };
};

export default Index;
