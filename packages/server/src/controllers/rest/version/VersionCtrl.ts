import {Controller, Get, QueryParams} from "@tsed/common";
import {Hidden, Returns} from "@tsed/schema";
import fs from "fs-extra";
import {join} from "path";

@Controller("/")
@Hidden()
export class VersionCtrl {
  @Get("/")
  @(Returns(200).ContentType("application/json"))
  async get(@QueryParams("code") code?: string) {
    // disable response when oauth flow is performed by formio
    if (!code) {
      const {version} = await fs.readJson(join(__dirname, "../../../../package.json"), {encoding: "utf8"});

      return {
        version
      };
    }
  }
}
