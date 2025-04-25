import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Accueil({ auth }) {
  const cards = [
    { title: "Gestion des Agents", text: "Voir, ajouter ou modifier des agents", link: "/agents", icon: "bi bi-person-fill" },
    { title: "Gestion des Matériels", text: "Gérer le parc matériel", link: "/materiels", icon: "bi bi-pc-display" },
    { title: "Gestion des Contrats", text: "Consulter et créer des contrats", link: "/contrats", icon: "bi bi-file-earmark-check-fill" },
    { title: "Archive", text: "Consulter le matériel archivé", link: "/archive", icon: "bi bi-archive-fill" }
  ];

  if (auth?.type === 'admin') {
    cards.push({ title: "Paramétrage", text: "Gérer les paramètres de l'application", link: "/parametrage", icon: "bi bi-gear-fill" });
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Accueil</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {cards.map((card, idx) => (
          <Col key={idx}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="mb-3">
                  <i className={`${card.icon} fs-1`}></i>
                </div>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text className="flex-grow-1">{card.text}</Card.Text>
                <Button as={Link} to={card.link} variant="primary">
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
