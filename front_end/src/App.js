import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import AgentManager from "./components/AgentManager";
import MaterielManager from "./components/MaterielManager";
import ParametrageGestion from "./components/ParametrageGestion";
import ContractManager from "./components/ContractManager";
import Login from "./components/LoginPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth(null);
    navigate('/login');
  };

  return (
    <div className="App">
      {auth && <Navbar auth={auth} logout={logout} />}
        <Routes>
          <Route 
                path="/login" 
                element={auth ? <Navigate to="/" /> : <Login setAuth={setAuth} />} 
              />
        </Routes>
      <section className="home p-5">
        <Routes>
          <Route 
            path="/" 
            element={auth ? <AgentManager /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/materiels" 
            element={auth ? <MaterielManager /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/contrats" 
            element={auth ? <ContractManager /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/parametrage" 
            element={
              auth?.type === 'admin' ? (
                <ParametrageGestion />
              ) : auth ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Routes>
      </section>
    </div>
  );
}

export default App;