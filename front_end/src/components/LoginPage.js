// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button, Card, Alert, Container, Modal } from 'react-bootstrap';
// import axios from 'axios';

// const Login = ({ setAuth }) => {
//   const [credentials, setCredentials] = useState({
//     login: '',
//     pass: ''
//   });
//   const [registerData, setRegisterData] = useState({
//     login: '',
//     pass: '',
//     confirmPass: ''
//   });
//   const [error, setError] = useState('');
//   const [registerError, setRegisterError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [registerLoading, setRegisterLoading] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
//       localStorage.setItem('auth', JSON.stringify(response.data));
//       setAuth(response.data);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setRegisterLoading(true);
//     setRegisterError('');
    
//     try {
//       if (registerData.pass !== registerData.confirmPass) {
//         throw new Error('Passwords do not match');
//       }
      
//       const response = await axios.post('http://localhost:5000/api/auth', {
//         login: registerData.login,
//         pass: registerData.pass
//       });
      
//       setShowRegister(false);
//       setRegisterData({ login: '', pass: '', confirmPass: '' });
//       setRegisterError('');
//       alert('Account created successfully! Please login.');
//     } catch (err) {
//       setRegisterError(err.response?.data?.error || err.message || 'Registration failed');
//     } finally {
//       setRegisterLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setCredentials({
//       ...credentials,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleRegisterChange = (e) => {
//     setRegisterData({
//       ...registerData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
//       <Card className="w-100" style={{ maxWidth: "400px" }}>
//         <Card.Body>
//           <h2 className="text-center mb-4">Connexion</h2>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleLogin}>
//             <Form.Group className="mb-3">
//               <Form.Label>Login</Form.Label>
//               <Form.Control 
//                 type="text" 
//                 name="login" 
//                 value={credentials.login}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Mot de passe</Form.Label>
//               <Form.Control 
//                 type="password" 
//                 name="pass" 
//                 value={credentials.pass}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Button 
//               disabled={loading}
//               className="w-100 mb-3" 
//               type="submit"
//             >
//               {loading ? 'Connexion en cours...' : 'Se connecter'}
//             </Button>
//             <div className="text-center">
//               <Button 
//                 variant="link" 
//                 onClick={() => setShowRegister(true)}
//               >
//                 Créer un compte
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>

//       {/* Registration Modal */}
//       <Modal show={showRegister} onHide={() => setShowRegister(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Créer un compte</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {registerError && <Alert variant="danger">{registerError}</Alert>}
//           <Form onSubmit={handleRegister}>
//             <Form.Group className="mb-3">
//               <Form.Label>Login</Form.Label>
//               <Form.Control 
//                 type="text" 
//                 name="login" 
//                 value={registerData.login}
//                 onChange={handleRegisterChange}
//                 required
//                 placeholder="adminX or agentX"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Mot de passe</Form.Label>
//               <Form.Control 
//                 type="password" 
//                 name="pass" 
//                 value={registerData.pass}
//                 onChange={handleRegisterChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Confirmer le mot de passe</Form.Label>
//               <Form.Control 
//                 type="password" 
//                 name="confirmPass" 
//                 value={registerData.confirmPass}
//                 onChange={handleRegisterChange}
//                 required
//               />
//             </Form.Group>
//             <Button 
//               disabled={registerLoading}
//               className="w-100" 
//               type="submit"
//             >
//               {registerLoading ? 'Création en cours...' : 'Créer un compte'}
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import axios from 'axios';

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
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Login</Form.Label>
              <Form.Control 
                type="text" 
                name="login" 
                value={credentials.login}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
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
  );
};

export default Login;