import {PlatformTest} from "@tsed/common";
import {VersionCtrl} from "./VersionCtrl";

describe("VersionCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should return version", async () => {
    const controller = await PlatformTest.invoke<VersionCtrl>(VersionCtrl);

    expect(controller.get()).toEqual({
      version: require("../../../../package.json").version
    });
  });
});
