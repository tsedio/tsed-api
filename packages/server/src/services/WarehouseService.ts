import {Injectable, UseCache} from "@tsed/common";
import {Constant, Inject} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {NpmPackage} from "../domain/npm/NpmPackage";
import {GithubClient} from "../infra/back/github/GithubClient";
import {NpmClient} from "../infra/back/npm/NpmClient";

@Injectable()
export class WarehouseService {
  @Inject()
  protected npmClient: NpmClient;

  @Inject()
  protected githubClient: GithubClient;

  @Inject()
  protected formioDatabase: FormioDatabase;

  private formId: string;

  @UseCache({
    ttl: 3600
  })
  async getPlugins(keyword: string) {
    const packages = await this.npmClient.search(keyword);

    const result = await Promise.all(
      packages.map(async (pkg) => {
        const submission = await this.getPackageSubmission(pkg);

        if (submission.data.disabled) {
          return false;
        }

        pkg.icon = submission.data.icon;
        pkg.tags = submission.data.tags;
        pkg.description = submission.data.description || pkg.description;
        pkg.stars = await this.getStars(pkg);

        return pkg;
      })
    );

    return result.filter(Boolean);
  }

  async getStars(pkg: NpmPackage) {
    const meta = pkg.getRepositoryOwner();

    if (!meta) {
      return 0;
    }

    const {stargazers_count} = await this.githubClient.getInfo(meta.owner, meta.repo);

    return stargazers_count;
  }

  async getPackagesFormId() {
    if (!this.formId) {
      const form = await this.formioDatabase.formModel.findOne({name: {$eq: "packages"}});
      if (form) {
        this.formId = form._id;
      }
    }

    return this.formId;
  }

  async getPackageSubmission(pkg: NpmPackage): Promise<FormioSubmission<NpmPackage & {disabled: boolean}>> {
    const formId = await this.getPackagesFormId();

    const submission = await this.formioDatabase.submissionModel.findOne({
      form: {$eq: formId},
      data: {
        name: {$eq: pkg.name}
      }
    });

    if (!submission) {
      return await new this.formioDatabase.submissionModel({
        form: formId,
        data: {
          name: pkg.name,
          description: pkg.description,
          icon: ""
        }
      }).save();
    }

    return submission;
  }
}
