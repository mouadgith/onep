import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Card, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { PlusCircle, Trash } from 'react-bootstrap-icons';
import './ParametrageManager.css';
import SocieteManager from './SocieteManager'

const ParametrageManager = ({ code, label }) => {
  const [items, setItems] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [message, setMessage] = useState('');
  const [updatedItem, setUpdatedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [code]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/parametrage/${code}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors du chargement');
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/parametrage', { code, valeur: newValue });
      setNewValue('');
      fetchItems();
      setMessage(`"${newValue}" ajouté avec succès`);
      setUpdatedItem(response.data.id);
      setTimeout(() => setUpdatedItem(null), 2000);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id, valeur) => {
    if (!window.confirm(`Supprimer "${valeur}" ?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/parametrage/${id}`);
      fetchItems();
      setMessage(`"${valeur}" supprimé avec succès`);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la suppression');
    }
  };

  return (
    <Card className="mb-4 parametrage-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{label}</h5>
        <Badge bg="secondary">{items.length} éléments</Badge>
      </Card.Header>
      <Card.Body>
        {message && (
          <Alert variant={message.includes('Erreur') ? 'danger' : 'success'} dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <div className="table-responsive">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th width="80%">Valeur</th>
                <th width="20%">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted">Aucun élément trouvé</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr 
                    key={item.id} 
                    className={updatedItem === item.id ? 'table-success blink' : ''}
                  >
                    <td>{item.valeur}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.valeur)}
                        className="d-flex align-items-center gap-1 mx-auto"
                      >
                        <Trash size={14} /> Supprimer
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Form.Control
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Nouvelle valeur"
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button 
            variant="primary" 
            onClick={handleAdd}
            className="d-flex align-items-center gap-1"
          >
            <PlusCircle size={16} /> Ajouter
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const ParametrageGestion = () => {
  return (
    <div className="py-4 parametrage-container">
      <h2 className="mb-4">Gestion des Paramètres</h2>
      <SocieteManager />
      <Row>
        <Col md={6}>
          <ParametrageManager code="famille" label="Familles" />
        </Col>
        <Col md={6}>
          <ParametrageManager code="sous-famille" label="Sous-Familles" />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <ParametrageManager code="service" label="Services" />
        </Col>
        <Col md={6}>
          <ParametrageManager code="marque" label="Marques" />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <ParametrageManager code="activite" label="Activites" />
        </Col>
        <Col md={6}>
          <ParametrageManager code="modele" label="Modeles" />
        </Col>
      </Row>
    </div>
  );
};

export default ParametrageGestion;