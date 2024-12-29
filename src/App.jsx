import "./styles/App.scss";
import TableEdf from "./TableEdf";
import "./styles/tableedf.scss";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConsoParmois from "./Components/ConsoParmois.js";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableEdf />} />
       
        <Route path="/conso-par-mois" element={<ConsoParmois />} />
      </Routes>
    </Router>
  );
}

export default App;
