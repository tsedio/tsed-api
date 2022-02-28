import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { HomeCard } from "./home-card.component";

export default {
  title: "Components/Card",
  component: HomeCard,
  argTypes: {},
  parameters: {}
} as ComponentMeta<typeof HomeCard>;

export const StoryArgs = {
  path: "/tools/tool1",
  title: "Tool 1",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua:",
  icon: "alarm",
  ctaLabel: "Go to tool1",
  className: "text-center"
};

export const HomeCardSandbox: ComponentStory<typeof HomeCard> = (args) => {
  return (
    <MemoryRouter>
      <HomeCard {...args} />
    </MemoryRouter>
  );
};
HomeCardSandbox.args = StoryArgs;
HomeCardSandbox.storyName = "HomeCard";
