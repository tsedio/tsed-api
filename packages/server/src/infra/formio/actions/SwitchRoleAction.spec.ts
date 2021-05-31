import {PlatformTest} from "@tsed/common";
import {catchAsyncError} from "@tsed/core";
import {ActionCtx, FormioAuthService} from "@tsed/formio";
import {SwitchRoleAction} from "./SwitchRoleAction";

describe("SwitchRoleAction", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("resolve()", () => {
    it("should attach role to the form", async () => {
      const getRoles = jest.fn().mockResolvedValue([
        {
          _id: "roleId",
          title: "role"
        }
      ]);
      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            getRoles
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const form = {
        _id: "_id",
        components: [
          {
            key: "fieldname"
          },
          {
            key: "submit"
          }
        ]
      };
      ctx.getResponse().resource = {
        item: form
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "form",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(getRoles).toHaveBeenCalledWith(ctx.getRequest());
      expect(form).toEqual({
        _id: "_id",
        components: [
          {
            key: "fieldname"
          },
          {
            customConditional: 'show = submission._id !== "userId"',
            data: {
              json: [
                {
                  _id: "roleId",
                  title: "role"
                }
              ]
            },
            dataSrc: "json",
            defaultValue: "default-role",
            input: true,
            key: "role",
            label: "Role",
            multiple: false,
            placeholder: "Select the Role",
            template: "<span>{{ item.title }}</span>",
            type: "select",
            validate: {
              required: true
            },
            valueProperty: "_id"
          },
          {
            key: "submit"
          }
        ]
      });
    });
    it("should not attach role if the user isn't an admin", async () => {
      const getRoles = jest.fn().mockResolvedValue([
        {
          _id: "roleId",
          title: "role"
        }
      ]);
      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            getRoles
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const form = {
        _id: "_id",
        components: [
          {
            key: "fieldname"
          },
          {
            key: "submit"
          }
        ]
      };
      ctx.getResponse().resource = {
        item: form
      };
      ctx.getRequest().isAdmin = false;
      ctx.getRequest().user = {
        _id: "userId"
      };

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "form",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(getRoles).not.toHaveBeenCalled();
      expect(form).toEqual({
        _id: "_id",
        components: [
          {
            key: "fieldname"
          },
          {
            key: "submit"
          }
        ]
      });
    });
    it("should read role", async () => {
      const getRoles = jest.fn().mockResolvedValue([
        {
          _id: "roleId",
          title: "role"
        }
      ]);
      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            getRoles
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {},
        roles: ["roleId"]
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "read",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(submission).toEqual({
        _id: "_id",
        data: {
          role: "roleId"
        },
        roles: ["roleId"]
      });
    });
    it("should read role and apply default role", async () => {
      const getRoles = jest.fn().mockResolvedValue([
        {
          _id: "roleId",
          title: "role"
        }
      ]);
      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            getRoles
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {}
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "read",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(submission).toEqual({
        _id: "_id",
        data: {
          role: "default-role"
        }
      });
    });
    it("should save role (create)", async () => {
      const updateUserRole = jest.fn().mockResolvedValue({});

      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            updateUserRole
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {
          role: "newRoleId"
        },
        roles: ["roleId"]
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };
      ctx.getRequest().submission = submission;

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "create",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(updateUserRole).toHaveBeenCalledWith("_id", "newRoleId", ctx.getRequest());
      expect(submission).toEqual({
        _id: "_id",
        data: {
          role: "newRoleId"
        },
        roles: ["newRoleId"]
      });
    });
    it("should save role (update)", async () => {
      const updateUserRole = jest.fn().mockResolvedValue({});

      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            updateUserRole
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {
          role: "newRoleId"
        },
        roles: ["roleId"]
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };
      ctx.getRequest().submission = submission;

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "update",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(updateUserRole).toHaveBeenCalledWith("_id", "newRoleId", ctx.getRequest());
      expect(submission).toEqual({
        _id: "_id",
        data: {
          role: "newRoleId"
        },
        roles: ["newRoleId"]
      });
    });
    it("should not save the role if the user isn't an admin", async () => {
      const updateUserRole = jest.fn().mockResolvedValue({});

      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            updateUserRole
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {
          role: "newRoleId"
        },
        roles: ["roleId"]
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = false;
      ctx.getRequest().user = {
        _id: "userId"
      };
      ctx.getRequest().submission = submission;

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "create",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      await switchRoleAction.resolve(ctx, actionCtx);

      expect(updateUserRole).not.toHaveBeenCalled();
    });
    it("should throw an error when saving role, if the role is missing", async () => {
      const updateUserRole = jest.fn().mockResolvedValue({});

      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            updateUserRole
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();
      const submission = {
        _id: "_id",
        data: {},
        roles: ["roleId"]
      };
      ctx.getResponse().resource = {
        item: submission
      };
      ctx.getRequest().isAdmin = true;
      ctx.getRequest().user = {
        _id: "userId"
      };
      ctx.getRequest().submission = submission;

      const actionCtx: ActionCtx = {
        handler: "after",
        method: "update",
        action: {
          settings: {
            role: "default-role"
          }
        } as any
      } as any;

      const error = await catchAsyncError(() => switchRoleAction.resolve(ctx, actionCtx));

      expect(error?.message).toEqual("Missing role");
    });
  });
  describe("settingsForm()", () => {
    it("should return the form configuration", async () => {
      const getRoles = jest.fn().mockResolvedValue([
        {
          _id: "roleId",
          title: "role"
        }
      ]);
      const switchRoleAction = await PlatformTest.invoke<SwitchRoleAction>(SwitchRoleAction, [
        {
          token: FormioAuthService,
          use: {
            getRoles
          }
        }
      ]);
      const ctx = PlatformTest.createRequestContext();

      const settings = await switchRoleAction.settingsForm(ctx.getRequest(), ctx.getResponse());

      expect(getRoles).toHaveBeenCalledWith(ctx.getRequest());
      expect(settings).toEqual([
        {
          type: "select",
          input: true,
          label: "Role",
          key: "role",
          placeholder: "Select the default Role when a data is submitted",
          template: "<span>{{ item.title }}</span>",
          dataSrc: "json",
          data: {
            json: [
              {
                _id: "roleId",
                title: "role"
              }
            ]
          },
          valueProperty: "_id",
          multiple: false,
          validate: {
            required: true
          }
        }
      ]);
    });
  });
});
