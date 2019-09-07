module.exports = {
  assetPrefix: "/admin/",
  publicRuntimeConfig: {
    apiURL: process.env.APIURL
  },
  webpack(config, options) {
    return config;
  }
};
