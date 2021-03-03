import {Octokit} from "@octokit/rest";
import {InjectContext} from "@tsed/async-hook-context";
import {PlatformContext} from "@tsed/common";
import {Constant, Injectable} from "@tsed/di";
import {Unauthorized} from "@tsed/exceptions";
import {RequestParameters} from "@octokit/types";
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

  get repos() {
    return this.octokit.repos;
  }

  checkWhitelist(repo: string) {
    if (!this.whiteList.includes(repo)) {
      throw new Unauthorized(`Unauthorized repository`);
    }
  }
}
