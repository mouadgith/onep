import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParametrageManager.css';

const SocieteManager = () => {
  const [societes, setSocietes] = useState([]);
  const [formData, setFormData] = useState({
    id_fiscale: '',
    nom: '',
    email: '',
    entite: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSocietes();
  }, []);

  const fetchSocietes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/societes');
      setSocietes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/societes/${editingId}`, formData);
        setMessage('Société mise à jour avec succès');
      } else {
        await axios.post('http://localhost:5000/api/societes', formData);
        setMessage('Société ajoutée avec succès');
      }
      setFormData({ id_fiscale: '', nom: '', email: '', entite: '' });
      setEditingId(null);
      fetchSocietes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (societe) => {
    setFormData({
      id_fiscale: societe.id_fiscale,
      nom: societe.nom,
      email: societe.email,
      entite: societe.entite
    });
    setEditingId(societe.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette société et ses contrats associés ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/societes/${id}`);
      setMessage('Société supprimée avec succès');
      fetchSocietes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="parametrage-section">
      <h3>Gestion des Sociétés</h3>
      <form onSubmit={handleSubmit} className="mb-20">
        <div className="parametrage-input-row">
          <input
            value={formData.id_fiscale}
            onChange={(e) => setFormData({ ...formData, id_fiscale: e.target.value })}
            placeholder="ID Fiscale"
            required
          />
          <input
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Nom de la société"
            required
          />
        </div>
        <div className="parametrage-input-row">
          <input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
          />
          <input
            value={formData.entite}
            onChange={(e) => setFormData({ ...formData, entite: e.target.value })}
            placeholder="Entité"
          />
        </div>
        <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <ul className="parametrage-list">
        {societes.map(s => (
          <li key={s.id}>
            {s.nom} (ID: {s.id_fiscale})
            <div>
              <button onClick={() => handleEdit(s)}>✏️</button>
              <button onClick={() => handleDelete(s.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {message && <div className="parametrage-message">{message}</div>}
    </div>
  );
};

export default SocieteManager;
