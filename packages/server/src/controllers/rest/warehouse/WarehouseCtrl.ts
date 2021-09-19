import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Name, Returns} from "@tsed/schema";
import {NpmPackage} from "../../../domain/npm/NpmPackage";
import {WarehouseService} from "../../../services/WarehouseService";

@Controller("/warehouse")
@Name("Warehouse")
export class WarehouseCtrl {
  @Inject()
  protected warehouseService: WarehouseService;

  @Get("/")
  @(Returns(200, Array).Of(NpmPackage).ContentType("application/json"))
  getPlugins() {
    return this.warehouseService.getPlugins("tsed");
  }
}
