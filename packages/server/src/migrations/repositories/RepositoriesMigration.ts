import {Injectable, Logger} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase} from "@tsed/formio";
import formRepositoriesAction from "./data/form-repositories-actions.json";
import formRepositories from "./data/form-repositories.json";

@Injectable()
export class RepositoriesMigration {
  @Inject()
  formioDatabase: FormioDatabase;

  @Inject()
  logger: Logger;

  async $onReady() {
    await this.install();
  }

  async install() {
    this.logger.info("Check repositories migration...");
    await this.formioDatabase.createFormIfNotExists(formRepositories as any, async (form) => {
      this.logger.info('Install "Repositories" form');
      await new this.formioDatabase.actionModel({
        ...formRepositoriesAction,
        form: form._id,
        settings: {
          resource: ""
        }
      }).save();
    });

    this.logger.info("Check repositories migration...OK");
  }
}
