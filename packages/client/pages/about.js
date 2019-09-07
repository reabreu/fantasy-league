import Head from "next/head";
import React from "react";
import Link from "next/link";
import getConfig from "next/config";
import axios from "axios";

const About = ({ data }) => {
  return (
    <div>
      <Head>
        <title>Fantasy League</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>
      <p>About {data}</p>
    </div>
  );
};

About.getInitialProps = async ({ req }) => {
  const isServer = !!req;
  const { publicRuntimeConfig } = getConfig();
  const apiEndpoint = isServer ? publicRuntimeConfig.apiURL : "/api";
  const { data } = await axios.get(`${apiEndpoint}/`);
  return { data };
};

export default About;
