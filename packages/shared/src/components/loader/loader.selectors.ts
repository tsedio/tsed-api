import get from "lodash/get";

export function getIsActive(name = "loader") {
  return (state: any) => {
    return state[name].isActive;
  };
}

export function oneOfIsActive(...names: string[]) {
  return (state: any) => {
    return !!names.find((name) => {
      return get(
        state,
        `${name}.isActive`,
        get(state, `${name}.current.isActive`)
      );
    });
  };
}
