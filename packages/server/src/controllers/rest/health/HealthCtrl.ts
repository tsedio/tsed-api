import {Controller, Get} from "@tsed/common";
import {Hidden, Returns} from "@tsed/schema";

@Controller("/health")
@Hidden()
export class HealthCtrl {
  @Get("/")
  @Returns(200).ContentType("application/json")
  get() {
    return {status: "OK"};
  }
}
