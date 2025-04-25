import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Alert, Badge, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArchiveManager.css';

function ArchiveManager() {
  const [archivedMaterials, setArchivedMaterials] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/materiels/archived';

  const fetchArchivedMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch archived materials');
      const data = await response.json();
      setArchivedMaterials(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedMaterials();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Archived Materials</h1>
        <Button 
          variant="outline-secondary" 
          onClick={fetchArchivedMaterials}
        >
          Refresh
        </Button>
      </div>

      {message && (
        <Alert variant="danger" dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Card>
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          <span>Archived Materials List</span>
          <Badge bg="secondary" pill>
            {archivedMaterials.length} items
          </Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : archivedMaterials.length === 0 ? (
            <Alert variant="info" className="text-center">
              No archived materials found
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Serial Number</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Archived Date</th>
                    <th>Returned To</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedMaterials.map(material => (
                    <tr key={material.id}>
                      <td><Badge bg="secondary">{material.numero_serie}</Badge></td>
                      <td>{material.marque}</td>
                      <td>{material.modele}</td>
                      <td>{new Date(material.date_archivage).toLocaleString()}</td>
                      <td>{material.company_returned_to}</td>
                      <td>{material.reason}</td>
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
}

export default ArchiveManager;