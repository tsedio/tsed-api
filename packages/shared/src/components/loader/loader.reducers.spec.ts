import { loaderReducer } from "./loader.reducers";
import { hideLoader, showLoader } from "./loader.actions";

const reducer = loaderReducer("loader");

describe("Loader reducer", () => {
  it("should hide loader", () => {
    // GIVEN

    // WHEN
    const state = reducer({}, hideLoader("loader"));

    // THEN
    expect(state).toEqual({
      name: "loader",
      isActive: false
    });
  });

  it("should show loader", () => {
    // GIVEN

    // WHEN
    const state = reducer({}, showLoader("loader"));

    // THEN
    expect(state).toEqual({
      name: "loader",
      isActive: true
    });
  });
});
