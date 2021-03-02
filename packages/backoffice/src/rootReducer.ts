import { loaderReducer } from "@project/shared";
import { defaultFormioReducer, formsReducer } from "@tsed/react-formio";
import { combine } from "@tsed/redux-utils";
import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { navReducer } from "./nav/nav.reducers";

export const rootReducers = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    ...defaultFormioReducer,
    ...combine(
      navReducer("nav"),
      loaderReducer("loader"),
      formsReducer("forms", { query: { type: "form", tags: ["common"] } }),
      formsReducer("resources", {
        query: { type: "resource", tags: ["common"] }
      })
    )
  });
