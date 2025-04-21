import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MaterielManager.css';
import { Table, Button, Form, Modal, Alert, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg, X, Funnel, FunnelFill } from 'react-bootstrap-icons';

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
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Matériels</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="d-flex align-items-center gap-2"
        >
          <PlusLg size={18} /> Ajouter Matériel
        </Button>
      </div>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Filter Section */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filtres de Recherche</h5>
          <div>
            <Button variant="outline-secondary" size="sm" onClick={handleAddFilter} className="me-2">
              Ajouter Filtre
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleClearFilters}>
              Réinitialiser
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {filters.map((filter, index) => (
            <Row key={index} className="mb-3 align-items-center">
              <Col md={4}>
                <Form.Select
                  value={filter.field}
                  onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                >
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder={`Recherche par ${availableFields.find(f => f.value === filter.field)?.label}`}
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                />
              </Col>
              <Col md={2} className="text-end">
                {filters.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button 
            variant="primary" 
            onClick={handleSearch}
            className="d-flex align-items-center gap-2"
          >
            <FunnelFill size={16} /> Appliquer les Filtres
          </Button>
        </Card.Body>
      </Card>

      {/* Material Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingNumeroSerie ? 'Modifier Matériel' : 'Ajouter Nouveau Matériel'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro Série *</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero_serie"
                    value={formData.numero_serie}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                    required
                    disabled={!!editingNumeroSerie}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Marque *</Form.Label>
                  <Form.Control
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Désignation Article</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation_article"
                    value={formData.designation_article}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Modèle</Form.Label>
                  <Form.Control
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code ONEE</Form.Label>
                  <Form.Control
                    type="text"
                    name="code_ONEE"
                    value={formData.code_ONEE}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Activité</Form.Label>
                  <Form.Control
                    type="text"
                    name="activite"
                    value={formData.activite}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Famille</Form.Label>
                  <Form.Control
                    type="text"
                    name="famille"
                    value={formData.famille}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sous-Famille</Form.Label>
                  <Form.Control
                    type="text"
                    name="sous_famille"
                    value={formData.sous_famille}
                    onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Agent</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contrat</Form.Label>
                  <Form.Select
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
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingNumeroSerie ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Materials Table */}
      <Card>
        <Card.Header as="h5">Liste des Matériels</Card.Header>
        <Card.Body>
          {materiels.length === 0 ? (
            <Alert variant="info">Aucun matériel trouvé</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
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
                        <td key={field.value}>
                          {field.value === 'numero_serie' ? (
                            <Badge bg="secondary">{mat[field.value]}</Badge>
                          ) : (
                            mat[field.value] || '-'
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => {
                              setFormData(mat);
                              setEditingNumeroSerie(mat.numero_serie);
                              setShowForm(true);
                            }}
                            className="d-flex align-items-center gap-1"
                          >
                            <PencilSquare size={14} /> Modifier
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(mat.numero_serie)}
                            className="d-flex align-items-center gap-1"
                          >
                            <Trash size={14} /> Supprimer
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
};

export default MaterielManager;