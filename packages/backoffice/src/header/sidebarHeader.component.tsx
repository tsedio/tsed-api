import React from "react";
import { Link } from "react-router-dom";

export function SiderbarHeader({ sidebarOpen, title }: any) {
  return (
    <Link
      to='/'
      className='cursor-pointer flex flex-no-shrink items-center px-2 font-happiness'
    >
      <span
        className={`text-sidebar-white transition-all ${
          sidebarOpen ? "ml-2 text-2xl" : "text-md"
        }`}
      >
        {title}
      </span>
    </Link>
  );
}
