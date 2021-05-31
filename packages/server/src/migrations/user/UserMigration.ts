import {Injectable, Logger} from "@tsed/common";
import {Inject} from "@tsed/di";
import {FormioDatabase, FormioForm} from "@tsed/formio";
import userLoginForm from "./data/form-userLogin.json";
import userLoginOAuthAction from "./data/form-userLogin-oauth-action.json";
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
      await this.formioDatabase.saveFormDefinition(userLoginForm as any);
      await new this.formioDatabase.actionModel({
        ...userLoginOAuthAction,
        form: form._id
      }).save();
    }

    this.logger.info("Check user migration...OK");
  }

  shouldUpdate(form: FormioForm) {
    return !form.components.find((component) => component.key === "connectWithGithub");
  }
}
