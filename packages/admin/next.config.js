module.exports = {
  assetPrefix: "/admin/",
  publicRuntimeConfig: {
    apiURL: process.env.APIURL,
    apiURLPublic: process.env.APIURLPUBLIC
  },
  webpack(config, options) {
    return config;
  }
};
