import Head from "next/head";
import React from "react";
import Link from "next/link";
import Header from "../components/Header";

const Index = () => {
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
      <p>This is the homepage</p>
    </div>
  );
};

export default Index;
