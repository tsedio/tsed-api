import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import React from "react";
import { Button } from "./button.component";

describe("Button", () => {
  describe("rendering", () => {
    it("should render a button with default tag and label", () => {
      // WHEN
      const { getByTestId } = render(<Button>Label</Button>);

      // THEN
      const button = getByTestId("button");
      const buttonSpan = getByTestId("buttonSpan");
      expect(button).toHaveTextContent("Label");
      expect(button.classList.contains("bg-primary")).toBeTruthy();
      expect(button.classList.contains("bg-primary")).toBeTruthy();
      expect(button.classList.contains("border-primary")).toBeTruthy();
      expect(button.classList.contains("text-white")).toBeTruthy();
      expect(button.classList.contains("focus:bg-primary-active")).toBeTruthy();
      expect(
        button.classList.contains("focus:border-primary-active")
      ).toBeTruthy();
      expect(button.classList.contains("hover:bg-primary-active")).toBeTruthy();
      expect(
        button.classList.contains("hover:border-primary-active")
      ).toBeTruthy();
      expect(button.classList.contains("cursor-pointer")).toBeTruthy();
      expect(buttonSpan.classList.contains("font-bold")).toBeTruthy();
      expect(buttonSpan.classList.contains("px-4")).toBeTruthy();
      expect(buttonSpan.classList.contains("py-1")).toBeTruthy();
    });

    it("should render a custom  given tag with default tag and label", () => {
      // WHEN
      const { getByTestId } = render(<Button component='a'>Label</Button>);

      // THEN
      const button = getByTestId("button");
      expect(button).toHaveTextContent("Label");
    });

    it("should render a disabled component", () => {
      // WHEN
      const { getByTestId } = render(<Button disabled={true}>Label</Button>);

      // THEN
      const button = getByTestId("button");

      expect(button.classList.contains("opacity-50")).toBeTruthy();
    });

    it("should render button with customer color", () => {
      // WHEN
      const { getByTestId } = render(
        <Button
          bgColor={"red"}
          borderColor={"yellow"}
          color={"black"}
          fontWeight={"lighter"}
          paddingX={2}
          paddingY={3}
        >
          Label
        </Button>
      );

      // THEN
      const button = getByTestId("button");
      const buttonSpan = getByTestId("buttonSpan");

      expect(button.classList.contains("bg-red")).toBeTruthy();
      expect(button.classList.contains("text-black")).toBeTruthy();
      expect(button.classList.contains("border-yellow")).toBeTruthy();
      expect(button.classList.contains("focus:bg-red-800")).toBeTruthy();
      expect(button.classList.contains("focus:border-yellow-800")).toBeTruthy();
      expect(button.classList.contains("hover:bg-red-800")).toBeTruthy();
      expect(button.classList.contains("hover:border-yellow-800")).toBeTruthy();
      expect(button.classList.contains("focus:text-black-800")).toBeTruthy();
      expect(button.classList.contains("hover:text-black-800")).toBeTruthy();
      expect(buttonSpan.classList.contains("font-lighter")).toBeTruthy();
      expect(buttonSpan.classList.contains("px-2")).toBeTruthy();
      expect(buttonSpan.classList.contains("py-3")).toBeTruthy();
    });
  });
});
