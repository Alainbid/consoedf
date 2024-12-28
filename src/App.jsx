import "./styles/App.scss";
import TableEdf from "./TableEdf";
import "./styles/tableedf.scss";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConsoParmois from "./Components/ConsoParmois.js";
import MonthSelector from "./Components/MonthSelector.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableEdf />} />
        <Route path="/month-selector" element={<MonthSelector />} />
        <Route path="/conso-par-mois" element={<ConsoParmois />} />
      </Routes>
    </Router>
  );
}

export default App;
