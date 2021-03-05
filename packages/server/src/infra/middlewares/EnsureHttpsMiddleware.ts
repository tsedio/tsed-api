import {HeaderParams, IMiddleware, Middleware, Req, Res} from "@tsed/common";

@Middleware()
export class EnsureHttpsMiddleware implements IMiddleware {
  use(@HeaderParams("x-forwarded-proto") protocol: string, @HeaderParams("host") host: string, @Req("url") url: string, @Res() res: Res) {
    if (protocol !== "https") {
      res.redirect(`https://${host}${url}`);
    }
  }
}
