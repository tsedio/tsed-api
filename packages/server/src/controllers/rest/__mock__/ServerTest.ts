import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import {isProduction} from "../../../config/env";
import mongooseConfig from "../../../config/mongoose";
import swaggerConfig from "../../../config/swagger";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  logger: {
    disableRoutesSummary: isProduction
  },
  mount: {},
  swagger: swaggerConfig,
  mongoose: mongooseConfig,
  exclude: ["**/*.spec.ts"],
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
}
