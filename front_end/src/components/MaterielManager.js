import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Alert, Container, Badge, Col, Row, Card } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg, Funnel, CheckLg } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MaterielManager = () => {
  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
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
  const [message, setMessage] = useState('');
  const [updatedRow, setUpdatedRow] = useState(null);
  const [agents, setAgents] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [activites, setActivites] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [sousFamilles, setSousFamilles] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    activite: '',
    famille: '',
    sous_famille: '',
    modele: '',
    agent_matricule: '',
    numero_contrat: ''
  });
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredMateriels);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Matériels");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'materiels.xlsx');
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text('Liste des Matériels', 14, 15);
    
    // Prepare data for the table
    const tableData = filteredMateriels.map(mat => [
      mat.numero_serie,
      mat.marque,
      mat.modele || '-',
      mat.activite || '-',
      mat.famille || '-',
      mat.sous_famille || '-',
      agents.find(a => a.matricule.toString() === mat.agent_matricule)?.nom || '-'
    ]);
    autoTable(doc, {
      head: [['Numéro Série', 'Marque', 'Modèle', 'Activité', 'Famille', 'Sous-Famille', 'Agent']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save('materiels.pdf');
  };
  useEffect(() => {
    fetchMateriels();
    fetchAgents();
    fetchContrats();
    fetchParametrage('activite', setActivites);
    fetchParametrage('famille', setFamilles);
    fetchParametrage('sous-famille', setSousFamilles);
    fetchParametrage('modele', setModeles);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, materiels]);

  const fetchMateriels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/materiels');
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
    }
  };

  const fetchContrats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contrats');
      setContrats(res.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchParametrage = async (code, setter) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/parametrage/${code}`);
      setter(res.data.map(item => item.valeur));
    } catch (error) {
      console.error(`Error fetching ${code}:`, error);
    }
  };

  const applyFilters = () => {
    let filtered = [...materiels];
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });

    setFilteredMateriels(filtered);
  };

  const handleFilterChange = (field, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value === 'Tous' ? '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNumeroSerie) {
        await axios.put(`http://localhost:5000/api/materiels/${editingNumeroSerie}`, formData);
        setMessage(`Matériel ${formData.numero_serie} mis à jour avec succès`);
        setUpdatedRow(editingNumeroSerie);
      } else {
        await axios.post('http://localhost:5000/api/materiels', formData);
        setMessage(`Matériel ${formData.numero_serie} ajouté avec succès`);
      }
      
      setTimeout(() => setUpdatedRow(null), 2000);
      setTimeout(() => setMessage(''), 5000);
      
      fetchMateriels();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement: " + error.message);
    }
  };

  const handleDelete = async (numero_serie) => {
    if (!window.confirm('Supprimer ce matériel ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/materiels/${numero_serie}`);
      setMessage('Matériel supprimé avec succès');
      fetchMateriels();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage("Erreur lors de la suppression: " + error.message);
    }
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
  };

  const openEditModal = (materiel) => {
    setFormData(materiel);
    setEditingNumeroSerie(materiel.numero_serie);
    setShowForm(true);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h1>Gestion des Matériels</h1>
  <div className="d-flex gap-2">
    <Button 
      variant="success" 
      onClick={exportToExcel}
      className="d-flex align-items-center gap-2"
    >
      <i className="bi bi-file-earmark-excel"></i> Export Excel
    </Button>
    <Button 
      variant="danger" 
      onClick={exportToPDF}
      className="d-flex align-items-center gap-2"
    >
      <i className="bi bi-file-earmark-pdf"></i> Export PDF
    </Button>
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
</div>
      {message && (
        <Alert variant={message.includes('Erreur') ? 'danger' : 'success'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="d-flex align-items-center gap-2">
            <Funnel size={20} /> Filtres
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Activité</Form.Label>
                <Form.Select
                  value={selectedFilters.activite}
                  onChange={(e) => handleFilterChange('activite', e.target.value)}
                >
                  <option value="">Tous</option>
                  {activites.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Famille</Form.Label>
                <Form.Select
                  value={selectedFilters.famille}
                  onChange={(e) => handleFilterChange('famille', e.target.value)}
                >
                  <option value="">Tous</option>
                  {familles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sous-Famille</Form.Label>
                <Form.Select
                  value={selectedFilters.sous_famille}
                  onChange={(e) => handleFilterChange('sous_famille', e.target.value)}
                >
                  <option value="">Tous</option>
                  {sousFamilles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Modèle</Form.Label>
                <Form.Select
                  value={selectedFilters.modele}
                  onChange={(e) => handleFilterChange('modele', e.target.value)}
                >
                  <option value="">Tous</option>
                  {modeles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Agent</Form.Label>
                <Form.Select
                  value={selectedFilters.agent_matricule}
                  onChange={(e) => handleFilterChange('agent_matricule', e.target.value)}
                >
                  <option value="">Tous</option>
                  {agents.map(agent => (
                    <option key={agent.matricule} value={agent.matricule}>
                      {agent.nom} {agent.prenom}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Contrat</Form.Label>
                <Form.Select
                  value={selectedFilters.numero_contrat}
                  onChange={(e) => handleFilterChange('numero_contrat', e.target.value)}
                >
                  <option value="">Tous</option>
                  {contrats.map(contrat => (
                    <option key={contrat.numero_contrat} value={contrat.numero_contrat}>
                      {contrat.numero_contrat} - {contrat.objet}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Material Form Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingNumeroSerie ? 'Modifier Matériel' : 'Ajouter Matériel'}</Modal.Title>
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
                    onChange={(e) => setFormData({...formData, numero_serie: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modèle</Form.Label>
                  <Form.Select
                    name="modele"
                    value={formData.modele}
                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                  >
                    <option value="">Sélectionner un modèle</option>
                    {modeles.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Code ONEE</Form.Label>
                  <Form.Control
                    type="text"
                    name="code_ONEE"
                    value={formData.code_ONEE}
                    onChange={(e) => setFormData({...formData, code_ONEE: e.target.value})}
                  />
                </Form.Group>
              </Col>

            <Col md={6}>
            <Form.Group className="mb-3">
                  <Form.Label>Désignation Article</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation_article"
                    value={formData.designation_article}
                    onChange={(e) => setFormData({...formData, designation_article: e.target.value})}
                  />
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Activité</Form.Label>
                  <Form.Select
                    name="activite"
                    value={formData.activite}
                    onChange={(e) => setFormData({...formData, activite: e.target.value})}
                  >
                    <option value="">Sélectionner une activité</option>
                    {activites.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Famille</Form.Label>
                <Form.Select
                  name="famille"
                  value={formData.famille}
                  onChange={(e) => setFormData({...formData, famille: e.target.value})}
                >
                  <option value="">Sélectionner une famille</option>
                  {familles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sous-Famille</Form.Label>
                <Form.Select
                  name="sous_famille"
                  value={formData.sous_famille}
                  onChange={(e) => setFormData({...formData, sous_famille: e.target.value})}
                >
                  <option value="">Sélectionner une sous-famille</option>
                  {sousFamilles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </Form.Select>
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
                    onChange={(e) => setFormData({...formData, agent_matricule: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, numero_contrat: e.target.value})}
                  >
                    <option value="">Sélectionner un contrat</option>
                    {contrats.map(contrat => (
                      <option key={contrat.numero_contrat} value={contrat.numero_contrat}>
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
          <Button variant="primary" onClick={handleSubmit} className="d-flex align-items-center gap-2">
            <CheckLg size={16} /> {editingNumeroSerie ? 'Modifier' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Materials Table */}
      <Card>
        <Card.Header as="h5">Liste des Matériels</Card.Header>
        <Card.Body>
          {filteredMateriels.length === 0 ? (
            <Alert variant="info">Aucun matériel trouvé</Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Numéro Série</th>
                    <th>Marque</th>
                    <th>Modèle</th>
                    <th>Activité</th>
                    <th>Famille</th>
                    <th>Sous-Famille</th>
                    <th>Agent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMateriels.map(mat => (
                    <tr 
                      key={mat.numero_serie}
                      className={updatedRow === mat.numero_serie ? 'table-success blink' : ''}
                    >
                      <td><Badge bg="secondary">{mat.numero_serie}</Badge></td>
                      <td>{mat.marque}</td>
                      <td>{mat.modele || '-'}</td>
                      <td>{mat.activite || '-'}</td>
                      <td>{mat.famille || '-'}</td>
                      <td>{mat.sous_famille || '-'}</td>
                      <td>
                        {agents.find(a => a.matricule.toString() === mat.agent_matricule)?.nom || '-'}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => openEditModal(mat)}
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
    </Container>
  );
};

export default MaterielManager;