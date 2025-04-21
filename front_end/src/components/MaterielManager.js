import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaterielManager.css';

const MaterielManager = () => {
  const [materiels, setMateriels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numero_serie: '',
    marque: '',
    designation_article: '',
    modele: '',
    code_ONEE: '',
    activite: '',
    famille: '',
    sous_famille: '',
    agent_matricule: '',
    numero_contrat: ''
  });
  const [editingNumeroSerie, setEditingNumeroSerie] = useState(null); 
  const [filters, setFilters] = useState([{ field: 'numero_serie', value: '' }]);
  const [availableFields] = useState([
    { label: 'Numéro Série', value: 'numero_serie' },
    { label: 'Marque', value: 'marque' },
    { label: 'Désignation Article', value: 'designation_article' },
    { label: 'Modèle', value: 'modele' },
    { label: 'Code ONEE', value: 'code_ONEE' },
    { label: 'Activité', value: 'activite' },
    { label: 'Famille', value: 'famille' },
    { label: 'Sous-Famille', value: 'sous_famille' },
    { label: 'Matricule Agent', value: 'agent_matricule' },
    { label: 'Numéro Contrat', value: 'numero_contrat' }
  ]);
  const [agents, setAgents] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMateriels();
    fetchAgents();
    fetchContrats();
  }, []);

  const fetchMateriels = async (params = {}) => {
    try {
      const res = await axios.get('http://localhost:5000/api/materiels', { params });
      setMateriels(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error fetching materials');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/agents');
      setAgents(res.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setMessage('Error fetching agents');
    }
  };

  const fetchContrats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contrats');
      setContrats(res.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setMessage('Error fetching contracts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNumeroSerie) {
        await axios.put(`http://localhost:5000/api/materiels/${editingNumeroSerie}`, formData);
        setMessage('Material updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/materiels', formData);
        setMessage('Material added successfully');
      }
      fetchMateriels();
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Error saving material: ' + error.message);
    }
  };

  const handleDelete = async (numero_serie) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/materiels/${numero_serie}`);
      setMessage('Material deleted successfully');
      fetchMateriels();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Error deleting material');
    }
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: 'marque', value: '' }]);
  };

  const handleRemoveFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleFilterChange = (index, type, value) => {
    const newFilters = [...filters];
    newFilters[index][type] = value;
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    const params = {};
    
    filters.forEach(filter => {
      if (filter.value.trim()) {
        params[filter.field] = filter.value.trim();
      }
    });

    await fetchMateriels(params);
  };

  const handleClearFilters = () => {
    setFilters([{ field: 'numero_serie', value: '' }]);
    fetchMateriels();
  };

  const resetForm = () => {
    setFormData({
      numero_serie: '',
      marque: '',
      designation_article: '',
      modele: '',
      code_ONEE: '',
      activite: '',
      famille: '',
      sous_famille: '',
      agent_matricule: '',
      numero_contrat: ''
    });
    setEditingNumeroSerie(null);
    setShowForm(false);
  };
  return (
    <div className="materiel-container">
      <h2>Gestion des Matériels</h2>

      {message && <div className="message">{message}</div>}

      <div className="filter-section">
        <div className="filter-header">
          <h3>Filtres de Recherche</h3>
          <div className="filter-controls">
            <button onClick={handleAddFilter}>Ajouter Filtre</button>
            <button onClick={handleClearFilters}>Réinitialiser</button>
          </div>
        </div>

        {filters.map((filter, index) => (
          <div className="filter-row" key={index}>
            <select
              value={filter.field}
              onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
            >
              {availableFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder={`Recherche par ${availableFields.find(f => f.value === filter.field)?.label}`}
              value={filter.value}
              onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            />

            {filters.length > 1 && (
              <button
                className="remove-filter"
                onClick={() => handleRemoveFilter(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button className="search-button" onClick={handleSearch}>
          Appliquer les Filtres
        </button>
      </div>

      <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Annuler' : 'Ajouter Nouveau Matériel'}
      </button>

      {showForm && (
        <form className="material-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <input
                type="text"
                placeholder="Numéro Série *"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                required
                disabled={!!editingNumeroSerie}
              />
              <input
                type="text"
                placeholder="Marque *"
                name="marque"
                value={formData.marque}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Désignation Article"
                name="designation_article"
                value={formData.designation_article}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
              <input
                type="text"
                placeholder="Modèle"
                name="modele"
                value={formData.modele}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
            </div>
            
            <div className="form-column">
              <input
                type="text"
                placeholder="Code ONEE"
                name="code_ONEE"
                value={formData.code_ONEE}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
              <input
                type="text"
                placeholder="Activité"
                name="activite"
                value={formData.activite}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
              <input
                type="text"
                placeholder="Famille"
                name="famille"
                value={formData.famille}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
              <input
                type="text"
                placeholder="Sous-Famille"
                name="sous_famille"
                value={formData.sous_famille}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              />
            </div>

            <div className="form-column">
              <select
                name="agent_matricule"
                value={formData.agent_matricule}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              >
                <option value="">Sélectionner un agent</option>
                {agents.map(agent => (
                  <option key={agent.matricule} value={agent.matricule}>
                    {agent.nom} {agent.prenom} ({agent.matricule})
                  </option>
                ))}
              </select>
              <select
                name="numero_contrat"
                value={formData.numero_contrat}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              >
                <option value="">Sélectionner un contrat</option>
                {contrats.map(contrat => (
                  <option key={contrat.id} value={contrat.numero_contrat}>
                    {contrat.numero_contrat} - {contrat.objet}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit">{editingNumeroSerie ? 'Mettre à jour' : 'Enregistrer'}</button>
          <button type="button" onClick={resetForm}>Annuler</button>
        </form>
      )}

      <div className="materials-list">
        <h3>Liste des Matériels</h3>
        {materiels.length === 0 ? (
          <p>Aucun matériel trouvé</p>
        ) : (
          <table>
            <thead>
              <tr>
                {availableFields.map((field) => (
                  <th key={field.value}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materiels.map((mat) => (
                <tr key={mat.numero_serie}>
                  {availableFields.map((field) => (
                    <td key={field.value}>{mat[field.value] || '-'}</td>
                  ))}
                  <td>
                    <button onClick={() => {
                      setFormData(mat);
                      setEditingNumeroSerie(mat.numero_serie);
                      setShowForm(true);
                    }}>Modifier</button>
                    <button onClick={() => handleDelete(mat.numero_serie)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MaterielManager;