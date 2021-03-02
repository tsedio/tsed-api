import {Controller, Get} from "@tsed/common";
import {Hidden, Returns} from "@tsed/schema";

@Controller("/health")
@Hidden()
export class HealthCtrl {
  @Get("/")
  @(Returns(200).ContentType("plain/text"))
  get() {
    return "OK";
  }
}
