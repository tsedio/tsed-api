import {Injectable, Logger} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase, FormioForm} from "@tsed/formio";
import userLoginOAuthAction from "./data/form-userLogin-oauth-action.json";
import userLoginForm from "./data/form-userLogin.json";

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
    this.logger.info("Check user migration...");
    const form = await this.formioDatabase.getForm("userLogin");

    if (form && this.shouldUpdate(form as FormioForm)) {
      try {
        this.logger.info("Create form definition...");
        await this.formioDatabase.saveFormDefinition({...userLoginForm, _id: form._id.toString()} as any);

        this.logger.info("Create action...");
        await new this.formioDatabase.actionModel({
          ...userLoginOAuthAction,
          form: form._id
        }).save();
      } catch (er) {
        this.logger.error({
          event: "FORMIO_MIGRATION_ERROR",
          error: er
        });
      }
    }

    this.logger.info("Check user migration...OK");
  }

  shouldUpdate(form: FormioForm) {
    return !form.components.find((component) => component.key === "connectWithGithub");
  }
}
