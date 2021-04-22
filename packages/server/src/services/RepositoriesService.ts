import {Inject, Service} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {FormioRepository} from "./FormioRepository";

export interface RepositoryDataModel {
  repositoryOwner: string;
  repositoryName: string;
  slackChannelUrl?: string;
}

@Service()
export class RepositoriesService extends FormioRepository<RepositoryDataModel> {
  protected formName = "repositories";

  @Inject()
  protected formioDatabase: FormioDatabase;

  async getRepository(owner: string, repo: string) {
    return this.findOneSubmission({
      "data.repositoryOwner": owner.toLowerCase(),
      "data.repositoryName": repo.toLowerCase()
    });
  }
}
