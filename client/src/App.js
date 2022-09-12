import React from "react";
import "./App.css";
import AnimatedRoutes from "./AnimatedRoutes";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Nav /> */}
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
