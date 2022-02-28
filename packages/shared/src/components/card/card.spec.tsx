import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "./card.component";

describe("components/Card", () => {
  const props = {
    title: "title",
    icon: "search",
    description: "Lorem ipsum dolor sit amet"
  };

  test("it should render the component", () => {
    render(
      <Card {...props}>
        <div data-testid='ChildrenProps' />
      </Card>
    );

    expect(
      screen.getByRole("heading", { name: props.title })
    ).toBeInTheDocument();

    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByTestId("ChildrenProps")).toBeInTheDocument();
  });
});
