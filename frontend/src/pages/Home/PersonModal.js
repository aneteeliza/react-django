import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

const PersonModal = ({ show, selectedPerson, onClose, onExited }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={onClose}
      onExited={onExited}
      centered
      className="d-flex align-items-center"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Informācija")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {selectedPerson &&
            Object.entries(selectedPerson).map(([key, value]) => (
              <ListGroup.Item key={key}>
                <strong>{t(key)}:</strong> {value || t("Nav minēts")}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="dark" onClick={onClose}>
          {t("Aizvērt")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PersonModal;
