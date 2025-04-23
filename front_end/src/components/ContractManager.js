import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Alert, Container, Badge, Dropdown, Card, Row, Col } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg, X, Building, CheckCircle } from 'react-bootstrap-icons';
import './ContractManager.css'; 

const ContractManager = () => {
  const [allContracts, setAllContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [updatedRow, setUpdatedRow] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchContracts();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setFilteredContracts(allContracts.filter(c => c.societe_id === selectedCompany));
    } else {
      setFilteredContracts(allContracts);
    }
  }, [selectedCompany, allContracts]);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contrats');
      setAllContracts(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
      setMessage('Erreur lors du chargement des contrats');
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/societes');
      setCompanies(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des sociétés:', error);
      setMessage('Erreur lors du chargement des sociétés');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/contrats/${editingId}`, formData);
        
        // Visual feedback for update
        setUpdatedRow(editingId);
        setSuccessMessage(`Contrat ${editingId} mis à jour avec succès`);
        setShowSuccess(true);
        
        // Reset visual effect after 2 seconds
        setTimeout(() => {
          setUpdatedRow(null);
        }, 2000);
      } else {
        const response = await axios.post('http://localhost:5000/api/contrats', formData);
        setSuccessMessage(`Contrat ${response.data.numero_contrat} créé avec succès`);
        setShowSuccess(true);
      }
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      fetchContracts();
      resetForm();
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement: " + error.message);
    }
  };

  const handleDelete = async (numero_contrat) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contrats/${numero_contrat}`);
      setSuccessMessage(`Contrat ${numero_contrat} supprimé avec succès`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      fetchContracts();
    } catch (error) {
      setMessage("Erreur lors de la suppression: " + error.message);
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

  const getCompanyName = (id) => {
    const company = companies.find(c => c.id_fiscale === id);
    return company ? company.nom : 'Inconnue';
  };

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Contrats</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="d-flex align-items-center gap-2"
        >
          <PlusLg size={18} /> Ajouter Contrat
        </Button>
      </div>

      {message && (
        <Alert variant="danger" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {showSuccess && (
        <Alert 
          variant="success" 
          dismissible 
          onClose={() => setShowSuccess(false)}
          className="d-flex align-items-center gap-2"
        >
          <CheckCircle size={20} />
          {successMessage}
        </Alert>
      )}

      {/* Company Filter */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Filtrer par Société</h5>
        </Card.Header>
        <Card.Body className="align-items-center d-flex gap-4">
          <Form.Label className='m-0'>Société :</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="d-flex align-items-center gap-2">
              <Building size={16} />
              {selectedCompany ? getCompanyName(selectedCompany) : 'Toutes les sociétés'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedCompany(null)}>
                Toutes les sociétés
              </Dropdown.Item>
              {companies.map(company => (
                <Dropdown.Item 
                  key={company.id_fiscale} 
                  onClick={() => setSelectedCompany(company.id_fiscale)}
                >
                  {company.nom}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>

      {/* Contract Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Modifier Contrat' : 'Ajouter Contrat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Numéro du contrat *</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero_contrat"
                    value={formData.numero_contrat}
                    onChange={(e) => setFormData({...formData, numero_contrat: e.target.value})}
                    required
                    disabled={!!editingId}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Objet *</Form.Label>
                  <Form.Control
                    type="text"
                    name="objet"
                    value={formData.objet}
                    onChange={(e) => setFormData({...formData, objet: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Année *</Form.Label>
                  <Form.Control
                    type="text"
                    name="annee"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Société *</Form.Label>
                  <Form.Select
                    name="societe_id"
                    value={formData.societe_id}
                    onChange={(e) => setFormData({...formData, societe_id: e.target.value})}
                    required
                  >
                    <option value="">Choisir une société</option>
                    {companies.map(company => (
                      <option key={company.id_fiscale} value={company.id_fiscale}>
                        {company.nom}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Remarques</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="remarque"
                value={formData.remarque}
                onChange={(e) => setFormData({...formData, remarque: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingId ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contracts Table */}
      <Card>
        <Card.Header as="h5">Liste des Contrats</Card.Header>
        <Card.Body>
          {filteredContracts.length === 0 ? (
            <Alert variant="info">Aucun contrat trouvé</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Numéro</th>
                    <th>Société</th>
                    <th>Objet</th>
                    <th>Année</th>
                    <th>Remarques</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map(contract => (
                    <tr 
                      key={contract.numero_contrat}
                      className={updatedRow === contract.numero_contrat ? 'table-success blink' : ''}
                    >
                      <td><Badge bg="secondary">{contract.numero_contrat}</Badge></td>
                      <td>{getCompanyName(contract.societe_id)}</td>
                      <td>{contract.objet}</td>
                      <td>{contract.annee}</td>
                      <td>{contract.remarque || '-'}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => {
                              setFormData(contract);
                              setEditingId(contract.numero_contrat);
                              setShowForm(true);
                            }}
                            className="d-flex align-items-center gap-1"
                          >
                            <PencilSquare size={14} /> Modifier
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(contract.numero_contrat)}
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

export default ContractManager;