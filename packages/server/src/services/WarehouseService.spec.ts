import {PlatformTest} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {NpmPackage} from "../domain/npm/NpmPackage";
import {GithubClient} from "../infra/back/github/GithubClient";
import {NpmClient} from "../infra/back/npm/NpmClient";
import {WarehouseService} from "./WarehouseService";

async function getWarehouseFixture({data, npmData}: any) {
  const npmClient = {
    search: jest.fn().mockResolvedValue([
      deserialize(
        npmData || {
          name: "@tsed/common"
        },
        {type: NpmPackage}
      )
    ])
  };

  const service = await PlatformTest.invoke<WarehouseService>(WarehouseService, [
    {
      token: NpmClient,
      use: npmClient
    }
  ]);

  jest.spyOn(service, "getSubmissions").mockResolvedValue([data as any]);
  jest.spyOn(service, "saveSubmission").mockImplementation((o: any) => o);
  jest.spyOn(service, "getStars").mockResolvedValue(1000);

  return {npmClient, service};
}

describe("WarehouseService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getPlugins()", () => {
    it("should return all plugins available for the given keywords", async () => {
      const {service} = await getWarehouseFixture({
        data: {
          _id: "id",
          form: "formId",
          data: {
            name: "@tsed/common",
            icon: "",
            disabled: false,
            maintainers: [
              {
                username: "Romakita",
                email: "romakita@tsed.io"
              }
            ]
          }
        }
      });

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([
        {
          downloads: 0,
          homepage: "",
          icon: "",
          maintainers: [
            {
              email: "romakita@tsed.io",
              username: "Romakita"
            }
          ],
          name: "@tsed/common",
          stars: 1000
        }
      ]);
    });
    it("should save the unknown package to database", async () => {
      const {service} = await getWarehouseFixture({
        data: {
          _id: "id",
          form: "formId",
          data: {
            name: "@tsed/common",
            icon: "",
            disabled: false
          }
        },
        npmData: {
          name: "@tsed/prisma",
          description: "A prisma package",
          version: "1.0.0",
          repository: "https://github.com/tsedio/tsed-prisma",
          homepage: "https://github.com/tsedio/tsed-prisma"
        }
      });

      const result = await service.getPlugins("tsed");

      expect(result).toMatchSnapshot();
      expect(service.saveSubmission).toHaveBeenCalledWith({
        data: {
          description: "A prisma package",
          icon: "",
          name: "@tsed/prisma"
        }
      });
    });
    it("should return nothing when the package is mentioned as disabled", async () => {
      const {service} = await getWarehouseFixture({
        data: {
          _id: "id",
          form: "formId",
          data: {
            name: "@tsed/common",
            icon: "",
            disabled: true
          }
        }
      });

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([]);
    });
    it("should get icon from formio", async () => {
      const {service} = await getWarehouseFixture({
        data: {
          _id: "id",
          form: "formId",
          data: {
            name: "@tsed/common",
            icon: "https://icon.formio",
            disabled: false
          }
        }
      });

      jest.spyOn(service, "getStars").mockResolvedValue(1000);

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([
        {
          downloads: 0,
          homepage: "",
          icon: "https://icon.formio",
          maintainers: [],
          name: "@tsed/common",
          stars: 1000
        }
      ]);
    });
  });

  describe("getStars()", () => {
    it("should get stargazers_count from github", async () => {
      const githubClient = {
        getInfo: jest.fn().mockResolvedValue({stargazers_count: 1000})
      };
      const service = await PlatformTest.invoke<WarehouseService>(WarehouseService, [
        {
          token: GithubClient,
          use: githubClient
        }
      ]);

      const pkg = new NpmPackage();
      pkg.name = "@tsed/common";
      pkg.repository = "https://github.com/tsedio/tsed";

      const result = await service.getStars(pkg);

      expect(result).toEqual(1000);
      expect(githubClient.getInfo).toHaveBeenCalledWith("tsedio", "tsed");
    });

    it("should return 0 when the repository isn't a github", async () => {
      const githubClient = {
        getInfo: jest.fn().mockResolvedValue({stargazers_count: 1000})
      };
      const service = await PlatformTest.invoke<WarehouseService>(WarehouseService, [
        {
          token: GithubClient,
          use: githubClient
        }
      ]);

      const pkg = new NpmPackage();
      pkg.name = "@tsed/common";
      pkg.repository = "https://gitlab.com/tsedio/tsed";

      const result = await service.getStars(pkg);

      expect(result).toEqual(0);
      expect(githubClient.getInfo).not.toHaveBeenCalled();
    });
  });
});
