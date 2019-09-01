module.exports = {
  publicRuntimeConfig: {
    apiURL: process.env.APIURL
  },
  webpack(config, options) {
    return config;
  }
};
