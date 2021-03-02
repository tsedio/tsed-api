import { selectForm } from "@tsed/react-formio";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NavItem } from "./nav.reducers";
import { selectNav } from "./nav.selectors";

function deepFind(
  parent: NavItem,
  map: Map<string, NavItem>,
  links: NavItem[]
) {
  parent.items.forEach((item) => {
    map.set(item.href, { ...item, links });
    item.items && deepFind(item, map, [...links, item]);
  });

  return map;
}

function findAll(nav: NavItem[], map: Map<string, NavItem> = new Map()) {
  return nav.reduce((map, item) => {
    return deepFind(item, map, [item]);
  }, map);
}

function findNested(
  location: string,
  routes: Map<string, NavItem>
): NavItem | undefined {
  if (!location) {
    return undefined;
  }
  if (routes.has(location)) {
    return routes.get(location);
  }
  const paths = location.split("/");

  return findNested(paths.slice(0, paths.length - 1).join("/"), routes);
}

export function useNav() {
  const nav = useSelector(selectNav);
  const currentLocation = useLocation();
  const routes = useMemo(() => findAll(nav), [nav]);

  const [, , formType, formId, formAction] = currentLocation.pathname.split(
    "/"
  );

  const exact = !!routes.get(currentLocation.pathname);
  let page = findNested(currentLocation.pathname, routes);
  const form = useSelector((state) => {
    if (formType) {
      const key = formType.replace(/s$/, "");
      return state[key] && selectForm(key, state);
    }
    return undefined;
  });

  const getNav = useCallback(
    (key) => {
      const filter = (item: NavItem) => item[key] === undefined;
      return nav
        .map((item) => {
          return {
            ...item,
            items: item.items?.filter(filter) || []
          };
        })
        .filter(filter);
    },
    [nav]
  );

  if (!exact && page?.formType) {
    const parent = page;

    page = {
      ...parent,
      href: currentLocation.pathname,
      formAction: formAction || formId,
      formId,
      formType: formType,
      form,
      links: [...parent.links, parent]
    };
  }

  return {
    nav,
    page,
    getNav
  };
}
