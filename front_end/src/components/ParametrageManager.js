import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParametrageManager.css';
const ParametrageManager = ({ code, label }) => {
  const [items, setItems] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/parametrage/${code}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!newValue) return;
    try {
      await axios.post('http://localhost:5000/api/parametrage', { code, valeur: newValue });
      setNewValue('');
      fetchItems();
      setMessage('Ajouté avec succès');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette valeur ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/parametrage/${id}`);
      fetchItems();
      setMessage('Supprimé avec succès');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>{label}</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.valeur}
            <button onClick={() => handleDelete(item.id)}>🗑️</button>
          </li>
        ))}
      </ul>
      <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Nouvelle valeur" />
      <button onClick={handleAdd}>Ajouter</button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default ParametrageManager;
