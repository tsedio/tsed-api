import { initAuth } from "@tsed/react-formio";
import "@tsed/shared";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { install } from "./formio";
import reportWebVitals from "./reportWebVitals";
import configureStore, { history } from "./store";
import "./styles.css";
import { ToastContainer } from "./toastr/toastr.util";

const store = configureStore({});

// Formio configuration
install(store);

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
