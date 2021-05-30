import {PlatformTest} from "@tsed/common";
import {AlterSubmissionParams} from "./AlterSubmissionParams";

describe("AlterSubmissionParams", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should alter submission parameters", () => {
    const service = PlatformTest.get<AlterSubmissionParams>(AlterSubmissionParams);

    expect(service.transform(["form"])).toEqual(["form", "oauth"]);
  });
});
