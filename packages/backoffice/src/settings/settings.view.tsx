import { HomeCards } from "@tsed/shared";
import React from "react";
import { useNav } from "../nav/useNav.hook";

export function SettingsView() {
  const nav = useNav();
  const items = nav
    .getNav("home")
    .find((item) => item.title === "Administration")
    .items.find((item) => item.title === "Settings").items;

  return (
    <div className='flex justify-center flex-wrap '>
      <div className='w-full'>
        <div>{<HomeCards title={"Settings"} items={items as any} />}</div>
      </div>
    </div>
  );
}
