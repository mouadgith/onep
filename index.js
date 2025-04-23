const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(bodyParser.json());

const db = new sqlite3.Database('./onep_data.db');

app.get('/api/agents', (_, res) => {
  const sql = `SELECT * FROM agent`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch agents.' });
    }
    res.status(200).json(rows);
  });
});

app.get('/api/agents/:matricule', (req, res) => {
  const { matricule } = req.params;
  const sql = `SELECT * FROM agent WHERE matricule = ?`;
  db.get(sql, [matricule], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch agent.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).json(row);
  });
});

app.post('/api/agents', (req, res) => {
  const { matricule, nom, prenom, fonction, email, service, telephone, adresse } = req.body;

  if (!matricule || !nom || !prenom || !fonction || !email || !service || !telephone || !adresse) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = `INSERT INTO agent (matricule, nom, prenom, fonction, email, service, telephone, adresse)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [matricule, nom, prenom, fonction, email, service, telephone, adresse], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to insert agent.' });
    }
    res.status(201).json({ message: 'Agent added successfully!', id: this.lastID });
  });
});

app.put('/api/agents/:matricule', (req, res) => {
  const { matricule } = req.params;
  const { nom, prenom, fonction, email, service, telephone, adresse } = req.body;

  if (!nom || !prenom || !fonction || !email || !service || !telephone || !adresse) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = `UPDATE agent 
               SET nom = ?, prenom = ?, fonction = ?, email = ?, service = ?, telephone = ?, adresse = ?
               WHERE matricule = ?`;

  db.run(sql, [nom, prenom, fonction, email, service, telephone, adresse, matricule], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update agent.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).json({ message: 'Agent updated successfully!' });
  });
});

app.delete('/api/agents/:matricule', (req, res) => {
  const { matricule } = req.params;
  const sql = `DELETE FROM agent WHERE matricule = ?`;

  db.run(sql, [matricule], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete agent.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Agent not found.' });
    }
    res.status(200).json({ message: 'Agent deleted successfully!' });
  });
});

app.get('/api/materiels', (req, res) => {
  const {
    numero_serie,
    marque,
    modele,
    code_ONEE,
    activite,
    famille,
    sous_famille,
    agent_matricule,
    numero_contrat
  } = req.query;

  let sql = 'SELECT * FROM materiel WHERE 1=1';
  const params = [];

  if (numero_serie) {
    sql += ' AND numero_serie = ?';
    params.push(numero_serie);
  }
  if (marque) {
    sql += ' AND marque LIKE ?';
    params.push(`%${marque}%`);
  }
  if (modele) {
    sql += ' AND modele = ?';
    params.push(modele);
  }
  if (code_ONEE) {
    sql += ' AND code_ONEE = ?';
    params.push(code_ONEE);
  }
  if (activite) {
    sql += ' AND activite = ?';
    params.push(activite);
  }
  if (famille) {
    sql += ' AND famille = ?';
    params.push(famille);
  }
  if (sous_famille) {
    sql += ' AND sous_famille = ?';
    params.push(sous_famille);
  }
  if (agent_matricule) {
    sql += ' AND agent_matricule = ?';
    params.push(agent_matricule);
  }
  if (numero_contrat) {
    sql += ' AND numero_contrat = ?';
    params.push(numero_contrat);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch materiels.' });
    }
    res.status(200).json(rows);
  });
});

app.get('/api/materiels/:numero_serie', (req, res) => {
  const { numero_serie } = req.params;
  const sql = 'SELECT * FROM materiel WHERE numero_serie = ?';
  
  db.get(sql, [numero_serie], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch materiel.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Materiel not found.' });
    }
    res.status(200).json(row);
  });
});

app.post('/api/materiels', (req, res) => {
  const {
    numero_serie,
    marque,
    designation_article,
    modele,
    code_ONEE,
    activite,
    famille,
    sous_famille,
    agent_matricule,
    numero_contrat
  } = req.body;

  if (!numero_serie || !marque) {
    return res.status(400).json({ error: 'Numero de série and marque are required.' });
  }

  const sql = `
    INSERT INTO materiel 
      (numero_serie, marque, designation_article, modele, code_ONEE, activite, famille, sous_famille, agent_matricule, numero_contrat)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    numero_serie,
    marque,
    designation_article,
    modele,
    code_ONEE,
    activite,
    famille,
    sous_famille,
    agent_matricule,
    numero_contrat
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting materiel:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Materiel added successfully!', id: this.lastID });
  });
});

app.put('/api/materiels/:numero_serie', (req, res) => {
  const { numero_serie } = req.params;
  const {
    marque,
    designation_article,
    modele,
    code_ONEE,
    activite,
    famille,
    sous_famille,
    agent_matricule,
    numero_contrat
  } = req.body;

  const sql = `
    UPDATE materiel 
    SET marque = ?, designation_article = ?, modele = ?, code_ONEE = ?, activite = ?, famille = ?, sous_famille = ?, agent_matricule = ?, numero_contrat = ?
    WHERE numero_serie = ?
  `;

  db.run(sql, [marque, designation_article, modele, code_ONEE, activite, famille, sous_famille, agent_matricule, numero_contrat, numero_serie], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update materiel.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Materiel not found.' });
    }
    res.status(200).json({ message: 'Materiel updated successfully!' });
  });
});

app.delete('/api/materiels/:numero_serie', (req, res) => {
  const { numero_serie } = req.params;
  const sql = `DELETE FROM materiel WHERE numero_serie = ?`;

  db.run(sql, [numero_serie], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete materiel.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Materiel not found.' });
    }
    res.status(200).json({ message: 'Materiel deleted successfully!' });
  });
});


app.get('/api/auth', (_, res) => {
  db.all('SELECT * FROM authentification', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch auth users.' });
    res.status(200).json(rows);
  });
});

app.get('/api/auth/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM authentification WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch auth user.' });
    if (!row) return res.status(404).json({ error: 'Auth user not found.' });
    res.status(200).json(row);
  });
  });
app.post('/api/auth', async (req, res) => {
  const { login, pass } = req.body;
  if (!login || !pass) {
    return res.status(400).json({ error: 'Login and password are required.' });
  }
  if (!/^(admin|agent)\d+$/.test(login)) {
    return res.status(400).json({ 
      error: 'Login must start with "admin" or "agent" followed by numbers (e.g. admin1, agent2).' 
    });
  }
  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM authentification WHERE login = ?', [login], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Login already exists.' });
    }
    const hashedPass = await bcrypt.hash(pass, saltRounds);
    const sql = 'INSERT INTO authentification (login, pass) VALUES (?, ?)';
    db.run(sql, [login, hashedPass], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create user.' });
      res.status(201).json({ 
        id: this.lastID,
        login,
        message: 'User created successfully.' 
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during user creation.' });
  }
});
app.put('/api/auth/:id', async (req, res) => {
  const { id } = req.params;
  const { login, pass } = req.body;
  
  if (!login || !pass) return res.status(400).json({ error: 'Login and password are required.' });

  try {
    const hashedPass = await bcrypt.hash(pass, saltRounds);
    const sql = 'UPDATE authentification SET pass = ? WHERE id = ?';
    
    db.run(sql, [hashedPass, id], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update user.' });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found.' });
      res.status(200).json({ message: 'Password updated successfully.' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to hash password.' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  const { login, pass } = req.body;
  if (!login || !pass) return res.status(400).json({ error: 'Login and password are required.' });

  db.get('SELECT * FROM authentification WHERE login = ?', [login], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials.' });
    
    try {
      const match = await bcrypt.compare(pass, row.pass);
      if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
      
      const userType = row.login.startsWith('admin') ? 'admin' : 'agent';
      res.status(200).json({ 
        id: row.id,
        login: row.login,
        type: userType
      });
    } catch (err) {
      res.status(500).json({ error: 'Authentication error.' });
    }
  });
});
app.delete('/api/auth/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM authentification WHERE id = ?';
  
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete auth user.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Auth user not found.' });
    res.status(200).json({ message: 'Auth user deleted successfully.' });
  });
});
app.get('/api/societes', (_, res) => {
  const sql = 'SELECT * FROM societe';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

app.post('/api/societes', (req, res) => {
  const { id_fiscale, nom, email, entite } = req.body;
  if (!nom) return res.status(400).json({ error: 'Company name is required.' });

  const sql = `INSERT INTO societe (id_fiscale, nom, email, entite) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id_fiscale, nom, email, entite], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Company added.', id: this.lastID });
  });
});
app.put('/api/societes/:id_fiscale', (req, res) => {
  const { id_fiscale } = req.params;
  const { nom, email, entite } = req.body;
  
  if (!nom) return res.status(400).json({ error: 'Company name is required.' });

  const sql = 'UPDATE societe SET nom = ?, email = ?, entite = ? WHERE id_fiscale = ?';
  db.run(sql, [nom, email, entite, id_fiscale], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Company not found.' });
    res.status(200).json({ message: 'Company updated successfully.' });
  });
});

app.delete('/api/societes/:id_fiscale', (req, res) => {
  const societeId = req.params.id_fiscale;

  db.run('DELETE FROM contrat WHERE societe_id = ?', [societeId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete contracts.' });

    db.run('DELETE FROM societe WHERE id_fiscale = ?', [societeId], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to delete company.' });
      res.status(200).json({ message: 'Company and related contracts deleted.' });
    });
  });
});

app.get('/api/societes-with-contrats', (_, res) => {
  const sql = `
    SELECT s.id_fiscale, s.nom, s.email, s.entite,
           c.numero_contrat, c.objet, c.annee, c.remarque, c.societe_id
    FROM societe s
    LEFT JOIN contrat c ON c.societe_id = s.id_fiscale
    ORDER BY s.nom, c.annee DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch data.' });

    const companies = {};
    rows.forEach(row => {
      if (!companies[row.id_fiscale]) {
        companies[row.id_fiscale] = {
          id_fiscale: row.id_fiscale,
          nom: row.nom,
          email: row.email,
          entite: row.entite,
          contrats: []
        };
      }

      if (row.numero_contrat) {
        companies[row.id_fiscale].contrats.push({
          numero_contrat: row.numero_contrat,
          objet: row.objet,
          annee: row.annee,
          remarque: row.remarque,
          societe_id: row.societe_id
        });
      }
    });

    res.status(200).json(Object.values(companies));
  });
});


app.get('/api/societes/:societe_id/contrats', (req, res) => {
  const { societe_id } = req.params;
  const sql = `SELECT * FROM contrat WHERE societe_id = ? ORDER BY annee DESC`;
  db.all(sql, [societe_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});
app.get('/api/contrats', (_, res) => {
  const sql = 'SELECT * FROM contrat ORDER BY annee DESC';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

app.get('/api/contrats/:numero_contrat', (req, res) => {
  const { numero_contrat } = req.params;
  const sql = 'SELECT * FROM contrat WHERE numero_contrat = ?';

  db.get(sql, [numero_contrat], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Contrat non trouvé.' });
    res.status(200).json(row);
  });
});

app.post('/api/contrats', (req, res) => {
  const { numero_contrat, objet, annee, remarque, societe_id } = req.body;

  if (!numero_contrat || !objet || !annee) {
    return res.status(400).json({ error: 'Le numéro, l\'objet et l\'année du contrat sont obligatoires.' });
  }

  const sql = `
    INSERT INTO contrat (numero_contrat, objet, annee, remarque, societe_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [numero_contrat, objet, annee, remarque, societe_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Contrat ajouté.', numero_contrat: numero_contrat });
  });
});

app.put('/api/contrats/:numero_contrat', (req, res) => {
  const { numero_contrat } = req.params;
  const { objet, annee, remarque, societe_id } = req.body;

  if (!objet || !annee || !societe_id) {
    return res.status(400).json({ error: 'Objet, année et société sont obligatoires.' });
  }

  const sql = `
    UPDATE contrat 
    SET objet = ?, annee = ?, remarque = ?, societe_id = ?
    WHERE numero_contrat = ?
  `;

  db.run(sql, [objet, annee, remarque, societe_id, numero_contrat], function (err) {
    if (err) return res.status(500).json({ error: 'Échec de la mise à jour.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Contrat non trouvé.' });
    res.status(200).json({ message: 'Contrat mis à jour avec succès.' });
  });
});

app.delete('/api/contrats/:numero_contrat', (req, res) => {
  const { numero_contrat } = req.params;
  const sql = `DELETE FROM contrat WHERE numero_contrat = ?`;

  db.run(sql, [numero_contrat], function (err) {
    if (err) return res.status(500).json({ error: 'Échec de la suppression.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Contrat non trouvé.' });
    res.status(200).json({ message: 'Contrat supprimé avec succès.' });
  });
});




app.get('/api/parametrage/:code', (req, res) => {
  const { code } = req.params;
  const sql = 'SELECT * FROM parametrage WHERE code = ? ORDER BY valeur ASC';
  db.all(sql, [code], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

app.post('/api/parametrage', (req, res) => {
  const { code, valeur } = req.body;
  if (!code || !valeur) return res.status(400).json({ error: 'Code et valeur sont obligatoires.' });

  const sql = 'INSERT INTO parametrage (code, valeur) VALUES (?, ?)';
  db.run(sql, [code, valeur], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Valeur ajoutée.', id: this.lastID });
  });
});

app.put('/api/parametrage/:id', (req, res) => {
  const { id } = req.params;
  const { valeur } = req.body;

  if (!valeur) return res.status(400).json({ error: 'Valeur est requise.' });

  const sql = 'UPDATE parametrage SET valeur = ? WHERE id = ?';
  db.run(sql, [valeur, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Valeur non trouvée.' });
    res.status(200).json({ message: 'Valeur mise à jour.' });
  });
});

app.delete('/api/parametrage/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM parametrage WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Valeur non trouvée.' });
    res.status(200).json({ message: 'Valeur supprimée.' });
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});