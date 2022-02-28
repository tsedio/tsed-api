import React from "react";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { HomeCard } from "./home-card.component";
import { StoryArgs } from "./home-card.story";

const history = createMemoryHistory({
  initialEntries: ["/link/path"],
  initialIndex: 1
});

describe("HomeCard", () => {
  test("it should render the home cards", () => {
    render(
      <Router history={history}>
        <HomeCard {...StoryArgs} />
      </Router>
    );

    expect(screen.getByRole("link", { name: "Go to tool1" })).toHaveProperty(
      "href",
      "http://localhost/tools/tool1"
    );
    expect(screen.getByRole("heading", { name: "Tool 1" })).toBeInTheDocument();
    expect(screen.getByText(StoryArgs.description)).toBeInTheDocument();
  });

  test("it should have #href in Button Link if props have href & path", () => {
    render(
      <Router history={history}>
        <HomeCard {...StoryArgs} href='/link/href/' />
      </Router>
    );
    expect(screen.getByRole("link", { name: "Go to tool1" })).toHaveProperty(
      "href",
      "http://localhost/link/href/"
    );
  });
});
