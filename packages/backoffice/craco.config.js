module.exports = {
  ...require("@tsed/config/craco.config"),
  devServer: {
    proxy: {
      "/rest": "http://localhost:8083",
      "/doc": "http://localhost:8083",
      "/doc-formio": "http://localhost:8083",
      "/projects": "http://localhost:8083"
    }
  }
};
