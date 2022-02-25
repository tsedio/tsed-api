import {Injectable, UseCache} from "@tsed/common";
import {toMap} from "@tsed/core";
import {Inject} from "@tsed/di";
import {FormioSubmission} from "@tsed/formio";
import {NpmPackage} from "../domain/npm/NpmPackage";
import {GithubClient} from "../infra/back/github/GithubClient";
import {NpmClient} from "../infra/back/npm/NpmClient";
import {FormioRepository} from "./FormioRepository";

export type SubmissionPackage = FormioSubmission<NpmPackage & {disabled: boolean}>;

const RANKS = {
  premium: -1,
  official: 0,
  "3rd-party": 0
};

@Injectable()
export class WarehouseService extends FormioRepository {
  protected formName = "packages";

  @Inject()
  protected npmClient: NpmClient;

  @Inject()
  protected githubClient: GithubClient;

  @UseCache({
    ttl: 3600 * 24 * 10,
    refreshThreshold: 900,
    type: NpmPackage,
    collectionType: Array
  })
  async getPlugins(keyword: string): Promise<NpmPackage[]> {
    const [packages, submissions] = await Promise.all([this.npmClient.search(keyword), this.getPackagesSubmissions()]);

    const submissionsPackagesMap = toMap(submissions, (item: SubmissionPackage) => item.data.name);

    const result = await Promise.all(
      packages.map(async (pkg) => {
        if (!submissionsPackagesMap.has(pkg.name)) {
          submissionsPackagesMap.set(pkg.name, await this.createPackage(pkg));
        }

        const submission = submissionsPackagesMap.get(pkg.name);
        submissionsPackagesMap.delete(pkg.name);

        if (submission.data.disabled) {
          return false;
        }

        pkg.icon = submission.data.icon;
        pkg.tags = submission.data.tags;
        pkg.description = submission.data.description || pkg.description;
        pkg.homepage = (submission.data.homepage || pkg.homepage || pkg.repository || pkg.npm || "").replace("//packages", "/packages");
        pkg.stars = await this.getStars(pkg);

        if (submission.data.maintainers) {
          pkg.maintainers.push(...submission.data.maintainers);
        }

        return pkg;
      })
    );

    const otherPackages = [...submissionsPackagesMap.values()].map((submissionPackage) => {
      return new NpmPackage({
        ...submissionPackage.data
      });
    });

    return [...otherPackages, ...(result.filter(Boolean) as NpmPackage[])].sort((p1, p2) => {
      if (RANKS[p1.type] < RANKS[p2.type]) {
        return -1;
      }

      if (p1.downloads > p2.downloads) {
        return -1;
      }

      return 1;
    });
  }

  async getStars(pkg: NpmPackage) {
    const meta = pkg.getRepositoryOwner();

    if (!meta) {
      return 0;
    }

    const {stargazers_count} = await this.githubClient.getInfo(meta.owner, meta.repo);

    return stargazers_count;
  }

  getPackagesSubmissions(): Promise<SubmissionPackage> {
    return this.getSubmissions() as Promise<any>;
  }

  async createPackage(pkg: NpmPackage): Promise<SubmissionPackage> {
    return this.saveSubmission({
      data: {
        name: pkg.name,
        description: pkg.description,
        icon: ""
      }
    });
  }
}
