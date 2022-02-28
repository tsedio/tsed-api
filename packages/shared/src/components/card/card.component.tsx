import React, { PropsWithChildren } from "react";
import { BxIcon } from "../icon/bxIcon.component";

export interface CardProps {
  className?: string;
  icon: string;
  title: string;
  description?: string;
  color?: string;
  i18n?: (key: string) => string;
  style?: any;
}

export function Card({
  className = "",
  children,
  icon,
  title,
  description,
  color = "secondary",
  i18n = (l: string) => l,
  style
}: PropsWithChildren<CardProps>) {
  return (
    <div
      style={style}
      className={`flex flex-col items-stretch p-2 mb-5 ${className} group`}
    >
      <div className={"flex justify-center items-center -mb-9 z-2 relative"}>
        <div
          className={
            "rounded-full bg-white  p-4 flex justify-center items-center transition duration-500 ease-in-out"
          }
          style={{ width: "70px", height: "70px" }}
        >
          <BxIcon
            name={icon}
            className={"text-gray-600 group-hover:text-blue-active text-3xl"}
          />
        </div>
      </div>
      <div
        className={
          "relative h-full w-full bg-white shadow-lg rounded-small relative flex flex-col items-stretch pt-6"
        }
      >
        <div
          className={`border-0 text-${color} text-xl md:text-2xl flex items-center font-happiness mx-auto px-3`}
        >
          <span className={"flex items-center"} />
          <h5 className={"pt-2"}>{i18n(title)}</h5>
        </div>
        <p className={"px-5 py-2 text-sm flex-1"}>{i18n(description || "")}</p>
        <div className='px-5'>{children}</div>
      </div>
    </div>
  );
}
