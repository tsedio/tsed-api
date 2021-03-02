import { selectAuth } from "@tsed/react-formio";
import { hasRoles } from "../auth/auth.utils";
import { NavItem } from "./nav.reducers";

export function selectRootNav(state: any) {
  return state.nav.data;
}

export function selectNav(state: any): NavItem[] {
  const auth = selectAuth(state);

  const nav = selectRootNav(state);
  const filter = (item: any) => {
    return item.roles ? hasRoles(auth, item.roles) : true;
  };

  return nav
    .map((item: NavItem) => {
      return {
        ...item,
        items: item.items?.filter(filter) || []
      };
    })
    .filter((item: NavItem) => item.items.length)
    .filter(filter);
}
