import React from "react";
import { hydrate, render } from "react-dom";
import "./App.css";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
