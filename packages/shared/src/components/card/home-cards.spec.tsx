import React from "react";
import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { HomeCards } from "./home-cards.component";
import { StoryArgs } from "./home-cards.story";

const history = createMemoryHistory({
  initialEntries: ["/link/path"],
  initialIndex: 1
});

describe("HomeCards", () => {
  test("it should render the home cards", () => {
    render(
      <Router history={history}>
        <HomeCards {...StoryArgs} />
      </Router>
    );

    expect(screen.getAllByRole("heading")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Section" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((o) => o.textContent)).toEqual([
      "Go to tool1"
    ]);
  });
});
