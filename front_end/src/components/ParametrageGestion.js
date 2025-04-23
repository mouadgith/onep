import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Card, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { PlusCircle, Trash, Pencil } from 'react-bootstrap-icons';
import './ParametrageManager.css';
import SocieteManager from './SocieteManager';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ login: '', pass: '' });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors du chargement des utilisateurs');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.login || !newUser.pass) {
      setMessage('Login et mot de passe sont obligatoires');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/auth', newUser);
      setNewUser({ login: '', pass: '' });
      fetchUsers();
      setMessage('Utilisateur ajouté avec succès');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingId || !newUser.pass) {
      setMessage('Mot de passe est obligatoire');
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/auth/${editingId}`, {
        login: newUser.login,
        pass: newUser.pass
      });
      setEditingId(null);
      setNewUser({ login: '', pass: '' });
      fetchUsers();
      setMessage('Mot de passe mis à jour avec succès');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Erreur lors de la mise à jour");
    }
  };

  const handleDeleteUser = async (id, login) => {
    if (!window.confirm(`Supprimer l'utilisateur "${login}" ?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/${id}`);
      fetchUsers();
      setMessage(`Utilisateur "${login}" supprimé avec succès`);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setNewUser({ login: user.login, pass: '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewUser({ login: '', pass: '' });
  };

  return (
    <Card className="mb-4 parametrage-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Gestion des Utilisateurs</h5>
        <Badge bg="secondary">{users.length} utilisateurs</Badge>
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
                <th width="30%">Login</th>
                <th width="30%">Type</th>
                <th width="40%">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.login}</td>
                    <td className={user.login.startsWith('admin') ? 'user-type-admin' : 'user-type-agent'}>
                      {user.login.startsWith('admin') ? 'Administrateur' : 'Agent'}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => startEditing(user)}
                        className="me-2"
                      >
                        <Pencil size={14} /> Modifier
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.login)}
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
            name="login"
            value={newUser.login}
            onChange={(e) => setNewUser({...newUser, login: e.target.value})}
            placeholder="Nouveau login (adminX ou agentX)"
            disabled={!!editingId}
          />
          <Form.Control
            type="password"
            name="pass"
            value={newUser.pass}
            onChange={(e) => setNewUser({...newUser, pass: e.target.value})}
            placeholder={editingId ? "Nouveau mot de passe" : "Mot de passe"}
          />
          {editingId ? (
            <>
              <Button 
                variant="warning" 
                onClick={handleUpdateUser}
                className="flex-grow-1"
              >
                Mettre à jour
              </Button>
              <Button 
                variant="secondary" 
                onClick={cancelEditing}
              >
                Annuler
              </Button>
            </>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleAddUser}
              className="d-flex align-items-center gap-1 flex-grow-1"
            >
              <PlusCircle size={16} /> Ajouter
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

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
      
      {/* User Management Section */}
      <Row>
        <Col md={12}>
          <UserManager />
        </Col>
      </Row>

      {/* Parameter Management Sections */}
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