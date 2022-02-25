import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {ActionCtx, FormioAuthService, FormioDatabase, FormioHooksService, FormioService} from "@tsed/formio";
import Passport from "passport";
import expectFormSettings from "./__mock__/expected-form-settings.json";
import {OAuthAction} from "./OAuthAction";

async function getOAuthFixture() {
  const authService = {
    createUser: jest.fn().mockImplementation((user) => user),
    updateUser: jest.fn().mockImplementation((user) => user),
    generateSession: jest.fn(),
    getRoles: jest.fn().mockResolvedValue([
      {
        _id: "roleId",
        title: "role"
      }
    ])
  };

  const hooksService = {
    alter: jest.fn().mockImplementation((_, value) => value)
  };
  const databaseService = {
    formModel: {
      find: jest.fn().mockResolvedValue([
        {
          _id: "id",
          components: [
            {
              type: "button",
              action: "oauth"
            }
          ]
        },
        {
          _id: "id",
          components: [
            {
              type: "form",
              components: []
            }
          ]
        }
      ])
    },
    submissionModel: {
      findOne: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }
  };
  const oAuthAction = await PlatformTest.invoke<OAuthAction>(OAuthAction, [
    {
      token: FormioAuthService,
      use: authService
    },
    {
      token: FormioHooksService,
      use: hooksService
    },
    {
      token: FormioDatabase,
      use: databaseService
    },
    {
      token: FormioService,
      use: {
        util: require("formio/src/util/util")
      }
    }
  ]);

  jest.spyOn(oAuthAction.injector, "getProviders").mockReturnValue([
    {
      token: "test1",
      store: {
        get() {
          return {name: "github"};
        }
      },
      configuration: {
        passport: {
          protocols: {
            github: {
              settings: {
                clientID: "clientID",
                clientId: "clientId",
                callbackURL: "callbackURL",
                callbackUrl: "callbackUrl",
                redirectUri: "redirectUri",
                scope: "scope"
              }
            }
          }
        }
      }
    } as any,
    {
      store: {
        get() {
          return {name: "ldap"};
        }
      }
    } as any
  ]);

  jest.spyOn(oAuthAction.injector, "get").mockImplementation((token) => {
    if (token === "test1") {
      return {
        $strategy: {
          _oauth2: {
            getAuthorizeUrl: jest.fn().mockReturnValue("https://accounts.tsed.io/auth?state=state")
          }
        }
      };
    }

    return {};
  });

  return {oAuthAction, authService, databaseService};
}

describe("OAuthAction", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("settingsForm()", () => {
    it("should return form settings", async () => {
      const {oAuthAction} = await getOAuthFixture();

      const ctx = PlatformTest.createRequestContext();

      const result = await oAuthAction.settingsForm(ctx.getRequest(), ctx.getResponse());

      expect(result).toEqual(expectFormSettings);
    });
  });
  describe("resolve()", () => {
    beforeEach(() => {
      jest.spyOn(Passport, "authenticate");
    });
    it("should attach oauth information to the form", async () => {
      const oauth = {};
      const actionCtx: ActionCtx = {
        handler: "after",
        method: "form",
        action: {
          settings: {
            role: "default-role",
            button: "github-button",
            provider: "github"
          }
        } as any
      } as any;

      const ctx = PlatformTest.createRequestContext();

      ctx.getResponse().resource = {
        item: {
          _id: "_formId",
          components: [
            {
              type: "button",
              key: "github-button",
              action: "oauth",
              oauthProvider: "github"
            }
          ]
        }
      };

      const {oAuthAction} = await getOAuthFixture();

      await oAuthAction.resolve(oauth, ctx, actionCtx);

      expect(ctx.getResponse().resource.item).toEqual({
        _id: "_formId",
        components: [
          {
            action: "oauth",
            oauthProvider: "github",
            key: "github-button",
            type: "button",
            oauth: {
              authURI: "https://accounts.tsed.io/auth",
              clientId: "clientID",
              provider: "github",
              redirectUri: "callbackURL",
              scope: "scope",
              state: "Z2l0aHVi"
            }
          }
        ]
      });
    });
    it("should initiate OAuth workflow login", async () => {
      const oauth = {
        github: {
          authURI: "https://accounts.tsed.io/auth",
          clientId: "clientID",
          provider: "github",
          redirectUri: "callbackURL",
          scope: "scope",
          state: "Z2l0aHVi"
        }
      };
      const actionCtx: ActionCtx = {
        handler: "before",
        method: "create",
        action: {
          settings: {
            role: "default-role",
            button: "github-button",
            provider: "github"
          }
        } as any
      } as any;

      const ctx = PlatformTest.createRequestContext();

      ctx.getResponse().resource = {
        item: {
          _id: "_formId",
          components: [
            {
              type: "button",
              key: "github-button",
              action: "oauth",
              oauthProvider: "github"
            }
          ]
        }
      };

      (Passport.authenticate as any).mockReturnValue(jest.fn().mockImplementation((req, res, next) => next()));

      const {oAuthAction} = await getOAuthFixture();

      await oAuthAction.resolve(oauth, ctx, actionCtx);

      expect(ctx.getRequest().query).toEqual({
        authURI: "https://accounts.tsed.io/auth",
        clientId: "clientID",
        provider: "github",
        redirectUri: "callbackURL",
        scope: "scope",
        state: "Z2l0aHVi"
      });
      expect(ctx.get("formio:action")).toEqual(actionCtx.action);
      expect(Passport.authenticate).toHaveBeenCalledWith("github");
    });
  });
  describe("verify()", () => {
    it("should verify profile and create user account (new - creation)", async () => {
      const ctx = PlatformTest.createRequestContext();
      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "id",
        email: "email",
        login: "login",
        name: "name"
      };

      ctx.set("formio:action", {
        settings: {
          role: "default-role",
          button: "github-button",
          provider: "github",
          association: "new",
          resource: "id",
          ["autofill-github-email"]: "email"
        }
      });

      const {oAuthAction, authService, databaseService} = await getOAuthFixture();

      await oAuthAction.verify(profile, accessToken, refreshToken, ctx);

      expect(databaseService.submissionModel.findOne).toHaveBeenCalledWith({
        "externalIds.id": "id",
        "externalIds.type": "github",
        form: "id"
      });
      expect(authService.createUser).toHaveBeenCalledWith({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });
      expect(authService.generateSession).toHaveBeenCalledWith(
        {
          data: {
            email: "email"
          },
          externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
          form: "id",
          roles: ["default-role"]
        },
        ctx
      );
    });
    it("should verify profile and create user account (new - update)", async () => {
      const ctx = PlatformTest.createRequestContext();
      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "id",
        email: "email",
        login: "login",
        name: "name"
      };

      ctx.set("formio:action", {
        settings: {
          role: "default-role",
          button: "github-button",
          provider: "github",
          association: "new",
          resource: "id",
          ["autofill-github-email"]: "email"
        }
      });

      const {oAuthAction, authService, databaseService} = await getOAuthFixture();

      (databaseService.submissionModel.exec as any).mockResolvedValue({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });

      await oAuthAction.verify(profile, accessToken, refreshToken, ctx);

      expect(databaseService.submissionModel.findOne).toHaveBeenCalledWith({
        "externalIds.id": "id",
        "externalIds.type": "github",
        form: "id"
      });
      expect(authService.updateUser).toHaveBeenCalledWith({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });
      expect(authService.generateSession).toHaveBeenCalledWith(
        {
          data: {
            email: "email"
          },
          externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
          form: "id",
          roles: ["default-role"]
        },
        ctx
      );
    });
    it("should verify profile and update user account (existing)", async () => {
      const ctx = PlatformTest.createRequestContext();
      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "id",
        email: "email",
        login: "login",
        name: "name"
      };

      ctx.set("formio:action", {
        settings: {
          role: "default-role",
          button: "github-button",
          provider: "github",
          association: "existing",
          resource: "id",
          ["autofill-github-email"]: "email"
        }
      });

      const {oAuthAction, authService, databaseService} = await getOAuthFixture();

      (databaseService.submissionModel.exec as any).mockResolvedValue({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });

      await oAuthAction.verify(profile, accessToken, refreshToken, ctx);

      expect(databaseService.submissionModel.findOne).toHaveBeenCalledWith({
        "externalIds.id": "id",
        "externalIds.type": "github",
        form: "id"
      });
      expect(authService.updateUser).toHaveBeenCalledWith({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });
      expect(authService.generateSession).toHaveBeenCalledWith(
        {
          data: {
            email: "email"
          },
          externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
          form: "id",
          roles: ["default-role"]
        },
        ctx
      );
    });
    it("should verify profile and throw error (existing)", async () => {
      const ctx = PlatformTest.createRequestContext();
      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "id",
        email: "email",
        login: "login",
        name: "name"
      };

      ctx.set("formio:action", {
        settings: {
          role: "default-role",
          button: "github-button",
          provider: "github",
          association: "existing",
          resource: "id",
          ["autofill-github-email"]: "email"
        }
      });

      const {oAuthAction} = await getOAuthFixture();

      const error = await catchAsyncError<any>(() => oAuthAction.verify(profile, accessToken, refreshToken, ctx));

      expect(error?.message).toEqual(
        "User account creation with OAuth is not authorized. Contact your administrator to create your account before."
      );
      expect(error?.status).toEqual(403);
    });
    it("should verify profile and link account (link)", async () => {
      const ctx = PlatformTest.createRequestContext();

      ctx.getRequest().user = {
        _id: "userId",
        data: {},
        form: "id",
        roles: ["default-role"]
      };

      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "id",
        email: "email",
        login: "login",
        name: "name"
      };

      ctx.set("formio:action", {
        settings: {
          role: "default-role",
          button: "github-button",
          provider: "github",
          association: "link",
          resource: "id",
          ["autofill-github-email"]: "email"
        }
      });

      const {oAuthAction, authService, databaseService} = await getOAuthFixture();

      (databaseService.submissionModel.exec as any).mockResolvedValue({
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });

      await oAuthAction.verify(profile, accessToken, refreshToken, ctx);

      expect(authService.updateUser).toHaveBeenCalledWith({
        _id: "userId",
        data: {
          email: "email"
        },
        externalIds: [{accessToken: "accessToken", id: "id", type: "github"}],
        form: "id",
        roles: ["default-role"]
      });
    });
  });
});
