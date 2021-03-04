import "@tsed/ajv";
import "@tsed/async-hook-context";
import {PlatformApplication, Res} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/formio";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import {ServerResponse} from "http";
import methodOverride from "method-override";
import {join} from "path";
import {isProduction} from "./config/env";
import formioConfig from "./config/formio";
import mongooseConfig from "./config/mongoose";
import swaggerConfig from "./config/swagger";
import "./config/logger";
import {VersionCtrl} from "./controllers/rest/version/VersionCtrl";

const send = require("send");

export const rootDir = __dirname;
const backofficeDir = join(rootDir, "../../backoffice/build");

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
  logger: {
    disableRoutesSummary: isProduction
  },
  mount: {
    "/rest": [`${rootDir}/controllers/rest/**/*.ts`],
    "/": [VersionCtrl]
  },
  swagger: swaggerConfig,
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  mongoose: mongooseConfig,
  formio: formioConfig,
  exclude: ["**/*.spec.ts"],
  statics: {
    "/backoffice": [
      {
        root: backofficeDir,
        maxAge: "1d",
        setHeaders: setCustomCacheControl
      }
    ]
  },
  github: {
    accessToken: process.env.GH_TOKEN,
    whitelist: (process.env.REPOS_WHITE_LIST || "tsed").split(";")
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }

  $afterRoutesInit() {
    this.app.get("/backoffice/*", (req: any, res: Res) => {
      res.sendFile(join(backofficeDir, "index.html"));
    });
  }
}
