
// import React, { useState, useEffect } from 'react';
// import './AgentManager.css';
// function AgentManager() {
//   const [agents, setAgents] = useState([]);
//   const [formData, setFormData] = useState({
//     matricule: '',
//     nom: '',
//     prenom: '',
//     service: '',
//     entite: 'ONEP',
//     adresse_site: 'Agadir'
//   });
//   const [editingMatricule, setEditingMatricule] = useState(null);
//   const [message, setMessage] = useState('');
//   const [showForm, setShowForm] = useState(false);

//   const API_URL = 'http://localhost:5000/api/agents';

//   const fetchAgents = async () => {
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error('Failed to fetch');
//       const data = await response.json();
//       setAgents(data);
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchAgents();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = editingMatricule 
//       ? `${API_URL}/${editingMatricule}` 
//       : API_URL;
//     const method = editingMatricule ? 'PUT' : 'POST';

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) throw new Error('Operation failed');

//       const result = await response.json();
//       setMessage(result.message);
//       fetchAgents();
//       resetForm();
//       setShowForm(false);
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   const handleEdit = (agent) => {
//     setFormData(agent);
//     setEditingMatricule(agent.matricule);
//     setShowForm(true);
//   };

//   const handleDelete = async (matricule) => {
//     if (!window.confirm('Are you sure you want to delete this agent?')) return;

//     try {
//       const response = await fetch(`${API_URL}/${matricule}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) throw new Error('Delete failed');

//       const result = await response.json();
//       setMessage(result.message);
//       fetchAgents();
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//         matricule: '',
//         nom: '',
//         prenom: '',
//         service: '',
//         entite: 'ONEP',
//         adresse_site: 'Agadir'
//     });
//     setEditingMatricule(null);
//   };

//   return (
//     <div className="agent-container">
//       <h1>Agent Management</h1>

//       {message && <div className="message">{message}</div>}

//       <button className="toggle-button" onClick={() => setShowForm(!showForm)}>
//         {showForm ? 'Hide Form' : 'Add Agent'}
//       </button>

//       {showForm && (
//         <div className="form-container">
//           <h2>{editingMatricule ? 'Edit Agent' : 'Add New Agent'}</h2>
//           <form onSubmit={handleSubmit}>
//             {!editingMatricule && (
//               <div className="form-group">
//                 <label>Matricule:</label>
//                 <input
//                   type="text"
//                   name="matricule"
//                   value={formData.matricule}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             )}
//             <div className="form-group">
//               <label>Nom:</label>
//               <input
//                 type="text"
//                 name="nom"
//                 value={formData.nom}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Prenom:</label>
//               <input
//                 type="text"
//                 name="prenom"
//                 value={formData.prenom}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Service:</label>
//               <input
//                 type="text"
//                 name="service"
//                 value={formData.service}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Entite:</label>
//               <select
//                 name="entite"
//                 value={formData.entite}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="sp6/1">sp6/1</option>
//                 <option value="ONEP">sp6/1</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Adresse Site:</label>
//               <select
//                 name="adresse_site"
//                 value={formData.adresse_site}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="Agadir">Agadir</option>
//                 <option value="Oujda">Oujda</option>
//                 <option value="Rabat">Rabat</option>
//                 <option value="Casablanca">Casablanca</option>
//               </select>
//             </div>
//             <button type="submit">
//               {editingMatricule ? 'Update Agent' : 'Add Agent'}
//             </button>
//             {editingMatricule && (
//               <button type="button" onClick={resetForm}>Cancel</button>
//             )}
//           </form>
//         </div>
//       )}
//       <div className="agents-list">
//         <h2>Agents List</h2>
//         {agents.length === 0 ? (
//           <p>No agents found</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Matricule</th>
//                 <th>Nom</th>
//                 <th>Prenom</th>
//                 <th>Service</th>
//                 <th>Entite</th>
//                 <th>Adresse Site</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {agents.map(agent => (
//                 <tr key={agent.matricule}>
//                   <td>{agent.matricule}</td>
//                   <td>{agent.nom}</td>
//                   <td>{agent.prenom}</td>
//                   <td>{agent.service}</td>
//                   <td>{agent.entite}</td>
//                   <td>{agent.adresse_site}</td>
//                   <td>
//                     <button onClick={() => handleEdit(agent)}>Edit</button>
//                     <button onClick={() => handleDelete(agent.matricule)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AgentManager;
import React, { useState, useEffect } from 'react';
import './AgentManager.css';

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
    <div className="agent-container">
      <h1>Agent Management</h1>

      {message && <div className="message">{message}</div>}

      <button className="toggle-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add Agent'}
      </button>

      {showForm && (
        <div className="form-container">
          <h2>{editingMatricule ? 'Edit Agent' : 'Add New Agent'}</h2>
          <form onSubmit={handleSubmit}>
            {!editingMatricule && (
              <div className="form-group">
                <label>Matricule:</label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Prenom:</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fonction:</label>
              <input
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Service:</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Telephone:</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Adresse:</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">
              {editingMatricule ? 'Update Agent' : 'Add Agent'}
            </button>
            {editingMatricule && (
              <button type="button" onClick={resetForm}>Cancel</button>
            )}
          </form>
        </div>
      )}
      <div className="agents-list">
        <h2>Agents List</h2>
        {agents.length === 0 ? (
          <p>No agents found</p>
        ) : (
          <table>
            <thead>
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
                  <td>{agent.matricule}</td>
                  <td>{agent.nom}</td>
                  <td>{agent.prenom}</td>
                  <td>{agent.fonction}</td>
                  <td>{agent.email}</td>
                  <td>{agent.service}</td>
                  <td>{agent.telephone}</td>
                  <td>{agent.adresse}</td>
                  <td>
                    <button onClick={() => handleEdit(agent)}>Edit</button>
                    <button onClick={() => handleDelete(agent.matricule)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AgentManager;