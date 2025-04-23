import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import './LoginPage.css';
import { DistributeVertical } from 'react-bootstrap-icons';

const Login = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({
    login: '',
    pass: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      localStorage.setItem('auth', JSON.stringify(response.data));
      setAuth(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="LoginDiv">
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body className="p-5 shadow-lg">
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="align-items-start d-flex flex-column mb-3">
              <Form.Label className="m-1">Login</Form.Label>
              <Form.Control 
                type="text" 
                name="login" 
                value={credentials.login}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="align-items-start d-flex flex-column mb-3">
              <Form.Label className="m-1">Mot de passe</Form.Label>
              <Form.Control 
                type="password" 
                name="pass" 
                value={credentials.pass}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button 
              disabled={loading}
              className="w-100" 
              type="submit"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default Login;