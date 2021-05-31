import {Context, Inject, PlatformContext} from "@tsed/common";
import {getValue, isFunction} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import {
  Action,
  ActionCtx,
  ActionMethods,
  FormioAction,
  FormioAuthService,
  FormioComponent,
  FormioDatabase,
  FormioForm,
  FormioHooksService,
  FormioService,
  FormioSubmission
} from "@tsed/formio";
import {Request, Response} from "express";

@Action({
  name: "switchRole",
  title: "Switch Role",
  description: "Enable role switch on resource",
  priority: 1,
  defaults: {
    handler: ["before", "after"],
    method: ["form", "create", "update", "read"]
  },
  access: {
    handler: false,
    method: false
  }
})
export class SwitchRoleAction implements ActionMethods {
  @Inject()
  injector: InjectorService;

  @Inject()
  protected formioDatabase: FormioDatabase;

  @Inject()
  protected formioAuth: FormioAuthService;

  @Inject()
  protected formioService: FormioService;

  @Inject()
  protected hooks: FormioHooksService;

  async resolve(@Context() ctx: Context, @ActionCtx() actionCtx: ActionCtx): Promise<any> {
    const {handler, method, action} = actionCtx;

    // inject roles to form
    if (handler === "after" && method === "form") {
      const resource = getValue<FormioForm>(ctx.getResponse(), "resource.item");

      if (resource?._id && ctx.getRequest().isAdmin) {
        await this.attachRole(resource, action, ctx);
      }
      return;
    }

    // Read role
    if (handler === "after" && method === "read") {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const submission = getValue<FormioSubmission>(ctx.getResponse(), "resource.item")!;

      submission.data.role = getValue(submission, "roles.0", action.settings.role);

      return;
    }

    // Save role
    if (["create", "update"].includes(method) && handler === "after" && ctx.getRequest().isAdmin) {
      await this.updateRole(ctx);
    }
  }

  async settingsForm(req: Request, response: Response): Promise<FormioComponent[]> {
    const roles = await this.formioAuth.getRoles(req);

    return [
      {
        type: "select",
        input: true,
        label: "Role",
        key: "role",
        placeholder: "Select the default Role when a data is submitted",
        template: "<span>{{ item.title }}</span>",
        dataSrc: "json",
        data: {json: roles},
        valueProperty: "_id",
        multiple: false,
        validate: {
          required: true
        }
      }
    ];
  }

  protected async updateRole(ctx: PlatformContext) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const submission = getValue<FormioSubmission>(ctx.getResponse(), "resource.item")!;
    const role = getValue<string>(ctx.getRequest(), "submission.data.role");

    if (!role) {
      throw new BadRequest("Missing role");
    }

    await this.formioAuth.updateUserRole(submission._id, role, ctx.getRequest());

    submission.roles = [role];
    submission.data.role = role;
  }

  protected async attachRole(form: FormioForm, action: FormioAction, ctx: PlatformContext) {
    const roles = await this.formioAuth.getRoles(ctx.getRequest());

    form.components = form.components
      .filter((component) => component.key !== "role")
      .reduce((components: FormioComponent[], component) => {
        if (component.key === "submit") {
          return [
            ...components,
            {
              type: "select",
              input: true,
              label: "Role",
              key: "role",
              placeholder: "Select the Role",
              template: "<span>{{ item.title }}</span>",
              dataSrc: "json",
              data: {json: roles},
              valueProperty: "_id",
              multiple: false,
              defaultValue: action.settings.role,
              validate: {
                required: true
              },
              customConditional: `show = submission._id !== "${getValue(ctx.getRequest(), "user._id")}"`
            },
            component
          ];
        }

        return [...components, component];
      }, []);

    return form;
  }
}
