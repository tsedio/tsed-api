import { getIsActive, oneOfIsActive } from "./loader.selectors";

describe("loader selector", () => {
  describe("getIsActive", () => {
    it("should return isActive state", () => {
      expect(
        getIsActive("loader")({
          loader: {
            isActive: true
          }
        })
      ).toEqual(true);
    });
  });
  describe("oneOfIsActive", () => {
    it("should is active state", () => {
      expect(
        oneOfIsActive(
          "loader",
          "other"
        )({
          loader: {
            isActive: false
          },
          other: {
            isActive: true
          }
        })
      ).toEqual(true);
      expect(
        oneOfIsActive(
          "loader",
          "other"
        )({
          loader: {
            isActive: true
          },
          other: {
            isActive: false
          }
        })
      ).toEqual(true);
      expect(
        oneOfIsActive(
          "loader",
          "other"
        )({
          loader: {
            isActive: false
          },
          other: {
            isActive: false
          }
        })
      ).toEqual(false);
    });
  });
});
