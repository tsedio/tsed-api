import { iconClass, useTooltip } from "@tsed/react-formio";
import classnames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

export interface SidebarLinkProps extends Record<string, any> {
  href?: string;
  icon?: string;
  title?: string;
  sidebarOpen?: boolean;
}

export function SidebarLink({
  href,
  icon,
  title,
  sidebarOpen
}: SidebarLinkProps) {
  const ref = useTooltip({
    title,
    trigger: "hover",
    placement: "left"
  });

  return (
    <Link
      to={href}
      className={
        "text-sidebar-white hover:text-sidebar-white-active flex items-center block transition-all hover:bg-sidebar-gray-active rounded p-2"
      }
    >
      <i
        data-testid={"icon"}
        ref={ref}
        className={classnames(
          iconClass(undefined, icon),
          !sidebarOpen && "w-full text-center",
          "text-sidebar-icon text-lg"
        )}
      />
      {sidebarOpen ? (
        <span className={"flex-1 ml-1 px-2 whitespace-no-wrap overflow"}>
          {title}
        </span>
      ) : null}
    </Link>
  );
}
