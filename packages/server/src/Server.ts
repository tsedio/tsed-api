import "@tsed/ajv";
import "@tsed/async-hook-context";
import {PlatformApplication, Res} from "@tsed/common";
import {Env} from "@tsed/core";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/formio";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import {ServerResponse} from "http";
import methodOverride from "method-override";
import {join} from "path";
import send from "send";
import {cacheConfig} from "./config/cache";
import formioConfig from "./config/formio";
import {configureLogger, loggerConfig} from "./config/logger";
import mongooseConfig from "./config/mongoose";
import swaggerConfig from "./config/swagger";
import * as controllers from "./controllers/rest/index";
import "./infra/formio";
import {EnsureHttpsMiddleware} from "./infra/middlewares/https/EnsureHttpsMiddleware";

export const rootDir = __dirname;
const backofficeDir = join(rootDir, "../../backoffice/build");
const staticsDir = join(rootDir, "../statics");

function setCustomCacheControl(res: ServerResponse, path: string) {
  if (send.mime.lookup(path) === "text/html") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("expires", "0");
  }
}

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  logger: {...loggerConfig},
  swagger: swaggerConfig,
  mongoose: mongooseConfig,
  formio: formioConfig,
  cache: cacheConfig,
  passport: {
    disableSession: true
  },
  mount: {
    "/rest": Object.values(controllers),
    "/": [controllers.VersionCtrl, controllers.HealthCtrl]
  },
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  exclude: ["**/*.spec.ts"],
  componentsScan: [`${rootDir}/migrations/**/*.ts`, `${rootDir}/infra/protocols/**/*.ts`],
  statics: {
    "/backoffice": [
      {
        root: backofficeDir,
        maxAge: "1d",
        setHeaders: setCustomCacheControl
      }
    ],
    "/statics": [
      {
        root: staticsDir
      }
    ]
  },
  github: {
    accessToken: process.env.GH_TOKEN,
    whitelist: (process.env.REPOS_WHITE_LIST || "tsed").split(";")
  },
  middlewares: [
    process.env.ENFORCE_HTTPS && {env: Env.PROD, use: EnsureHttpsMiddleware},
    cors(),
    cookieParser(),
    compression({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ].filter(Boolean) as any[]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $afterRoutesInit() {
    this.app.get("/backoffice/*", (req: any, res: Res) => {
      res.sendFile(join(backofficeDir, "index.html"));
    });
  }

  $onReady() {
    configureLogger();
  }
}
