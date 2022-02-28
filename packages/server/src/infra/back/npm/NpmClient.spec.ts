import {PlatformTest} from "@tsed/common";
import {NpmClient} from "./NpmClient";

describe("NpmClient", () => {
  beforeEach(() =>
    PlatformTest.create({
      cache: false
    })
  );
  afterEach(() => PlatformTest.reset());
  describe("search()", () => {
    it("should return all package that match the given search pattern", async () => {
      const service = PlatformTest.get<NpmClient>(NpmClient);

      jest.spyOn(service, "get").mockResolvedValue({
        objects: [
          {
            package: {
              name: "@tsed/common",
              links: {
                repository: "links.repository",
                homepage: "links.homepage",
                npm: "links.npm",
                bugs: "links.bugs"
              }
            }
          },
          {
            package: {
              name: "@hentai/root"
            }
          }
        ]
      });
      jest.spyOn(service, "downloads").mockResolvedValue(0);

      const result = await service.search("tsed");

      expect(result).toEqual([
        {
          bugs: "links.bugs",
          downloads: 0,
          homepage: "links.homepage",
          maintainers: [],
          name: "@tsed/common",
          npm: "links.npm",
          repository: "links.repository",
          stars: 0,
          tags: []
        }
      ]);
      expect(service.get).toHaveBeenCalledWith("-/v1/search", {
        headers: {"Accept-Encoding": "gzip"},
        params: {from: 0, maintenance: 0.5, popularity: 0.98, quality: 0.65, size: 100, text: "tsed"}
      });
    });
  });
});
