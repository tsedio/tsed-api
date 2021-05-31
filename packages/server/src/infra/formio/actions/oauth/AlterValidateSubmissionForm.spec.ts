import {PlatformTest} from "@tsed/common";
import {FormioForm, FormioService} from "@tsed/formio";
import {AlterValidateSubmissionForm} from "./AlterValidateSubmissionForm";

describe("AlterValidateSubmissionForm", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should alter validation submission form when email field exists", async () => {
    const formio = {
      util: require("formio/src/util/util")
    };

    const service = await PlatformTest.invoke<AlterValidateSubmissionForm>(AlterValidateSubmissionForm, [
      {
        token: FormioService,
        use: formio
      }
    ]);
    const form: FormioForm = {
      access: [],
      deleted: null,
      name: "",
      owner: "",
      path: "",
      submissionAccess: [],
      title: "",
      type: "",
      _id: "id",
      components: [
        {
          type: "input",
          key: "email",
          validate: {
            required: true
          }
        }
      ]
    };
    const body: any = {
      oauth: "provider"
    };
    const next = jest.fn();

    service.transform(form, body, next);

    expect(form.components[0]).toEqual({
      key: "email",
      type: "input",
      validate: {
        required: false
      }
    });
    expect(next).toHaveBeenCalledWith(form);
  });
  it("should alter validation submission form when password field exists", async () => {
    const formio = {
      util: require("formio/src/util/util")
    };

    const service = await PlatformTest.invoke<AlterValidateSubmissionForm>(AlterValidateSubmissionForm, [
      {
        token: FormioService,
        use: formio
      }
    ]);
    const form: FormioForm = {
      access: [],
      deleted: null,
      name: "",
      owner: "",
      path: "",
      submissionAccess: [],
      title: "",
      type: "",
      _id: "id",
      components: [
        {
          type: "input",
          key: "password",
          validate: {
            required: true
          }
        }
      ]
    };
    const body: any = {
      oauth: "provider"
    };
    const next = jest.fn();

    service.transform(form, body, next);

    expect(form.components[0]).toEqual({
      key: "password",
      type: "input",
      validate: {
        required: false
      }
    });
    expect(next).toHaveBeenCalledWith(form);
  });
  it("should not alter form when oauth provider isn't given", async () => {
    const formio = {
      util: require("formio/src/util/util")
    };

    const service = await PlatformTest.invoke<AlterValidateSubmissionForm>(AlterValidateSubmissionForm, [
      {
        token: FormioService,
        use: formio
      }
    ]);
    const form: FormioForm = {
      access: [],
      deleted: null,
      name: "",
      owner: "",
      path: "",
      submissionAccess: [],
      title: "",
      type: "",
      _id: "id",
      components: [
        {
          type: "input",
          key: "password",
          validate: {
            required: true
          }
        }
      ]
    };
    const body: any = {};
    const next = jest.fn();

    service.transform(form, body, next);

    expect(form.components[0]).toEqual({
      key: "password",
      type: "input",
      validate: {
        required: true
      }
    });
    expect(next).toHaveBeenCalledWith(form);
  });
});
