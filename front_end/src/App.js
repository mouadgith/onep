import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import AgentManager from "./components/AgentManager";
import MaterielManager from "./components/MaterielManager";
import ParametrageGestion from "./components/ParametrageGestion";
import ContractManager from "./components/ContractManager";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <section className="home p-5">
        <Routes>
          <Route path="/" element={<AgentManager />} />
          <Route path="/materiels" element={<MaterielManager />} />
          <Route path="/parametrage" element={<ParametrageGestion />} />
          <Route path="/contrats" element={<ContractManager />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;