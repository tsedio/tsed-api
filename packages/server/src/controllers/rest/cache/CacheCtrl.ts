import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Name} from "@tsed/schema";
import {CacheService} from "../../../infra/persistence/CacheService";

@Controller("/caches")
@Name("Cache")
export class CacheCtrl {
  @Inject()
  cache: CacheService;

  @Get("/keys")
  async keys() {
    const result = await this.cache.getKeys();

    return result.map(({_id, exp, val: {ttl}}: any) => {
      return {id: _id, exp, ttl};
    });
  }

  @Get("/clear")
  clear() {
    return this.cache.reset();
  }
}
