import { applyMiddleware, compose, createStore, PreloadedState } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { rootReducers } from "./rootReducer";

export const history = createBrowserHistory({
  basename: process.env.REACT_APP_BASE_PATH
});

const enhancers: any[] = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

export default function configureStore(initialState: PreloadedState<any>): any {
  return createStore(
    rootReducers(history),
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
