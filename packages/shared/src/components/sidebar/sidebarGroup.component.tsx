import React from "react";
import { SidebarLink, SidebarLinkProps } from "./sidebarLink.component";

export interface SidebarGroupProps {
  title: string;
  items?: SidebarLinkProps[];
  sidebarOpen?: boolean;
}

export function SidebarGroup({ title, items, sidebarOpen }: SidebarGroupProps) {
  return (
    <div className={`w-full pb-3 ${sidebarOpen ? "" : "first:pb-3 pb-5"}`}>
      {sidebarOpen ? (
        <p className='flex items-center justify-start text-md pt-2 pb-1 pl-2 pr-2 m-0'>
          <span className={"font-happiness font-bold"}>{title}</span>
        </p>
      ) : null}
      <ul className='reset-list py-0'>
        {items.map((item, index) => {
          return (
            <li key={index} className={"py-1"}>
              <SidebarLink
                href={item.href}
                icon={item.icon}
                title={item.title}
                sidebarOpen={sidebarOpen}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
