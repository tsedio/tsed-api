import { HomeCards } from "@tsed/shared";
import React from "react";
import { useNav } from "../nav/useNav.hook";

export function BackupView() {
  const nav = useNav();
  const items = nav
    .getNav("home")
    .find((item) => item.title === "Administration")
    .items.find((item) => item.title === "Import/Export").items;

  return (
    <div className='flex justify-center flex-wrap '>
      <div className='w-full'>
        <div>{<HomeCards title={"Import/Export"} items={items as any} />}</div>
      </div>
    </div>
  );
}
