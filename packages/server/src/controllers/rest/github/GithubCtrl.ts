import {InjectContext} from "@tsed/async-hook-context";
import {BodyParams, Controller, Get, HeaderParams, Inject, PathParams, PlatformContext, Post, QueryParams} from "@tsed/common";
import {array, boolean, Default, Max, Min, Name, number, object, Returns, string} from "@tsed/schema";
import {GithubWebhookPayload} from "../../../domain/github/GithubWebhookPayload";
import {GithubClient} from "../../../infra/back/github/GithubClient";
import {CacheService} from "../../../infra/persistence/CacheService";

const GithubRepo = object({
  id: string().description("Github repo id"),
  html_url: string().required(),
  stargazers_count: string().required().description("Github stargazers"),
  watchers_count: string().required().description("Github watchers"),
  forks_count: string().required().description("Github forks"),
  open_issues_count: string().required().description("Github open issues")
}).label("GithubRepo");

const GithubContributor = object({
  login: string().required(),
  id: string().required(),
  node_id: string().required(),
  avatar_url: string().required(),
  gravatar_id: string().required(),
  url: string().required(),
  html_url: string().required(),
  followers_url: string().required(),
  following_url: string().required(),
  gists_url: string().required(),
  starred_url: string().required(),
  subscriptions_url: string().required(),
  organizations_url: string().required(),
  repos_url: string().required(),
  events_url: string().required(),
  received_events_url: string().required(),
  type: string().required(),
  site_admin: string().required(),
  contributions: number().required()
}).label("GithubContributor");

const GithubContributors = array().items(GithubContributor).label("GithubContributors");

const GithubRelease = object({
  url: string().required().example("https://api.github.com/repos/tsedio/tsed/releases/38791984"),
  assets_url: string().required().example("https://api.github.com/repos/tsedio/tsed/releases/38791984/assets"),
  upload_url: string().required().example("https://uploads.github.com/repos/tsedio/tsed/releases/38791984/assets{?name,label}"),
  html_url: string().required().example("https://github.com/tsedio/tsed/releases/tag/v6.26.4"),
  id: number().required().example(38791984),
  author: GithubContributor,
  node_id: string().required().example("MDc6UmVsZWFzZTM4NzkxOTg0"),
  tag_name: string().required().example("v6.26.4"),
  target_commitish: string().required().example("production"),
  name: string().required().example("v6.26.4"),
  draft: boolean().required(),
  prerelease: boolean().required(),
  created_at: string().required().example("2021-02-26T10:35:52Z"),
  published_at: string().required().example("2021-02-26T10:36:31Z"),
  assets: array().items(object()),
  tarball_url: string().required().example("https://api.github.com/repos/tsedio/tsed/tarball/v6.26.4"),
  zipball_url: string().required().example("https://api.github.com/repos/tsedio/tsed/zipball/v6.26.4"),
  body: string().required()
}).label("GithubRelease");

const GithubReleases = array().items(GithubRelease).label("GithubReleases");

@Controller("/github/:owner/:repo")
@Name("Github")
export class GithubCtrl {
  @InjectContext()
  $ctx?: PlatformContext;

  @Inject()
  cache: CacheService;

  @Inject()
  protected client: GithubClient;

  handleResponse({data}: any) {
    return data;
  }

  @Get()
  @(Returns(200).ContentType("application/json").Schema(GithubRepo))
  @(Returns(401).Description("Repository unauthorized"))
  async get(@PathParams("owner") owner: string, @PathParams("repo") repo: string) {
    const data = await this.client.checkWhitelist(repo).getInfo(owner, repo);

    return {
      id: data.id,
      html_url: data.html_url,
      stargazers_count: data.stargazers_count,
      watchers_count: data.watchers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count
    };
  }

  @Get("/contributors")
  @(Returns(200).ContentType("application/json").Schema(GithubContributors))
  @(Returns(401).Description("Repository unauthorized"))
  async getContributors(@PathParams("owner") owner: string, @PathParams("repo") repo: string) {
    return this.client.checkWhitelist(repo).getContributors(owner, repo, 1, 100);
  }

  @Get("/releases")
  @(Returns(200).ContentType("application/json").Schema(GithubReleases))
  @(Returns(401).Description("Repository unauthorized"))
  async getReleases(
    @PathParams("owner") owner: string,
    @PathParams("repo") repo: string,
    @QueryParams("page", Number) @Min(1) @Default(1) page = 1,
    @QueryParams("per_page", Number) @Max(100) @Default(30) per_page = 30
  ) {
    return this.client.checkWhitelist(repo).getReleases(owner, repo, page, per_page);
  }

  @Post("/webhook")
  @(Returns(200, String).Examples("OK"))
  async webhook(@HeaderParams("x-github-event") event: string, @BodyParams() payload: GithubWebhookPayload) {
    const [owner, repo] = payload.repository.fullName.split("/");

    switch (event) {
      case "release":
        await this.cache.deleteMatchingKeys(new RegExp(`GithubClient:getReleases:${owner}:${repo}`));
        await this.cache.deleteMatchingKeys(new RegExp(`GithubClient:getContributors:${owner}:${repo}`));
        break;
      case "star":
        await this.cache.deleteMatchingKeys(new RegExp(`GithubClient:getInfo:${owner}:${repo}`));
        break;
    }

    return "OK";
  }
}
