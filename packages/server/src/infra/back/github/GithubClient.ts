import {Octokit} from "@octokit/rest";
import {RequestParameters} from "@octokit/types";
import {InjectContext} from "@tsed/async-hook-context";
import {PlatformContext, UseCache} from "@tsed/common";
import {Constant, Injectable} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {BaseLogClient} from "../http/BaseLogClient";

@Injectable()
export class GithubClient extends BaseLogClient {
  callee = "GITHUB";

  octokit: Octokit;

  @Constant("github.accessToken")
  token: string;

  @Constant("github.whitelist", [])
  whiteList: string[];

  @InjectContext()
  $ctx?: PlatformContext;

  get repos(): any {
    return this.octokit.repos;
  }

  $onInit() {
    this.octokit = new Octokit({
      auth: this.token
    });
    this.octokit.hook.before("request", (options: RequestParameters) => {
      options.startTime = new Date().getTime();

      if (options.repo) {
        this.checkWhitelist(options.repo as string);
      }
    });
    this.octokit.hook.after(
      "request",
      async (response: {status: string; data: any; headers: Record<string, string>}, options: RequestParameters) => {
        this.onSuccess({...response, ...options});
      }
    );

    this.octokit.hook.error("request", async (error: Error, options: RequestParameters) => {
      this.onError(error, options);
      throw error;
    });
  }

  @UseCache({ttl: 3600})
  async getInfo(owner: string, repo: string) {
    const {data} = await this.octokit.repos.get({owner, repo});
    return data;
  }

  @UseCache({ttl: 3600})
  async getReleases(owner: string, repo: string, page: number, per_page: number) {
    const {data} = await this.octokit.repos.listReleases({owner, repo, page, per_page});
    return data;
  }

  @UseCache({ttl: 3600})
  async getContributors(owner: string, repo: string, page: number, per_page: number) {
    const {data} = await this.octokit.repos.listContributors({owner, repo, page, per_page});
    return data;
  }

  checkWhitelist(repo: string) {
    if (!this.whiteList.includes(repo)) {
      throw new Unauthorized(`Unauthorized repository`);
    }
  }
}
