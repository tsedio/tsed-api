import {Inject} from "@tsed/common";
import {setValue} from "@tsed/core";
import {Alter, FormioComponent, FormioForm, FormioService} from "@tsed/formio";

@Alter("validateSubmissionForm")
export class AlterValidateSubmissionForm {
  @Inject()
  formio: FormioService;

  transform(currentForm: FormioForm, body: any, next: any) {
    if (body.oauth) {
      this.formio.util.eachComponent(currentForm.components, (component: FormioComponent) => {
        if (["email", "password"].includes(component.key)) {
          setValue(component, "validate.required", false);
        }
      });
    }

    next(currentForm);
  }
}
