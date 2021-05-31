import {BodyParams, Context, Inject} from "@tsed/common";
import {getValue, uniqBy} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {Forbidden} from "@tsed/exceptions";
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
  FormioSubmission,
  WithID
} from "@tsed/formio";
import {PROVIDER_TYPE_PROTOCOL} from "@tsed/passport";
import {Request, Response} from "express";
import type {OAuth2} from "oauth";
import Passport from "passport";
import * as oauth2 from "passport-oauth2";
import {promisify} from "util";
import "./AlterSubmissionParams";
import "./AlterValidateSubmissionForm";
import {getDropboxComponents} from "./components/getDropboxComponents";
import {getFacebookComponents} from "./components/getFacebookComponents";
import {getGithubComponents} from "./components/getGithubComponents";
import {getGoogleComponents} from "./components/getGoogleComponents";
import {getLinkedinComponents} from "./components/getLinkedinComponents";
import {getOAuthComponents} from "./components/getOAuthComponents";
import {getOffice365Components} from "./components/getOffice365Components";
import {mapProfile, Profile} from "./utils/mapProfile";

function findButtons(forms: any[], result: any[] = []) {
  forms.forEach((form: any) => {
    if (form.type === "button" && form.action === "oauth") {
      result.push(form);
    }
    if (form.components) {
      findButtons(form.components, result);
    }
  });

  return result;
}

function getOAuth2(strategy: any): OAuth2 | undefined {
  return strategy._oauth2;
}

const ASSOCIATION_LIST = [
  // {
  //   association: "remote",
  //   title: "Remote Authentication (not implemented)"
  // },
  {
    association: "existing",
    title: "Login Existing Resource"
  },
  {
    association: "new",
    title: "Register New Resource"
  },
  {
    association: "link",
    title: "Link Current User"
  }
];

const getOneOf = (scope: any, ...keys: string[]) => {
  for (const key of keys) {
    const value = getValue(scope, key);
    if (value !== undefined) {
      return value;
    }
  }
};

@Action({
  name: "oauth",
  title: "OAuth",
  description: "Provides OAuth authentication behavior to this form.",
  priority: 20,
  defaults: {
    handler: ["before", "after"],
    method: ["form", "create"]
  },
  access: {
    handler: false,
    method: false
  }
})
export class OAuthAction implements ActionMethods {
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

  async resolve(@BodyParams("oauth") oauth: Record<string, any>, @Context() ctx: Context, @ActionCtx() actionCtx: ActionCtx): Promise<any> {
    const {handler, method, action} = actionCtx;

    // Attach OAuth information to the current form
    if (handler === "after" && method === "form") {
      const form = getValue<FormioForm>(ctx.getResponse(), "resource.item");

      if (form?._id) {
        this.attachOAuth(form, action);
      }
      return;
    }

    // Initiate OAuth workflow login
    if (handler === "before" && method === "create" && oauth) {
      const [providerName, params] = Object.entries(oauth)[0];

      ctx.getRequest().query = params;
      ctx.set("formio:action", action);

      await promisify(Passport.authenticate(providerName))(ctx.getRequest(), ctx.getResponse());

      ctx.getRequest().skipAuth = true;
    }
  }

  async settingsForm(req: Request, response: Response): Promise<FormioComponent[]> {
    const [roles, oAuthButtons] = await Promise.all([this.formioAuth.getRoles(req), this.getOAuthButtons()]);
    const basePath = this.hooks.alter("path", "/form", req);
    const oAuthProviders = this.injector.getProviders(PROVIDER_TYPE_PROTOCOL).reduce((providers, provider) => {
      const {name} = provider.store.get("protocol");
      const strategy = provider.instance.$strategy as oauth2.Strategy;
      const oauth2 = getOAuth2(strategy);

      if (!oauth2) {
        return providers;
      }

      return [...providers, {name, title: name}];
    }, []);

    return [
      {
        type: "select",
        input: true,
        label: "OAuth Provider",
        key: "provider",
        placeholder: "Select the OAuth Provider",
        template: "<span>{{ item.title }}</span>",
        dataSrc: "json",
        data: {
          json: JSON.stringify(oAuthProviders)
        },
        valueProperty: "name",
        multiple: false,
        validate: {
          required: true
        }
      },
      {
        type: "select",
        input: true,
        label: "Action",
        key: "association",
        placeholder: "Select the action to perform",
        template: "<span>{{ item.title }}</span>",
        dataSrc: "json",
        data: {
          json: JSON.stringify(ASSOCIATION_LIST)
        },
        valueProperty: "association",
        multiple: false,
        validate: {
          required: true
        }
      },
      {
        type: "select",
        input: true,
        label: "Resource",
        key: "resource",
        placeholder: "Select the Resource to authenticate against",
        template: "<span>{{ item.title }}</span>",
        dataSrc: "url",
        data: {
          url: `${basePath}?type=resource`
        },
        valueProperty: "_id",
        multiple: false,
        validate: {
          required: true
        },
        customConditional: "show = ['existing', 'new'].indexOf(_.get(data, \"settings.association\")) !== -1;"
      },
      {
        type: "select",
        input: true,
        label: "Role",
        key: "role",
        placeholder: "Select the Role that will be added to new Resources",
        template: "<span>{{ item.title }}</span>",
        dataSrc: "json",
        data: {
          json: JSON.stringify(roles)
        },
        valueProperty: "_id",
        multiple: false,
        customConditional: "show = ['new'].indexOf(data.settings.association) !== -1;"
      },
      {
        type: "select",
        input: true,
        label: "Sign-in with OAuth Button",
        key: "button",
        placeholder: "Select the button that triggers OAuth sign-in",
        template: "<span>{{ item.label || item.key }}</span>",
        dataSrc: "json",
        data: {
          json: JSON.stringify(oAuthButtons)
        },
        valueProperty: "key",
        multiple: false,
        validate: {
          required: true
        }
      },
      {
        input: true,
        tree: true,
        components: [
          {
            input: true,
            inputType: "text",
            label: "Claim",
            key: "claim",
            multiple: false,
            placeholder: "Leave empty for everyone",
            defaultValue: "",
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            type: "textfield"
          },
          {
            input: true,
            inputType: "text",
            label: "Value",
            key: "value",
            multiple: false,
            defaultValue: "",
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            type: "textfield"
          },
          {
            input: true,
            tableView: true,
            label: "Role",
            key: "role",
            placeholder: "",
            dataSrc: "json",
            data: {
              json: JSON.stringify(roles)
            },
            valueProperty: "_id",
            defaultValue: "",
            refreshOn: "",
            filter: "",
            template: "<span>{{ item.title }}</span>",
            multiple: false,
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: true
            },
            type: "select"
          }
        ],
        tableView: true,
        label: "Assign Roles",
        key: "roles",
        protected: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        type: "datagrid",
        customConditional: "show = ['remote'].indexOf(data.settings.association) !== -1;"
      },
      {
        type: "fieldset",
        components: [
          ...getOAuthComponents(basePath),
          ...getGithubComponents(basePath),
          ...getFacebookComponents(basePath),
          ...getOffice365Components(basePath),
          ...getDropboxComponents(basePath),
          ...getGoogleComponents(basePath),
          ...getLinkedinComponents(basePath)
        ],
        legend: "Field Mapping",
        input: false,
        key: "fieldset",
        customConditional: "show = ['new'].indexOf(data.settings.association) !== -1;"
      }
    ];
  }

  async verify(profile: Profile, accessToken: string, refreshToken: string, ctx: Context) {
    const {settings} = ctx.get("formio:action") || {};

    const {association} = settings;

    switch (association) {
      case "link":
        return this.verifyLinkProfile(profile, accessToken, refreshToken, ctx);
      case "new":
        return this.verifyNewProfile(profile, accessToken, refreshToken, ctx);
      case "existing":
        return this.verifyExistingProfile(profile, accessToken, refreshToken, ctx);
    }
  }

  protected async verifyNewProfile(profile: Profile, accessToken: string, refreshToken: string, ctx: Context) {
    const {settings} = ctx.get("formio:action") || {};
    const {provider} = settings;

    const submissionProfile = mapProfile(profile, accessToken, settings);
    let user = await this.findUserWithProvider(provider, profile, settings);

    if (!user) {
      user = (await this.formioAuth.createUser(submissionProfile)) as WithID<FormioSubmission<Profile>>;
    } else {
      user = await this.updateUser(user, submissionProfile);
    }

    await this.formioAuth.generateSession(user, ctx);

    return user;
  }

  protected async verifyExistingProfile(profile: Profile, accessToken: string, refreshToken: string, ctx: Context) {
    const {settings} = ctx.get("formio:action") || {};
    const {provider} = settings;

    const submissionProfile = mapProfile(profile, accessToken, settings);
    let user = await this.findUserWithProvider(provider, profile, settings);

    if (!user) {
      throw new Forbidden("User account creation with OAuth is not authorized. Contact your administrator to create your account before.");
    }

    user = await this.updateUser(user, submissionProfile);

    await this.formioAuth.generateSession(user, ctx);

    return user;
  }

  protected async verifyLinkProfile(profile: Profile, accessToken: string, refreshToken: string, ctx: Context) {
    const {settings} = ctx.get("formio:action") || {};

    const submissionProfile = mapProfile(profile, accessToken, settings);
    const user: WithID<FormioSubmission<Profile>> = ctx.getRequest().user;

    return this.updateUser(user, submissionProfile);
  }

  protected async getOAuthButtons() {
    const matcher = {$elemMatch: {action: "oauth"}};
    const forms = await this.formioDatabase.formModel.find({
      $or: [
        {
          components: matcher
        },
        {
          "components.components": matcher
        },
        {
          "components.components.components": matcher
        }
      ]
    });

    return findButtons(forms);
  }

  protected attachOAuth(form: FormioForm, action: FormioAction<{button: string; provider: string}>) {
    const providers = this.getOAuthProviders();

    Object.values(this.formioService.util.flattenComponents(form.components, true)).forEach((component: FormioComponent) => {
      if (component.key === action.settings.button) {
        component.oauth = providers.get(action.settings.provider)?.options;
      }
    });
  }

  protected getOAuthProviders(): Map<string, {strategy: oauth2.Strategy; instance: any; options: any}> {
    return this.injector.getProviders(PROVIDER_TYPE_PROTOCOL).reduce((providers, provider) => {
      const {name} = provider.store.get("protocol");
      const strategy = provider.instance.$strategy as oauth2.Strategy;
      const oauth2 = getOAuth2(strategy);

      if (!oauth2) {
        return providers;
      }

      const authURI = oauth2.getAuthorizeUrl().split("?")[0];
      const {settings} = getValue(provider.configuration, `passport.protocols.${name}`);

      return providers.set(name, {
        strategy,
        instance: provider.instance,
        options: {
          provider: name,
          authURI,
          clientId: getOneOf(settings, "clientID", "clientId"),
          redirectUri: getOneOf(settings, "callbackURL", "callbackUrl", "redirectUri"),
          scope: settings.scope,
          state: Buffer.from(name).toString("base64"),
          display: undefined
        }
      });
    }, new Map());
  }

  protected async findUserWithProvider(
    provider: any,
    profile: Profile,
    settings: any
  ): Promise<WithID<FormioSubmission<Profile>> | undefined> {
    const user = await this.formioDatabase.submissionModel
      .findOne({
        form: settings.resource,
        "externalIds.type": provider,
        "externalIds.id": profile.id
      })
      .lean()
      .exec();

    return user as any;
  }

  protected async updateUser(submission: WithID<FormioSubmission<Profile>>, patchUser: FormioSubmission<Profile>) {
    return this.formioAuth.updateUser<Profile>({
      ...submission,
      data: {
        ...patchUser.data,
        ...submission.data
      },
      externalIds: uniqBy([...(patchUser?.externalIds || []), ...(submission?.externalIds || [])], "type")
    });
  }
}
