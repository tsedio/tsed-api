import { createReducer } from "@tsed/redux-utils";
import { hideLoader, showLoader } from "./loader.actions";

export interface LoaderState {
  isActive: boolean;
}

const createInitialState = (options = {}) => ({
  isActive: false,
  ...options
});

export const loaderReducer = createReducer<LoaderState>({}, createInitialState)
  .on(hideLoader, (state) => {
    return {
      ...state,
      isActive: false
    };
  })
  .on(showLoader, (state) => {
    return {
      ...state,
      isActive: true
    };
  });
