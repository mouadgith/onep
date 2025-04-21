import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Alert, Card, Col, Row, Badge } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg, CheckLg } from 'react-bootstrap-icons';
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
  const [showModal, setShowModal] = useState(false);
  const [updatedRow, setUpdatedRow] = useState(null);

  useEffect(() => {
    fetchSocietes();
  }, []);

  const fetchSocietes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/societes');
      setSocietes(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors du chargement des sociétés');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/societes/${editingId}`, formData);
        setMessage(`Société "${formData.nom}" mise à jour avec succès`);
        setUpdatedRow(editingId);
        setTimeout(() => setUpdatedRow(null), 2000);
      } else {
        const response = await axios.post('http://localhost:5000/api/societes', formData);
        setMessage(`Société "${formData.nom}" ajoutée avec succès`);
        setUpdatedRow(response.data.id);
        setTimeout(() => setUpdatedRow(null), 2000);
      }
      setShowModal(false);
      resetForm();
      fetchSocietes();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer la société "${nom}" et ses contrats associés ?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/societes/${id}`);
      setMessage(`Société "${nom}" supprimée avec succès`);
      fetchSocietes();
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({ id_fiscale: '', nom: '', email: '', entite: '' });
    setEditingId(null);
  };

  const openEditModal = (societe) => {
    setFormData({
      id_fiscale: societe.id_fiscale,
      nom: societe.nom,
      email: societe.email,
      entite: societe.entite
    });
    setEditingId(societe.id);
    setShowModal(true);
  };

  return (
    <Card className="mb-4 parametrage-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Gestion des Sociétés</h5>
        <Badge bg="secondary">{societes.length} sociétés</Badge>
      </Card.Header>
      
      <Card.Body>
        {message && (
          <Alert variant={message.includes('Erreur') ? 'danger' : 'success'} dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="mb-3 d-flex align-items-center gap-2"
        >
          <PlusLg size={18} /> Ajouter une société
        </Button>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID Fiscale</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Entité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {societes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Aucune société trouvée</td>
                </tr>
              ) : (
                societes.map(s => (
                  <tr key={s.id} className={updatedRow === s.id ? 'table-success blink' : ''}>
                    <td>{s.id_fiscale}</td>
                    <td>{s.nom}</td>
                    <td>{s.email || '-'}</td>
                    <td>{s.entite || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(s)}
                          className="d-flex align-items-center gap-1"
                        >
                          <PencilSquare size={14} /> Modifier
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(s.id, s.nom)}
                          className="d-flex align-items-center gap-1"
                        >
                          <Trash size={14} /> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => {
          setShowModal(false);
          resetForm();
        }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Modifier Société' : 'Ajouter Société'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Fiscale *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.id_fiscale}
                      onChange={(e) => setFormData({ ...formData, id_fiscale: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nom *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Entité</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.entite}
                      onChange={(e) => setFormData({ ...formData, entite: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="d-flex align-items-center gap-2">
              <CheckLg size={16} /> {editingId ? 'Modifier' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default SocieteManager;