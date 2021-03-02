import { receiveNav } from "./nav.actions";
import { navReducer } from "./nav.reducers";

describe("Nav reducers", () => {
  it("should update navigation", () => {
    const reducers = navReducer("nav");

    expect(reducers.$emit(receiveNav, {}, { items: [] }).data.length).toEqual(
      3
    );
  });
});
