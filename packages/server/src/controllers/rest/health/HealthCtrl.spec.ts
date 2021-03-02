import {PlatformTest} from "@tsed/common";
import {HealthCtrl} from "./HealthCtrl";

describe("VersionCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should return OK", async () => {
    const controller = await PlatformTest.invoke<HealthCtrl>(HealthCtrl);

    expect(controller.get()).toEqual("OK");
  });
});
