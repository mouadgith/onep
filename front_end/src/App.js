// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import "./App.css";
// import AgentManager from "./components/AgentManager";
// import MaterielManager from "./components/MaterielManager";
// import SortieManager from "./components/ParammetrageManager";
// import EntreeManager from "./components/ContractManager";

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<AgentManager />} />
//         <Route path="/materiels" element={<MaterielManager />} />
//         <Route path="/sortie" element={<SortieManager />} />
//         <Route path="/entree" element={<EntreeManager />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import AgentManager from "./components/AgentManager";
import MaterielManager from "./components/MaterielManager";
import ParametrageGestion from "./components/ParametrageGestion";
import ContractManager from "./components/ContractManager";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<AgentManager />} />
        <Route path="/materiels" element={<MaterielManager />} />
        <Route path="/parametrage" element={<ParametrageGestion />} />
        <Route path="/contrats" element={<ContractManager />} />
      </Routes>
    </div>
  );
}

export default App;