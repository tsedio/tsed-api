import {Inject, PlatformCache} from "@tsed/common";
import {Constant, Injectable} from "@tsed/di";
import mongoose from "mongoose";

@Injectable()
export class CacheService {
  @Inject()
  cache: PlatformCache;

  @Constant("cache.modelOptions.collection")
  collectionName: string;

  get model() {
    return mongoose.model(this.collectionName);
  }

  getMatchingKeys(reg: RegExp) {
    return this.model.find({
      _id: {
        $regex: reg,
        $options: "i"
      }
    });
  }

  getKeys() {
    return this.model.find({});
  }

  del(key: string): Promise<void> {
    return this.cache.del(key);
  }

  reset(): Promise<void> {
    return this.cache.reset();
  }

  async deleteMatchingKeys(regExp: RegExp) {
    const keys = await this.getMatchingKeys(regExp);

    await Promise.all(await keys.map(({_id}: any) => this.del(_id)));
  }
}
