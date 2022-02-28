import {FormioModule as Base} from "@tsed/formio";

export class FormioModule extends Base {
  async $onRoutesInit() {
    if (this.formio.isInit()) {
      this.formio.router
        .get("/exports/schema", () => {
          return {
            ok: "OK"
          };
        })
        .post("/exports", () => {
          return {
            ok: "OK"
          };
        });
    }

    return super.$onRoutesInit();
  }
}
