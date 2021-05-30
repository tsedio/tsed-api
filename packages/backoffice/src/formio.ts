import { Formio, Templates } from "@tsed/react-formio";
import tailwind from "@tsed/tailwind-formio";
import { Config } from "./config";

export function install(store: any) {
  Formio.setProjectUrl(Config.formioUrl);
  Formio.setBaseUrl(Config.formioUrl);

  // Formio.registerPlugin(
  //   {
  //     priority: 0,
  //     wrapRequestPromise(promise: Promise<any>) {
  //       return promise.catch((er) => {
  //         if (er === "Unauthorized") {
  //           // store.dispatch(logout());
  //         }
  //         throw er;
  //       });
  //     }
  //   },
  //   "connectStore"
  // );

  Formio.use(tailwind);
  Templates.framework = "tailwind";
}
