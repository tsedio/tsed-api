import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Name, Returns} from "@tsed/schema";
import {CacheService} from "../../../infra/persistence/CacheService";

@Controller("/caches")
@Name("Cache")
export class CacheCtrl {
  @Inject()
  cache: CacheService;

  @Get("/keys")
  @Returns(200).ContentType("application/json").Header("Cache-Control", "no-cache")
  async keys() {
    return this.cache.getKeysMetadata();
  }

  @Get("/clear")
  clear() {
    return this.cache.reset();
  }
}
