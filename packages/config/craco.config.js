// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLINT_MODES } = require("@craco/craco");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { configure, ensureReact } = require("@tsed/yarn-workspaces");

module.exports = {
  style: {
    postcss: {
      plugins: require("./postcss.config").plugins
    }
  },
  eslint: {
    mode: ESLINT_MODES
  },
  jest: {
    configure: {
      globals: {
        CONFIG: true
      }
    }
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return ensureReact(configure(webpackConfig, { env, paths }));
    }
  }
};
