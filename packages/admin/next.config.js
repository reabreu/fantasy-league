module.exports = {
  assetPrefix: "http://localhost/admin/",
  publicRuntimeConfig: {
    apiURL: process.env.APIURL,
    apiURLPublic: process.env.APIURLPUBLIC
  },
  webpack(config, options) {
    return config;
  }
};
