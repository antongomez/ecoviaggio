import React from "react";
import ReactDOM from "react-dom/client";
import { Home } from "./Home";
import { Header } from "./Header";
import { Results } from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Importing the Bootstrap CSS (customized)
import "./scss/custom.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
