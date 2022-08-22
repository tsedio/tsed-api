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
    const mapper = await this.formioDatabase.getFormioMapper();

    await this.formioDatabase.importFormIfNotExists(formRepositories as any, async (form) => {
      this.logger.info('Install "Repositories" form');
      const action = mapper.mapToImport({
        ...formRepositoriesAction,
        form: form._id,
        settings: {
          resource: ""
        }
      });

      await new this.formioDatabase.actionModel(action).save();
    });

    this.logger.info("Check repositories migration...OK");
  }
}
