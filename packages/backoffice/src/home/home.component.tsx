import { HomeCards } from "@tsed/shared";
import React from "react";
import { NavItem } from "../nav/nav.reducers";

export function HomeComponent({ items }: { items: NavItem[] }) {
  return (
    <div className='flex justify-center flex-wrap text-center'>
      <div className='w-full'>
        <main data-testid='Dashboard'>
          {items.map((item, index) => (
            <HomeCards
              key={item.title + index}
              title={item.title}
              items={item.items as any[]}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
