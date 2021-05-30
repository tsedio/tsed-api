// import {Inject} from "@tsed/common";
// import {getValue} from "@tsed/core";
// import {InjectorService} from "@tsed/di";
// import {Alter, AlterHook, FormioComponent, FormioForm} from "@tsed/formio";
// import {PROVIDER_TYPE_PROTOCOL} from "@tsed/passport";
// import {Request, Response} from "express";
// import {Utils} from "formiojs";
// import * as oauth2 from "passport-oauth2";
// import flattenComponents = Utils.flattenComponents;
//
// @Alter("formRoutes")
// export class AlterFormRoutes implements AlterHook {
//   @Inject()
//   injector: InjectorService;
//
//   transform(formResource: any) {
//     // formResource.hooks.get = {
//       after: async (req: Request, res: Response, form: FormioForm, next: any) => {
//         await this.attachOAuth(form);
//         next();
//       }
//     };
//
//     return formResource;
//   }
//
//   attachOAuth(form: FormioForm) {
//     const providers = this.getOAuthProviders();
//
//     Object.values(flattenComponents(form.components, true))
//       .filter((component: FormioComponent) => component.action === "oauth")
//       .forEach((component: FormioComponent) => {
//         component.oauth = providers.get(component.oauthProvider);
//       });
//   }
//
//   getOAuthProviders() {
//     return this.injector.getProviders(PROVIDER_TYPE_PROTOCOL).reduce((providers, provider) => {
//       const {name} = provider.store.get("protocol");
//       const {settings} = getValue(provider.configuration, `passport.protocols.${name}`);
//       const strategy = provider.instance.$strategy as oauth2.Strategy;
//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const authURI = strategy._oauth2.getAuthorizeUrl().split("?")[0];
//
//       return providers.set(name, {
//         provider: name,
//         authURI,
//         clientId: settings.clientID || settings.clientId,
//         redirectUri: settings.callbackURL || settings.callbackUrl || settings.redirectUri,
//         scope: settings.scope,
//         state: Buffer.from(name).toString("base64"),
//         display: undefined
//       });
//     }, new Map());
//   }
// }
