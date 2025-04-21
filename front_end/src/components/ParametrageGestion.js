import React from 'react';
import SocieteManager from './SocieteManager';
import ParametrageManager from './ParametrageManager';
import './ParametrageManager.css'; 

const ParametrageGestion = () => {
  return (
    <div className="parametrage-container">
      <h2>Gestion des Paramètres</h2>

      <SocieteManager />
      <ParametrageManager code="famille" label="Gestion des Familles" />
      <ParametrageManager code="sous-famille" label="Gestion des Sous-Familles" />
      <ParametrageManager code="service" label="Gestion des Services" />
      <ParametrageManager code="marque" label="Gestion des Marques" />

    </div>
  );
};

export default ParametrageGestion;
