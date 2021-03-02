import { render } from "@testing-library/react";
import React from "react";
import { BxIcon } from "./bxIcon.component";
import { ICONS } from "./icons";

describe("BxIcon", () => {
  it("should render the bx-icon (bx-archive)", () => {
    const { getByTestId } = render(
      <BxIcon name={"archive"} color={"blue"} className={"w-full"} />
    );

    const icon = getByTestId("icon");
    expect(icon.classList.contains("bx-archive")).toEqual(true);
    expect(icon.classList.contains("text-blue")).toEqual(true);
    expect(icon.classList.contains("w-full")).toEqual(true);
  });

  it("should render the bx-icon (bxl)", () => {
    const { getByTestId } = render(
      <BxIcon name={ICONS["bxl-adobe"]} className={"w-full"} />
    );

    const icon = getByTestId("icon");
    expect(icon.classList.contains("bxl-adobe")).toEqual(true);
    expect(icon.classList.contains("text-blue")).toEqual(false);
    expect(icon.classList.contains("w-full")).toEqual(true);
  });
});
