import {Controller, Get} from "@tsed/common";
import {Hidden, Returns} from "@tsed/schema";

const packageJson = require("../../../../package.json");

@Controller("/")
@Hidden()
export class VersionCtrl {
  @Get("/")
  @(Returns(200).ContentType("application/json"))
  get() {
    return {
      version: packageJson.version
    };
  }
}
