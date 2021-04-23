import {Inject, PlatformCache} from "@tsed/common";
import {PlatformCachedObject} from "@tsed/common/lib/platform-cache/interfaces/PlatformCachedObject";
import {Injectable} from "@tsed/di";

@Injectable()
export class CacheService {
  @Inject(PlatformCache)
  protected cache: PlatformCache & {keys(): Promise<void>};

  async keys(): Promise<string[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await this.cache.cache.keys();
  }

  async getMatchingKeys(reg: RegExp) {
    return (await this.keys()).filter((key: string) => {
      return key.match(new RegExp(reg, "i"));
    });
  }

  async getKeysMetadata(): Promise<(PlatformCachedObject & {key: string})[]> {
    const keys = await this.keys();

    const result = keys.map(async (key) => {
      const item = await this.cache.get<PlatformCachedObject>(key);

      return {
        key,
        ...item
      };
    });

    console.log("=================");
    return Promise.all(result) as any;
  }

  del(key: string): Promise<void> {
    return this.cache.del(key);
  }

  reset(): Promise<void> {
    return this.cache.reset();
  }

  async deleteMatchingKeys(regExp: RegExp) {
    const keys = await this.getMatchingKeys(regExp);

    await Promise.all(await keys.map((key: string) => this.del(key)));
  }
}
