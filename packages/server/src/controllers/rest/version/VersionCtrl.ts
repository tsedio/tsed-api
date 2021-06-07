import {Controller, Get, QueryParams} from "@tsed/common";
import {Hidden, Returns} from "@tsed/schema";

const packageJson = require("../../../../package.json");

@Controller("/")
@Hidden()
export class VersionCtrl {
  @Get("/")
  @(Returns(200).ContentType("application/json"))
  get(@QueryParams("code") code?: string) {
    // disable response when oauth flow is performed by formio
    if (!code) {
      return {
        version: packageJson.version
      };
    }
  }
}
