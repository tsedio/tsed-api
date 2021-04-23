import {Context, Controller, Get, PathParams} from "@tsed/common";
import {Inject} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {MaxLength, Name, Returns} from "@tsed/schema";
import {RepositoriesService} from "../../../services/RepositoriesService";

@Controller("/slack/:owner/:repo")
@Name("Slack")
export class SlackCtrl {
  @Inject()
  repositoriesService: RepositoriesService;

  @Get("/")
  @Returns(302)
  @Returns(404)
  async redirectToChannel(
    @PathParams("owner") @MaxLength(50) owner: string,
    @PathParams("repo") @MaxLength(50) repo: string,
    @Context() ctx: Context
  ) {
    const repository = await this.repositoriesService.getRepository(owner, repo);

    if (!repository) {
      throw new NotFound("Repository not found");
    }

    if (!repository.data.slackChannelUrl) {
      throw new NotFound("Channel url not found");
    }

    await this.repositoriesService.addLinkView(repository, "slack");

    return ctx.response.redirect(302, repository.data.slackChannelUrl).body(repository.data.slackChannelUrl);
  }
}
