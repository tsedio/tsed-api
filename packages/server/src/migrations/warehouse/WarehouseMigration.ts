import {Injectable} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase} from "@tsed/formio";
import {WarehouseService} from "../../services/WarehouseService";
import formPackagesAction from "./data/form-packages-actions.json";
import formPackages from "./data/form-packages.json";

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
          resource: form._id
        }
      }).save();

      await this.warehouseService.getPlugins("tsed");
    });
  }
}
