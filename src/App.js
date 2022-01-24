import * as React from "react";
import {
  Routes, // Just Use Routes instead of "Switch"
  Route,
} from "react-router-dom";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import NoMatch from "./components/NoMatch";

export default function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}
