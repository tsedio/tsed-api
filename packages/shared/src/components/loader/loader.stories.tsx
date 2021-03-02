import React from "react";
import { COLORS_LIST } from "@project/tailwind/colors";
import { ICONS } from "../icon/icons";
import { Loader } from "./loader.component";

export default {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: COLORS_LIST
      }
    },
    icon: {
      control: {
        type: "select",
        options: Object.values(ICONS)
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
  return <Loader {...args}>{args.children}</Loader>;
};

Sandbox.args = {};
