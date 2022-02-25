import {DITest} from "@tsed/di";
import {PlatformCache} from "@tsed/platform-cache";
import {CacheService} from "./CacheService";

async function createCacheServiceFixture() {
  const platformCache = {
    cache: {
      store: {
        getClient: jest.fn().mockReturnValue({
          keys: jest.fn().mockResolvedValue(["key"])
        })
      }
    },
    keys: jest.fn().mockResolvedValue(["key"]),
    get: jest.fn().mockResolvedValue({
      metadata: {},
      value: "value"
    }),
    del: jest.fn().mockResolvedValue(1),
    reset: jest.fn().mockResolvedValue(10)
  };

  const service = await DITest.invoke<CacheService>(CacheService, [
    {
      token: PlatformCache,
      use: platformCache
    }
  ]);

  return {service, platformCache};
}

describe("CacheService", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  describe("keys()", () => {
    it("should return keys in cache", async () => {
      const {service} = await createCacheServiceFixture();

      const result = await service.keys();

      expect(result).toEqual(["key"]);
    });
  });
  describe("getMatchingKeys()", () => {
    it("should return keys in cache", async () => {
      const {service} = await createCacheServiceFixture();

      const result = await service.getMatchingKeys(/key/);

      expect(result).toEqual(["key"]);
    });

    it("should return an empty array", async () => {
      const {service} = await createCacheServiceFixture();

      const result = await service.getMatchingKeys(/test/);

      expect(result).toEqual([]);
    });
  });
  describe("getKeysMetadata()", () => {
    it("should return keys in cache", async () => {
      const {service} = await createCacheServiceFixture();

      const result = await service.getKeysMetadata();

      expect(result).toEqual([
        {
          key: "key",
          metadata: {},
          value: "value"
        }
      ]);
    });

    it("should return an empty array", async () => {
      const {service} = await createCacheServiceFixture();

      const result = await service.getKeysMetadata();

      expect(result).toEqual([
        {
          key: "key",
          metadata: {},
          value: "value"
        }
      ]);
    });
  });
  describe("del()", () => {
    it("should delete key", async () => {
      const {service, platformCache} = await createCacheServiceFixture();

      await service.del("key");

      expect(platformCache.del).toHaveBeenCalledWith("key");
    });
  });

  describe("reset()", () => {
    it("should delete all keys", async () => {
      const {service, platformCache} = await createCacheServiceFixture();

      await service.reset();

      expect(platformCache.reset).toHaveBeenCalledWith();
    });
  });
  describe("deleteMatchingKeys()", () => {
    it("should delete all keys that matches with regexp", async () => {
      const {service, platformCache} = await createCacheServiceFixture();

      await service.deleteMatchingKeys(/key/);

      expect(platformCache.del).toHaveBeenCalledWith("key");
    });
    it("should do nothing when the regexp doesn't match with keys", async () => {
      const {service, platformCache} = await createCacheServiceFixture();

      await service.deleteMatchingKeys(/other/);

      expect(platformCache.del).not.toHaveBeenCalled();
    });
  });
});
