import {PlatformTest} from "@tsed/common";
import {FormioDatabase} from "@tsed/formio";
import {deserialize} from "@tsed/json-mapper";
import {NpmPackage} from "../domain/npm/NpmPackage";
import {GithubClient} from "../infra/back/github/GithubClient";
import {NpmClient} from "../infra/back/npm/NpmClient";
import {WarehouseService} from "./WarehouseService";

describe("WarehouseService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getPlugins()", () => {
    it("should return all plugins available for the given keywords", async () => {
      const npmClient = {
        search: jest.fn().mockResolvedValue([
          deserialize(
            {
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

      jest.spyOn(service, "getPackageSubmission").mockResolvedValue({
        _id: "id",
        form: "formId",
        data: {
          icon: "",
          disabled: false
        }
      } as any);

      jest.spyOn(service, "getStars").mockResolvedValue(1000);

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([
        {
          icon: "",
          name: "@tsed/common",
          stars: 1000
        }
      ]);
    });
    it("should return nothing when the package is mentioned as disabled", async () => {
      const npmClient = {
        search: jest.fn().mockResolvedValue([
          deserialize(
            {
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

      jest.spyOn(service, "getPackageSubmission").mockResolvedValue({
        _id: "id",
        form: "formId",
        data: {
          icon: "",
          disabled: true
        }
      } as any);

      jest.spyOn(service, "getStars").mockResolvedValue(1000);

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([]);
    });
    it("should get icon from formio", async () => {
      const npmClient = {
        search: jest.fn().mockResolvedValue([
          deserialize(
            {
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

      jest.spyOn(service, "getPackageSubmission").mockResolvedValue({
        _id: "id",
        form: "formId",
        data: {
          icon: "https://icon.formio",
          disabled: false
        }
      } as any);

      jest.spyOn(service, "getStars").mockResolvedValue(1000);

      const result = await service.getPlugins("tsed");

      expect(result).toEqual([
        {
          icon: "https://icon.formio",
          name: "@tsed/common",
          stars: 1000
        }
      ]);
    });
  });

  describe("getPackageSubmission()", () => {
    it("should return the package submission", async () => {
      const pkg = new NpmPackage();
      pkg.name = "@tsed/common";

      const formioDatabase = {
        submissionModel: class {
          static findOne = jest.fn().mockResolvedValue({
            data: {
              icon: ""
            }
          });

          constructor(public props: any) {}

          save(): any {
            return {};
          }
        }
      };

      const service = await PlatformTest.invoke<WarehouseService>(WarehouseService, [
        {
          token: FormioDatabase,
          use: formioDatabase
        }
      ]);

      jest.spyOn(service, "getPackagesFormId").mockResolvedValue("formId");
      jest.spyOn(formioDatabase.submissionModel.prototype, "save").mockResolvedValue(undefined);

      const result = await service.getPackageSubmission(pkg);

      expect(result).toEqual({
        data: {
          icon: ""
        }
      });
      expect(formioDatabase.submissionModel.findOne).toHaveBeenCalledWith({
        data: {name: {$eq: "@tsed/common"}},
        form: {$eq: "formId"}
      });
      expect(formioDatabase.submissionModel.prototype.save).not.toHaveBeenCalled();
    });
    it("should return the package submission and create submission if not exists", async () => {
      const pkg = new NpmPackage();
      pkg.name = "@tsed/common";

      const formioDatabase = {
        submissionModel: class {
          static findOne = jest.fn().mockResolvedValue(undefined);

          constructor(public props: any) {}

          save(): any {
            return {};
          }
        }
      };

      const service = await PlatformTest.invoke<WarehouseService>(WarehouseService, [
        {
          token: FormioDatabase,
          use: formioDatabase
        }
      ]);

      jest.spyOn(service, "getPackagesFormId").mockResolvedValue("formId");
      jest.spyOn(formioDatabase.submissionModel.prototype, "save").mockResolvedValue({
        data: {
          icon: ""
        }
      });

      const result = await service.getPackageSubmission(pkg);

      expect(result).toEqual({
        data: {
          icon: ""
        }
      });
      expect(formioDatabase.submissionModel.findOne).toHaveBeenCalledWith({
        data: {name: {$eq: "@tsed/common"}},
        form: {$eq: "formId"}
      });
      expect(formioDatabase.submissionModel.prototype.save).toHaveBeenCalledWith();
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
      pkg.repository = "https://github.com/typedproject/tsed";

      const result = await service.getStars(pkg);

      expect(result).toEqual(1000);
      expect(githubClient.getInfo).toHaveBeenCalledWith("typedproject", "tsed");
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
      pkg.repository = "https://gitlab.com/typedproject/tsed";

      const result = await service.getStars(pkg);

      expect(result).toEqual(0);
      expect(githubClient.getInfo).not.toHaveBeenCalled();
    });
  });
});
