import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { HomeCards } from "./home-cards.component";

export default {
  title: "Organisms/HomeCards",
  component: HomeCards,
  argTypes: {},
  parameters: {}
} as ComponentMeta<typeof HomeCards>;

export const StoryArgs = {
  title: "Section",
  items: [
    {
      path: "/tools/tool1",
      title: "Tool 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua:",
      icon: "alarm",
      ctaLabel: "Go to tool1"
    }
  ]
};

export const HomeCardsSandbox: ComponentStory<typeof HomeCards> = (args) => {
  return (
    <MemoryRouter>
      <div className='flex justify-center flex-wrap '>
        <div className='w-full'>
          <div>
            <HomeCards title={args.title} items={args.items} />
          </div>
        </div>
      </div>
    </MemoryRouter>
  );
};
HomeCardsSandbox.storyName = "Sandbox";
HomeCardsSandbox.args = StoryArgs;
