import {Injectable} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase} from "@tsed/formio";
import {WarehouseService} from "../../services/WarehouseService";
import formPackagesAction from "./data/form-packages-actions.json";
import formPackages from "./data/form-packages.json";
import maintainersSchema from "./data/2021-03-24-form-schema-maintainers.json";

@Injectable()
export class WarehouseMigration {
  @Inject()
  formioDatabase: FormioDatabase;

  @Inject()
  warehouseService: WarehouseService;

  async $onReady() {
    await this.install();
  }

  async install() {
    await this.formioDatabase.createFormIfNotExists(formPackages as any, async (form) => {
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
  }

  async addMaintainers() {
    const form = await this.formioDatabase.getForm("packages");
    const component = form?.components.find((component) => component.key === "maintainers");
    if (form && component) {
      const submit = form.components[form.components.length - 1];

      form.components[form.components.length - 1] = maintainersSchema as any;
      form.components.push(submit);
    }
  }
}
