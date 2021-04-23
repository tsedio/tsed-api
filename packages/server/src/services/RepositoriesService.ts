import {Inject, Service} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {MongooseDocument} from "@tsed/mongoose";
import {FormioRepository} from "./FormioRepository";

export interface RepositoryDataModel extends Record<string, any> {
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

  async addLinkView(repository: MongooseDocument<FormioSubmission<RepositoryDataModel>>, type: string) {
    const key = `${type}Tracking`;
    repository.data[key] = (repository.data[key] || 0) + 1;

    await this.saveSubmission(repository);
  }
}
