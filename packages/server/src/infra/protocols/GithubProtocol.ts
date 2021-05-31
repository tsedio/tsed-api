import {Context} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Arg, Protocol} from "@tsed/passport";
import {OnVerify} from "@tsed/passport";
import {Strategy, StrategyOptions} from "passport-github";
import {OAuthAction} from "../formio/actions/oauth/OAuthAction";

@Protocol<StrategyOptions>({
  name: "github",
  useStrategy: Strategy,
  settings: {
    clientID: process.env.GH_CLIENT_ID || "",
    clientSecret: process.env.GH_CLIENT_SECRET || "",
    callbackURL: process.env.GH_REDIRECT_URI || ""
  }
})
export class GithubProtocol implements OnVerify {
  @Inject()
  oauthAction: OAuthAction;

  $onVerify(@Arg(0) accessToken: any, @Arg(1) refreshToken: any, @Arg(2) profile: any, @Context() ctx: Context): any {
    return this.oauthAction.verify(
      {
        id: profile.id,
        email: profile._json.email || profile.username,
        login: profile.username,
        name: profile.displayName
      },
      accessToken,
      refreshToken,
      ctx
    );
  }
}
