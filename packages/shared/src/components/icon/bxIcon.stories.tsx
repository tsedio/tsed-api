import React from "react";
import { COLORS, COLORS_LIST } from "@project/tailwind/colors";
import { BxIcon } from "./bxIcon.component.js";
import { ICONS } from "./icons";

export default {
  title: "Components/BxIcon",
  component: BxIcon,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: COLORS_LIST
      }
    }
  },
  parameters: {
    docs: {
      source: {
        type: "code"
      }
    }
  }
};

export const Sandbox = (args: any) => {
  return (
    <div className='w-full flex flex-wrap'>
      {Object.values(ICONS).map((icon) => {
        return (
          <div
            className='border-1 flex flex-col items-center m-2 p-5 overflow-hidden'
            style={{ width: "100px" }}
            key={icon}
          >
            <BxIcon className='mb-4 text-xl' {...args} name={icon} />
            <span className='text-xs truncate'>{icon}</span>
          </div>
        );
      })}
    </div>
  );
};

Sandbox.args = {
  className: "",
  color: COLORS.BLUE
};
