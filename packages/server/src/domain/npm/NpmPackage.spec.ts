import {NpmPackage, NpmPackageCategory, NpmPackageType} from "./NpmPackage";

describe("NpmPackage", () => {
  it("should create new NpmPackage with OFFICIAL type", () => {
    const pkg = new NpmPackage();
    pkg.name = "@tsed/common";

    expect(pkg.type).toEqual(NpmPackageType.OFFICIAL);
    expect(pkg.category).toEqual(NpmPackageCategory.FRAMEWORK);
  });

  it("should create new NpmPackage with PREMIUM type", () => {
    const pkg = new NpmPackage();
    pkg.name = "@tsedio/prisma";

    expect(pkg.type).toEqual(NpmPackageType.PREMIUM);
    expect(pkg.category).toEqual(NpmPackageCategory.FRAMEWORK);
  });

  it("should create new NpmPackage with OFFICIAL type and CLI category", () => {
    const pkg = new NpmPackage();
    pkg.name = "@tsed/cli-test";

    expect(pkg.type).toEqual(NpmPackageType.OFFICIAL);
    expect(pkg.category).toEqual(NpmPackageCategory.CLI);
  });

  it("should create new NpmPackage with THIRD_PARTY type", () => {
    const pkg = new NpmPackage();
    pkg.name = "tsed-cli-test";

    expect(pkg.type).toEqual(NpmPackageType.THIRD_PARTY);
    expect(pkg.category).toEqual(NpmPackageCategory.CLI);
  });

  it("should create new NpmPackage with OFFICIAL type and LOGGER category", () => {
    const pkg = new NpmPackage();
    pkg.name = "@tsed/logger-test";

    expect(pkg.type).toEqual(NpmPackageType.OFFICIAL);
    expect(pkg.category).toEqual(NpmPackageCategory.LOGGER);
  });

  it("should create new NpmPackage with THIRD_PARTY type and LOGGER category", () => {
    const pkg = new NpmPackage();
    pkg.name = "tsed-logger-";

    expect(pkg.type).toEqual(NpmPackageType.THIRD_PARTY);
    expect(pkg.category).toEqual(NpmPackageCategory.LOGGER);
  });

  describe("getRepositoryOwner()", () => {
    it("should return the repository owner", () => {
      const pkg = new NpmPackage();
      pkg.name = "tsed-logger-";
      pkg.repository = "https://github.com/tsedio/tsed";

      expect(pkg.getRepositoryOwner()).toEqual({
        owner: "tsedio",
        repo: "tsed"
      });
    });

    it("should return nothing", () => {
      const pkg = new NpmPackage();
      pkg.name = "tsed-logger-";
      pkg.repository = "https://gitlab.com/tsedio/tsed";

      expect(pkg.getRepositoryOwner()).toEqual(false);
    });
  });
});
