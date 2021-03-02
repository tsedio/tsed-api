import "@project/shared";
import { Formio, initAuth, logout, Templates } from "@tsed/react-formio";
import tailwind from "@tsed/tailwind-formio";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "./toastr/toastr.util";
import App from "./App";
import { Config } from "./config";
import reportWebVitals from "./reportWebVitals";
import configureStore, { history } from "./store";
import "./styles.css";

const store = configureStore({});

// Formio configuration
Formio.setProjectUrl(Config.formioUrl);
Formio.setBaseUrl(Config.formioUrl);

Formio.registerPlugin(
  {
    priority: 0,
    wrapRequestPromise(promise: Promise<any>) {
      return promise.catch((er) => {
        if (er === "Unauthorized") {
          store.dispatch(logout());
        }
        throw er;
      });
    }
  },
  "connectStore"
);

Formio.use(tailwind);
Templates.framework = "tailwind";

store.dispatch(initAuth() as any);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <div>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
        <ToastContainer />
      </div>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
