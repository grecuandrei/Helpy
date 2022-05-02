import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import store from "./store/store";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);