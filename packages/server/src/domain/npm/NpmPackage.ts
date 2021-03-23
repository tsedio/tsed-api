import {CollectionOf, Description, Email, Enum, Example, Required, Url} from "@tsed/schema";

export enum NpmPackageType {
  OFFICIAL = "official",
  THIRD_PARTY = "3rd-party"
}

export enum NpmPackageCategory {
  LOGGER = "logger",
  CLI = "cli",
  FRAMEWORK = "framework"
}

export class NpmPackageMaintainer {
  @Required()
  username: string;

  @Required()
  @Email()
  email: string;
}

export class NpmPackage {
  @Description("Npm package name")
  @Example("@tsed/common")
  name: string;

  @Description("Package description")
  description: string;

  @Description("Package version")
  version: string;

  @Description("Git repository")
  @Url()
  @Example("https://github.com/typedproject/tsed")
  repository: string;

  @Description("Npm url")
  @Url()
  @Example("https://www.npmjs.com/package/@tsed/common")
  npm: string;

  @Description("Package Icon")
  @Url()
  icon: string; // url or filename from /static/icons

  @Description("Home page to the repository")
  @Url()
  homepage: string;

  @Description("Bugs tracker url")
  @Url()
  bugs: string;

  @CollectionOf(NpmPackageMaintainer)
  maintainers: NpmPackageMaintainer[];

  @Description("Npm downloads count")
  downloads: number;

  @Description("Github stars count")
  stars: number;

  @Description("Package tags")
  @CollectionOf(String)
  tags: string[];

  @Description("Package type")
  @Enum(NpmPackageType)
  get type() {
    if (this.name.startsWith("@tsed/")) {
      return NpmPackageType.OFFICIAL;
    }

    return NpmPackageType.THIRD_PARTY;
  }

  @Description("Package category")
  @Enum(NpmPackageCategory)
  get category() {
    if (this.name.startsWith("tsed-cli-") || this.name.startsWith("@tsed/cli")) {
      return NpmPackageCategory.CLI;
    }

    if (this.name.startsWith("tsed-logger-") || this.name.startsWith("@tsed/logger")) {
      return NpmPackageCategory.LOGGER;
    }

    return NpmPackageCategory.FRAMEWORK;
  }

  getRepositoryOwner() {
    if (this.repository?.startsWith("https://github.com/")) {
      const [owner, repo] = this.repository.replace("https://github.com/", "").split("/");
      return {owner, repo};
    }

    return false;
  }
}
