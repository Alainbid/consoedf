import "./styles/App.scss";
import TableEdf from "./TableEdf";
import "./styles/tableedf.scss";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConsoParmois from "./ConsoParmois.js";
import SaisieLinky from "./Components/SaisieLinky.js";


function App() {

  return (
    <Router>
      <Routes>
       <Route path="/" element={<TableEdf />} />
       <Route path="/saisie-linky" element={<SaisieLinky />} />
        <Route path="/conso-par-mois" element={<ConsoParmois />} />
        
      </Routes>
    </Router>
  );
}

export default App;
