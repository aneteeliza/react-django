import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const EditPersonModal = ({ show, selectedPerson, onEdited, onClose, onExited }) => {
    const { t } = useTranslation();
    // State to hold the form data (editable fields)
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Set form data to selectedPerson when the modal opens
        if (selectedPerson) {
            setFormData(selectedPerson);
        }
    }, [selectedPerson]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onEdited(formData);
        onClose();
    };

    // Render form fields in pairs (2 columns per row)
    const renderFormFields = () => {
        if (!selectedPerson) return null;

        const filteredPerson = { ...selectedPerson };
        delete filteredPerson.id;

        const entries = Object.entries(filteredPerson);

        const rows = [];

        // Process entries in pairs (0,1), (2,3), etc.
        for (let i = 0; i < entries.length; i += 2) {
            const [key1, value1] = entries[i];
            // Check if there's a second entry in this pair
            const hasSecondEntry = i + 1 < entries.length;
            const [key2, value2] = hasSecondEntry ? entries[i + 1] : [null, null];

            rows.push(
                <Row key={`row-${i}`} className="mb-3">
                    <Col xs={12} md={6}>
                        <Form.Group>
                            <Form.Label style={{ fontWeight: 'bold' }}>{t(key1)}</Form.Label>
                            <Form.Control
                                type="text"
                                name={key1}
                                value={formData[key1] || ''}
                                onChange={handleInputChange}
                                placeholder={t("Ievadiet") + " " + t(key1)}
                                className="w-100"
                            />
                        </Form.Group>
                    </Col>

                    {hasSecondEntry && (
                        <Col xs={12} md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold' }}>{t(key2)}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={key2}
                                    value={formData[key2] || ''}
                                    onChange={handleInputChange}
                                    placeholder={t("Ievadiet") + " " + t(key2)}
                                    className="w-100"
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>
            );
        }

        return rows;
    };

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
            <Modal.Body className="d-flex justify-content-center">
                <Form>
                    {renderFormFields()}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    {t("Aizvērt")}
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {t("Saglabāt")}
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default EditPersonModal;