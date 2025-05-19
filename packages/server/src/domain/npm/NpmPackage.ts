import {CollectionOf, Description, Email, Enum, Example, Required, Url} from "@tsed/schema";
import crypto from "crypto";

export enum NpmPackageType {
  OFFICIAL = "official",
  PREMIUM = "premium",
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

  @Url()
  get avatar(): string {
    return `https://www.gravatar.com/avatar/${crypto.createHash("md5").update(this.email.toLowerCase()).digest("hex")}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set avatar(avatar: string) {}
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
  @Example("https://github.com/tsedio/tsed")
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
  maintainers: NpmPackageMaintainer[] = [];

  @Description("Npm downloads count")
  downloads = 0;

  @Description("Github stars count")
  stars = 0;

  @Description("Package tags")
  @CollectionOf(String)
  tags: string[] = [];

  constructor({
    name,
    description,
    version,
    repository,
    npm,
    icon,
    homepage,
    bugs,
    maintainers,
    downloads,
    stars,
    tags
  }: Partial<NpmPackage> = {}) {
    name && (this.name = name);
    description && (this.description = description);
    version && (this.version = version);
    repository && (this.repository = repository);
    npm && (this.npm = npm);
    icon && (this.icon = icon);
    homepage && (this.homepage = homepage);
    bugs && (this.bugs = bugs);
    maintainers && (this.maintainers = maintainers);
    downloads && (this.downloads = downloads);
    stars && (this.stars = stars);
    tags && (this.tags = tags);
  }

  @Description("Package type")
  @Enum(NpmPackageType)
  get type(): NpmPackageType {
    if (this.name.startsWith("@tsed/")) {
      return NpmPackageType.OFFICIAL;
    }

    if (this.name.startsWith("@tsedio/")) {
      return NpmPackageType.PREMIUM;
    }

    return NpmPackageType.THIRD_PARTY;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set type(type: NpmPackageType) {}

  @Description("Package category")
  @Enum(NpmPackageCategory)
  get category(): NpmPackageCategory {
    if (this.name.startsWith("tsed-cli-") || this.name.startsWith("@tsed/cli")) {
      return NpmPackageCategory.CLI;
    }

    if (this.name.startsWith("tsed-logger-") || this.name.startsWith("@tsed/logger")) {
      return NpmPackageCategory.LOGGER;
    }

    return NpmPackageCategory.FRAMEWORK;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set category(type: NpmPackageCategory) {}

  getRepositoryOwner() {
    if (this.repository?.match("github.com")) {
      const url = new URL(this.repository);
      const [, owner, repo] = url.pathname.replace(/.git$/, "").split("/");
      return {owner, repo};
    }

    return false;
  }
}
