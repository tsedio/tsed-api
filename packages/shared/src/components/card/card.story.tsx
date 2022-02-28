import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Card } from "./card.component";

export default {
  title: "Components/Card",
  component: Card,
  argTypes: {},
  parameters: {}
} as ComponentMeta<typeof Card>;

export const CardSandbox: ComponentStory<typeof Card> = (args: any) => {
  return <Card {...args} />;
};

CardSandbox.args = {
  title: "title",
  icon: "alarm",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua:"
};

CardSandbox.storyName = "Sandbox";
