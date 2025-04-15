import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner, Alert, Modal, Card } from 'react-bootstrap';
import './styles.css';
import { NetworkProvider } from '../NetworkProvider';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

function Profils() {
  const [profile, setProfile] = useState({ email: '' });
  const [originalProfile, setOriginalProfile] = useState({ email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoder, setShowLoader] = useState(false);

  const { t } = useTranslation();


  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await NetworkProvider.getUser()
      const profile = {
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
      };
      setProfile(profile);
      setOriginalProfile(profile);
      setLoading(false)
    } catch (error) {
      setError(
        error.response ? error.response.data : t('Kaut kas nogāja greizi')
      );
      setLoading(false);
    }
  }

  const handleEditToggle = async () => {
    if (!profile.email.includes('@')) {
      setErrorMessage(t('E-pastam jāsatur "@"'));
      return; // Prevent further execution if the email is invalid
    }

    if (editMode) {
      try {
        setShowLoader(true)
        await NetworkProvider.updateUser(profile)
        setError(null);
        setSuccessMessage(t('Profila informācija veiksmīgi rediģēta'));
      } catch (error) {
        setError(null);
        setErrorMessage(t('Izvēlies citu e-pastu. Lietotājs ar šādu e-pastu jau ir reģistrēts'));
      } finally {
        setShowLoader(false)
      }

    }
    setEditMode(!editMode);
  };


  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };


  const handleChangePassword = async () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    const passwordValidationErrors = [];

    if (newPassword !== confirmPassword) {
      passwordValidationErrors.push(t('Paroles nesakrīt'));
    }

    if (!/[A-Z]/.test(newPassword)) {
      passwordValidationErrors.push(t('Parolei jāsatur vismaz 1 lielais burts'));
    }
    // Check for at least 8 characters
    if (newPassword.length < 8) {
      passwordValidationErrors.push(t('Parolei jābūt vismaz 8 simbolu garai'));
    }

    // Check for at least one number
    if (!/\d/.test(newPassword)) {
      passwordValidationErrors.push(t('Parolei jāsatur vismaz 1 cipars'));
    }
    if (passwordValidationErrors.length > 0) {
      setPasswordError(passwordValidationErrors.join(' '));
      return;
    }
    setPasswordError('');
    setPasswordChangeError(null);

    try {
      await NetworkProvider.changePassword(currentPassword, newPassword)
      setSuccessMessage(t('Parole veiksmīgi nomainīta'));
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordModal(false);

      await NetworkProvider.loginUser(profile.email, newPassword)
      console.log('User re-authenticated');
    } catch (error) {
      if (error.response) {
        if (error.response.data.current_password) {
          setPasswordChangeError(t('Pašreizēja parole ir nepareiza'));
        } else {
          setPasswordChangeError(error.response.data.detail || t('Kļūda paroles maiņā'));
        }
      } else {
        setPasswordChangeError(t('Radās kļūda, mainot paroli'));
      }
    }
  };

  const handleDeleteProfile = async () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    try {
      await NetworkProvider.deleteUser()
      setSuccessMessage(t('Profils ir izdzēsts'));
      setProfile({});
      document.cookie = 'csrftoken=; Max-Age=0'; // Clear CSRF token
      document.cookie = 'sessionid=; Max-Age=0'; // Clear session cookie
      localStorage.clear(); // Clear any local storage
      window.location.href = '/login'; // Redirect to login
    } catch (error) {
      setError(
        error.response ? error.response.data : t('Kaut kas nogāja greizi!')
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  const isFormValid = () => {
    return profile.first_name.trim() !== '' && profile.last_name.trim() !== '' && profile.email.trim() !== '';
  };

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-center align-items-center">
        <Card className="w-50 text-center p-4 shadow-lg rounded" style={{ border: 'none' }}>
          <h1>Profils</h1>

          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </Alert>
          ) : (
            <>
              {successMessage && (
                <Alert variant="success">
                  {successMessage}
                </Alert>
              )}

              {errorMessage && (
                <div class="fade alert alert-danger show">
                  {errorMessage}
                </div>
              )}

              <Form>
                <Form.Group className="mb-3 w-100">
                  <Form.Label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold' }}>{t("E-pasta adrese")}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="E-pasta adrese"
                    value={profile.email}
                    readOnly={!editMode}
                    onChange={handleInputChange}
                    className="rounded-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100">
                  <Form.Label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold' }}>{t("Vārds")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="Vārds"
                    value={profile.first_name}
                    readOnly={!editMode}
                    onChange={handleInputChange}
                    className="rounded-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100">
                  <Form.Label style={{ display: 'block', textAlign: 'left', fontWeight: 'bold' }}>{t("Uzvārds")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder={t("Uzvārds")}
                    value={profile.last_name}
                    readOnly={!editMode}
                    onChange={handleInputChange}
                    className="rounded-sm"
                  />
                </Form.Group>

                {/* Show "Nomainīt paroli" only when not in edit mode */}
                {!editMode && (
                  <Button
                    variant="link"
                    onClick={() => setShowPasswordModal(true)}
                    className="text-primary"
                  >
                    Nomainīt paroli
                  </Button>
                )}

                {editMode && (
                  <Button
                    variant="dark"
                    className="me-2"
                    onClick={() => {
                      setEditMode(false);
                      setProfile(originalProfile);
                    }}
                  >
                    Atcelt
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleEditToggle}
                  className="me-2"
                  disabled={!isFormValid()} // Disable if any required field is empty
                >
                  {editMode ? t('Saglabāt izmaiņas') : t('Rediģēt')}
                </Button>

                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="ms-2"
                >
                  Dzēst profilu
                </Button>
              </Form>
            </>
          )}
        </Card>
      </div>

      {/* Modal for Password Change */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nomainīt paroli</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordChangeError && (
            <Alert variant="danger">
              {passwordChangeError}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3 w-100">
              <Form.Label>{t("Pašreizējā parole")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("Ievadiet pašreizējo paroli")}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3 w-100">
              <Form.Label>{t("Jaunā parole</Form.Label")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("Ievadiet jauno paroli")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3 w-100">
              <Form.Label>{t("Apstiprināt jauno paroli")}</Form.Label>
              <Form.Control
                type="password"
                placeholder={t("Atkārtoti ievadiet jauno paroli")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-sm"
              />
            </Form.Group>

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowPasswordModal(false)}>
            {t("Aizvērt")}
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            {t("Saglabāt jauno paroli")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("Apstiprināt profila dzēšanu")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("Vai tiešām vēlaties dzēst savu profilu? Šī darbība ir neatgriezeniska")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t("Atcelt")}
          </Button>
          <Button variant="danger" onClick={handleDeleteProfile}>
            {t("Dzēst profilu")}
          </Button>
        </Modal.Footer>
      </Modal>

      {showLoder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <ClipLoader color="#000" loading={true} size={40} />
        </div>
      )}
    </Container>
  );

}

export default Profils;