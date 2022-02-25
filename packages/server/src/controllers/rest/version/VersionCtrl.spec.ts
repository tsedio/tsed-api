import {PlatformTest} from "@tsed/common";
import {VersionCtrl} from "./VersionCtrl";

describe("VersionCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should return version", async () => {
    const controller = await PlatformTest.invoke<VersionCtrl>(VersionCtrl);

    expect(await controller.get()).toEqual({
      version: require("../../../../package.json").version
    });
  });

  it("should return nothing when the front-end perform oauth redirection", async () => {
    const controller = await PlatformTest.invoke<VersionCtrl>(VersionCtrl);

    expect(await controller.get("code")).toEqual(undefined);
  });
});
