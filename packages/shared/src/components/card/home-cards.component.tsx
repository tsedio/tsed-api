import React from "react";
import { HomeCard, HomeCardProps } from "./home-card.component";

export interface HomeCardsProps {
  title: string;
  items?: HomeCardProps[];
}

export function HomeCards({ title, items = [] }: HomeCardsProps) {
  return (
    <div className='relative font-tahoma p-3 md:p-5 text-center'>
      <h3 className={"font-happiness font-normal text-left text-xl mb-5 mt-0"}>
        {title}
      </h3>
      <div className={"flex flex-wrap items-stretch -mx-2"}>
        {items.map((item, index) => (
          <HomeCard key={item.title + index} {...item} />
        ))}
      </div>
    </div>
  );
}
