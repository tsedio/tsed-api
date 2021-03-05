import {PlatformTest} from "@tsed/common";
import {EnsureHttpsMiddleware} from "./EnsureHttpsMiddleware";

describe("EnsureHttpsMiddleware", () => {
  it(
    "should redirect http to https",
    PlatformTest.inject([EnsureHttpsMiddleware], (middleware: EnsureHttpsMiddleware) => {
      const res: any = {
        redirect: jest.fn()
      };

      middleware.use("http", "host", "/test", res);

      expect(res.redirect).toHaveBeenCalledWith("https://host/test");
    })
  );
  it(
    "should do nothing",
    PlatformTest.inject([EnsureHttpsMiddleware], (middleware: EnsureHttpsMiddleware) => {
      const res: any = {
        redirect: jest.fn()
      };

      middleware.use("https", "host", "/test", res);

      expect(res.redirect).not.toHaveBeenCalled();
    })
  );
});
