import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ErrorModal = ({ error, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={!!error}
      onHide={onClose}
      centered
      className="d-flex align-items-center"
    >
      <Modal.Body>
        {error && (
          <p className="text-danger">
            {typeof error === 'string'
              ? error
              : t('Sessija beigusies, ielogojies atkārtoti')}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onClose}>
          {t('Aizvērt')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
