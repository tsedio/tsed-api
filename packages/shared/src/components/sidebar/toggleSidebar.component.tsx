import React from "react";
import { BxIcon } from "../../index";

export interface ToggleSidebarProps {
  sidebarOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export function ToggleSidebar({ sidebarOpen, onClick }: ToggleSidebarProps) {
  return (
    <div
      onClick={onClick}
      className={
        "transition-all cursor-pointer opacity-0 group-hover:opacity-100 absolute bottom-5 right-0 flex p-1 py-4 rounded-tl-sm rounded-bl-sm"
      }
      style={{ background: "rgb(255,255, 255, 0.1)" }}
    >
      <BxIcon name={sidebarOpen ? "chevron-left" : "chevron-right"} />
    </div>
  );
}
