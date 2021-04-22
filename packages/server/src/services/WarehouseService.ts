import {Injectable} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {NpmPackage} from "../domain/npm/NpmPackage";
import {GithubClient} from "../infra/back/github/GithubClient";
import {NpmClient} from "../infra/back/npm/NpmClient";
import {FormioRepository} from "./FormioRepository";

@Injectable()
export class WarehouseService extends FormioRepository {
  protected formName = "packages";

  @Inject()
  protected npmClient: NpmClient;

  @Inject()
  protected githubClient: GithubClient;

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
        pkg.homepage = submission.data.homepage || pkg.homepage || pkg.repository || pkg.npm;
        pkg.stars = await this.getStars(pkg);

        if (submission.data.maintainers) {
          pkg.maintainers.push(...submission.data.maintainers);
        }

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

  async getPackageSubmission(pkg: NpmPackage): Promise<FormioSubmission<NpmPackage & {disabled: boolean}>> {
    const submission = await this.findOneSubmission({
      "data.name": pkg.name
    });

    if (!submission) {
      return await this.saveSubmission({
        data: {
          name: pkg.name,
          description: pkg.description,
          icon: ""
        }
      });
    }

    return submission as any;
  }
}
