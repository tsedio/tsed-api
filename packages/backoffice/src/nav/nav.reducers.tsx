import { createReducer } from "@tsed/redux-utils";
import nav from "../nav.config";
import { receiveNav } from "./nav.actions";

export interface NavItem extends Record<string, any> {
  title?: string | any;
  roles?: string[];
  items?: NavItem[];
  groups?: string[];
  href?: string;
  description?: string;
  icon?: string;
  operations?: Record<string, boolean>;
}

export interface NavState {
  isActive: boolean;
  data: NavItem[];
  error: null | Error;
}

function createInitialState(): NavState {
  return {
    isActive: false,
    data: nav,
    error: null
  };
}

export const navReducer = createReducer<NavState>({}, createInitialState).on(
  receiveNav,
  (state, { items }) => {
    return {
      ...state,
      data: nav.concat(items)
    };
  }
);
