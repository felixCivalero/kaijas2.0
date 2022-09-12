import React from "react";
import "./App.css";
import Home from "./Home";
import Concerts from "./Concerts";
import Admin from "./Admin";
import Success from "./Success.js";

import { AnimatePresence } from "framer-motion";

import { Routes, Route, useLocation } from "react-router-dom";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Concerts />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/checkout-success/" element={<Success />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
