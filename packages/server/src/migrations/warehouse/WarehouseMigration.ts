import {Injectable, Logger} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase} from "@tsed/formio";
import formPackagesAction from "./data/form-packages-actions.json";
import formPackages from "./data/form-packages.json";

@Injectable()
export class WarehouseMigration {
  @Inject()
  formioDatabase: FormioDatabase;

  @Inject()
  logger: Logger;

  async $onReady() {
    await this.install();
  }

  async install() {
    this.logger.info("Check warehouse migration...");
    const mapper = await this.formioDatabase.getFormioMapper();

    await this.formioDatabase.importFormIfNotExists(formPackages as any, async (form) => {
      this.logger.info('Install "NPM packages" form');
      await new this.formioDatabase.actionModel(
        mapper.mapToImport({
          ...formPackagesAction,
          form: form._id,
          settings: {
            resource: ""
          }
        })
      ).save();
    });

    this.logger.info("Check warehouse migration...OK");
  }
}
