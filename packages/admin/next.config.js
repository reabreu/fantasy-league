module.exports = {
  assetPrefix: "http://localhost/admin/",
  publicRuntimeConfig: {
    apiURL: process.env.APIURL
  },
  webpack(config, options) {
    return config;
  }
};
