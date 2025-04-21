import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContractManager.css';

const ContractManager = () => {
  const [companiesWithContracts, setCompaniesWithContracts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numero_contrat: '',
    objet: '',
    annee: '',
    remarque: '',
    societe_id: ''
  });
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCompaniesWithContracts();
    fetchCompanies();
  }, []);

  const fetchCompaniesWithContracts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/societes-with-contrats');
      setCompaniesWithContracts(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/societes');
      setCompanies(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des sociétés :', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/contrats/${editingId}`, formData);
        setMessage('Contrat mis à jour avec succès');
      } else {
        await axios.post('http://localhost:5000/api/contrats', formData);
        setMessage('Contrat ajouté avec succès');
      }
      fetchCompaniesWithContracts();
      resetForm();
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement : " + error.message);
    }
  };

  const handleEdit = (contract) => {
    setFormData({
      numero_contrat: contract.numero_contrat,
      objet: contract.objet,
      annee: contract.annee,
      remarque: contract.remarque,
      societe_id: contract.societe_id
    });
    setEditingId(contract.numero_contrat);
    setShowForm(true);
  };

  const handleDelete = async (numero_contrat) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contrats/${numero_contrat}`);
      setMessage('Contrat supprimé avec succès');
      fetchCompaniesWithContracts();
    } catch (error) {
      setMessage("Erreur lors de la suppression : " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      numero_contrat: '',
      objet: '',
      annee: '',
      remarque: '',
      societe_id: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="contract-container">
      <h1>Gestion des Contrats</h1>

      {message && <div className="message">{message}</div>}

      <button
        className="toggle-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cacher le formulaire' : 'Ajouter un nouveau contrat'}
      </button>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Modifier le contrat' : 'Ajouter un nouveau contrat'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Numéro du contrat :</label>
              <input
                type="text"
                name="numero_contrat"
                value={formData.numero_contrat}
                onChange={(e) => setFormData({ ...formData, numero_contrat: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Objet :</label>
              <input
                type="text"
                name="objet"
                value={formData.objet}
                onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Année :</label>
              <input
                type="text"
                name="annee"
                value={formData.annee}
                onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Remarques :</label>
              <textarea
                name="remarque"
                value={formData.remarque}
                onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Société :</label>
              <select
                name="societe_id"
                value={formData.societe_id}
                onChange={(e) => setFormData({ ...formData, societe_id: e.target.value })}
                required
              >
                <option value="">Choisir une société</option>
                {companies.map(company => (
                  <option key={company.id_fiscale} value={company.id_fiscale}>
                    {company.nom}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">{editingId ? 'Mettre à jour' : 'Enregistrer'}</button>
            <button type="button" onClick={resetForm}>Annuler</button>
          </form>
        </div>
      )}

      <div className="companies-list">
        <h2>Sociétés avec Contrats</h2>
        {companiesWithContracts.length === 0 ? (
          <p>Aucune société trouvée</p>
        ) : (
          <div className="company-cards">
            {companiesWithContracts.map(company => (
              <div key={company.id_fiscale} className="company-card">
                <div className="company-header">
                  <h3>{company.nom}</h3>
                  <p>ID: {company.id_fiscale} | Email: {company.email}</p>
                </div>

                <div className="contracts-section">
                  <h4>Contrats :</h4>
                  {company.contrats.length === 0 ? (
                    <p>Aucun contrat pour cette société</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Numéro</th>
                          <th>Objet</th>
                          <th>Année</th>
                          <th>Remarques</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.contrats.map(contract => (
                          <tr key={contract.numero_contrat}>
                            <td>{contract.numero_contrat}</td>
                            <td>{contract.objet}</td>
                            <td>{contract.annee}</td>
                            <td>{contract.remarque || '-'}</td>
                            <td>
                              <button onClick={() => handleEdit(contract)}>Modifier</button>
                              <button onClick={() => handleDelete(contract.numero_contrat)}>Supprimer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractManager;
