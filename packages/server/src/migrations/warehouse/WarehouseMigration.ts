import {Injectable, Logger} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase} from "@tsed/formio";
import {Utils} from "formiojs";
import {WarehouseService} from "../../services/WarehouseService";
import maintainersSchema from "./data/2021-03-24-form-schema-maintainers.json";
import formPackagesAction from "./data/form-packages-actions.json";
import formPackages from "./data/form-packages.json";
import getComponent = Utils.getComponent;

@Injectable()
export class WarehouseMigration {
  @Inject()
  formioDatabase: FormioDatabase;

  @Inject()
  warehouseService: WarehouseService;

  @Inject()
  logger: Logger;

  async $onReady() {
    await this.install();
  }

  async install() {
    this.logger.info("Check warehouse migration...");
    await this.formioDatabase.createFormIfNotExists(formPackages as any, async (form) => {
      this.logger.info('Install "NPM packages" form');
      await new this.formioDatabase.actionModel({
        ...formPackagesAction,
        form: form._id,
        settings: {
          resource: ""
        }
      }).save();

      await this.warehouseService.getPlugins("tsed");
    });

    // update schema
    await this.addMaintainers();

    this.logger.info("Check warehouse migration...OK");
  }

  async addMaintainers() {
    const form = await this.formioDatabase.getForm("packages");
    if (form) {
      const component = getComponent(form.components, "maintainers", false);
      const submit = getComponent(form.components, "submit", false);

      if (form && !component) {
        this.logger.info("Add maintainers to warehouse form...START");

        form.components = form.components.filter((component) => component.key !== "submit").filter(Boolean);
        form.components.push(maintainersSchema as any);

        submit && form.components.push(submit);

        await form.save();

        this.logger.info("Add maintainers to warehouse form...OK");
      }
    }
  }
}
