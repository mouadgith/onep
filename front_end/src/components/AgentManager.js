import React, { useState, useEffect } from 'react';
import './AgentManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, Modal, Alert, Container, Row, Col,Badge, Card } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg,  } from 'react-bootstrap-icons';

function AgentManager() {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    fonction: '',
    email: '',
    service: '',
    telephone: '',
    adresse: ''
  });
  const [editingMatricule, setEditingMatricule] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const API_URL = 'http://localhost:5000/api/agents';

  const fetchAgents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMatricule 
      ? `${API_URL}/${editingMatricule}` 
      : API_URL;
    const method = editingMatricule ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Operation failed');

      const result = await response.json();
      setMessage(result.message);
      fetchAgents();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (agent) => {
    setFormData({
      matricule: agent.matricule,
      nom: agent.nom,
      prenom: agent.prenom,
      fonction: agent.fonction,
      email: agent.email,
      service: agent.service,
      telephone: agent.telephone,
      adresse: agent.adresse
    });
    setEditingMatricule(agent.matricule);
    setShowForm(true);
  };

  const handleDelete = async (matricule) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      const response = await fetch(`${API_URL}/${matricule}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete failed');

      const result = await response.json();
      setMessage(result.message);
      fetchAgents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      fonction: '',
      email: '',
      service: '',
      telephone: '',
      adresse: ''
    });
    setEditingMatricule(null);
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Agent Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="d-flex align-items-center gap-2"
        >
          <PlusLg size={18} /> Add Agent
        </Button>
      </div>

      {message && (
        <Alert variant={message.includes('failed') ? 'danger' : 'success'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Agent Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingMatricule ? 'Edit Agent' : 'Add New Agent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!editingMatricule && (
              <Form.Group className="mb-3">
                <Form.Label>Matricule</Form.Label>
                <Form.Control
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prenom</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Fonction</Form.Label>
              <Form.Control
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Control
                type="text"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telephone</Form.Label>
                  <Form.Control
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingMatricule ? 'Update Agent' : 'Add Agent'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Agents Table */}
        <Card>
              <Card.Header as="h5">Liste des Agents</Card.Header>
              <Card.Body>
              {agents.length === 0 ? (
                <Alert variant="info">No agents found</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mt-4">
                    <thead className="table-dark">
                      <tr>
                        <th>Matricule</th>
                        <th>Nom</th>
                        <th>Prenom</th>
                        <th>Fonction</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Telephone</th>
                        <th>Adresse</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map(agent => (
                        <tr key={agent.matricule}>
                          <td><Badge bg="secondary">{agent.matricule}</Badge></td>
                          <td>{agent.nom}</td>
                          <td>{agent.prenom}</td>
                          <td>{agent.fonction}</td>
                          <td>{agent.email}</td>
                          <td>{agent.service}</td>
                          <td>{agent.telephone}</td>
                          <td>{agent.adresse}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => {
                                  handleEdit(agent);
                                  setShowForm(true);
                                }}
                                className="d-flex align-items-center gap-1"
                              >
                                <PencilSquare size={14} /> Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => handleDelete(agent.matricule)}
                                className="d-flex align-items-center gap-1"
                              >
                                <Trash size={14} /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
       </Card.Body>
       </Card>
    </div>
  );
}

export default AgentManager;