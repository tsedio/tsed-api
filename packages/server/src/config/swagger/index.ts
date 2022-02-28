import {SwaggerSettings} from "@tsed/swagger";

const {version} = require("../../../package.json");

export default [
  {
    path: "/doc",
    specVersion: "3.0.1",
    spec: {
      info: {
        title: "Ts.ED",
        version: version,
        description:
          "Swagger 3.0.1 API specification. This API spec can be used for integrating your application project into non-HTML5 programs like `native` phone apps, `legacy` and `enterprise` systems, embedded `Internet of Things` applications (IoT), and other programming languages.  Note: The URL's below are configured for your specific project and form.",
        termsOfService: "https://tsed.io",
        contact: {
          name: "Ts.ED support",
          url: "https://tsed.io",
          email: "support@tsed.io"
        },
        license: {
          name: "MIT",
          url: "https://tsed.io/license.html"
        }
      },
      components: {
        securitySchemes: {
          oauth_jwt: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: ""
          }
        }
      }
    }
  },
  {
    path: "/doc-formio",
    specVersion: "2.0",
    fileName: "../projects/spec.json",
    disableSpec: true,
    showExplorer: true
  }
] as SwaggerSettings[];
