import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Modal, Card, InputGroup } from 'react-bootstrap';
import './styles.css';
import { NetworkProvider } from '../NetworkProvider';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

function Profils() {
  // State management
  const [profile, setProfile] = useState({ email: '', first_name: '', last_name: '' });
  const [originalProfile, setOriginalProfile] = useState({ email: '', first_name: '', last_name: '' });
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
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { t } = useTranslation();

  // Load user data on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Auto-dismiss success and error messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Fetch user data from API
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await NetworkProvider.getUser();
      const profile = {
        email: response.user.email || '',
        first_name: response.user.first_name || '',
        last_name: response.user.last_name || '',
      };
      setProfile(profile);
      setOriginalProfile(profile);
    } catch (error) {
      setError(
        error.response ? error.response.data : t('Kaut kas nogāja greizi')
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));

    // Clear field-specific errors when user makes changes
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!profile.first_name.trim()) {
      errors.first_name = t('Vārds ir obligāts');
    }

    if (!profile.last_name.trim()) {
      errors.last_name = t('Uzvārds ir obligāts');
    }

    if (!profile.email.trim()) {
      errors.email = t('E-pasts ir obligāts');
    } else if (!profile.email.includes('@')) {
      errors.email = t('E-pastam jāsatur "@"');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setShowLoader(true);
      await NetworkProvider.updateUser(profile);
      setOriginalProfile({ ...profile });
      setSuccessMessage(t('Profila informācija veiksmīgi rediģēta'));
      setEditMode(false);
    } catch (error) {
      setErrorMessage(t('Izvēlies citu e-pastu. Lietotājs ar šādu e-pastu jau ir reģistrēts'));
    } finally {
      setShowLoader(false);
    }
  };

  // Handle cancel edit mode
  const handleCancelEdit = () => {
    setProfile({ ...originalProfile });
    setEditMode(false);
    setFieldErrors({});
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordStrength(checkPasswordStrength(newPass));
  };

  // Validate password
  const validatePassword = () => {
    const errors = [];

    if (newPassword !== confirmPassword) {
      errors.push(t('Paroles nesakrīt'));
    }

    if (!/[A-Z]/.test(newPassword)) {
      errors.push(t('Parolei jāsatur vismaz 1 lielais burts'));
    }

    if (newPassword.length < 8) {
      errors.push(t('Parolei jābūt vismaz 8 simbolu garai'));
    }

    if (!/\d/.test(newPassword)) {
      errors.push(t('Parolei jāsatur vismaz 1 cipars'));
    }

    if (errors.length > 0) {
      setPasswordError(errors.join(' '));
      return false;
    }

    setPasswordError('');
    return true;
  };

  // Handle password change submission
  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setPasswordChangeError(null);

    try {
      setShowLoader(true);
      await NetworkProvider.changePassword(currentPassword, newPassword);
      setSuccessMessage(t('Parole veiksmīgi nomainīta'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);

      await NetworkProvider.loginUser(profile.email, newPassword);
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
    } finally {
      setShowLoader(false);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      setShowLoader(true);
      await NetworkProvider.deleteUser();
      setSuccessMessage(t('Profils ir izdzēsts'));
      setProfile({});
      document.cookie = 'csrftoken=; Max-Age=0';
      document.cookie = 'sessionid=; Max-Age=0';
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      setError(
        error.response ? error.response.data : t('Kaut kas nogāja greizi!')
      );
    } finally {
      setShowDeleteModal(false);
      setShowLoader(false);
    }
  };

  // Password strength indicator
  const PasswordStrengthIndicator = ({ strength }) => {
    const getColorClass = () => {
      switch (strength) {
        case 0: return 'bg-danger';
        case 1: return 'bg-danger';
        case 2: return 'bg-warning';
        case 3: return 'bg-info';
        case 4: return 'bg-success';
        default: return 'bg-danger';
      }
    };

    const getLabel = () => {
      switch (strength) {
        case 0: return t('Ļoti vāja');
        case 1: return t('Vāja');
        case 2: return t('Vidēja');
        case 3: return t('Laba');
        case 4: return t('Izcila');
        default: return t('Vāja');
      }
    };

    const filledSegments = Array(strength).fill(0);
    const emptySegments = Array(4 - strength).fill(0);

    return (
      <div className="mb-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small>{t('Paroles stiprums')}:</small>
          <small className="text-muted">{getLabel()}</small>
        </div>
        <div className="d-flex" style={{ height: '6px', gap: '3px' }}>
          {filledSegments.map((_, i) => (
            <div key={`filled-${i}`} className={`flex-grow-1 ${getColorClass()}`} style={{ borderRadius: '3px' }}></div>
          ))}
          {emptySegments.map((_, i) => (
            <div key={`empty-${i}`} className="flex-grow-1 bg-light" style={{ borderRadius: '3px' }}></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-center align-items-center">
        <Card className="w-100 p-4 shadow-lg rounded" style={{ border: 'none', maxWidth: '600px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0 fw-bold">{t('Profils')}</h2>
            {!editMode ? (
              <Button
                variant="outline-primary"
                onClick={() => setEditMode(true)}
                size="sm"
              >
                <i className="bi bi-pencil me-1"></i>
                {t('Rediģēt')}
              </Button>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={handleCancelEdit}
                  size="sm"
                >
                  {t('Atcelt')}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  size="sm"
                >
                  {t('Saglabāt')}
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center p-5">
              <ClipLoader color="#0066CC" loading={true} size={40} />
              <p className="mt-3 text-muted">{t('Ielādē profila informāciju...')}</p>
            </div>
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
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}

              <Form>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">{t("E-pasta adrese")}</Form.Label>
                  <div className="form-control-plaintext">{profile.email || '-'}</div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">{t("Vārds")}</Form.Label>
                  {editMode ? (
                    <>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleInputChange}
                        className={fieldErrors.first_name ? "border-danger" : ""}
                        placeholder={t("Ievadiet vārdu")}
                      />
                      {fieldErrors.first_name && (
                        <div className="text-danger mt-1 small">{fieldErrors.first_name}</div>
                      )}
                    </>
                  ) : (
                    <div className="form-control-plaintext">{profile.first_name || '-'}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">{t("Uzvārds")}</Form.Label>
                  {editMode ? (
                    <>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleInputChange}
                        className={fieldErrors.last_name ? "border-danger" : ""}
                        placeholder={t("Ievadiet uzvārdu")}
                      />
                      {fieldErrors.last_name && (
                        <div className="text-danger mt-1 small">{fieldErrors.last_name}</div>
                      )}
                    </>
                  ) : (
                    <div className="form-control-plaintext">{profile.last_name || '-'}</div>
                  )}
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  {!editMode && (
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowPasswordModal(true)}
                      className="me-2"
                    >
                      {t("Nomainīt paroli")}
                    </Button>
                  )}

                  <Button
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                    className={!editMode ? "ms-auto" : ""}
                  >
                    {t("Dzēst profilu")}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Card>
      </div>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => {
          setShowPasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordError('');
          setPasswordChangeError(null);
          setPasswordStrength(0);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Nomainīt paroli")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordChangeError && (
            <Alert variant="danger">
              {passwordChangeError}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("Pašreizējā parole")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={t("Ievadiet pašreizējo paroli")}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? t("Slēpt") : t("Rādīt")}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("Jaunā parole")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={t("Ievadiet jauno paroli")}
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? t("Slēpt") : t("Rādīt")}
                </Button>
              </InputGroup>
              {newPassword && <PasswordStrengthIndicator strength={passwordStrength} />}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("Apstiprināt jauno paroli")}</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("Atkārtoti ievadiet jauno paroli")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? t("Slēpt") : t("Rādīt")}
                </Button>
              </InputGroup>
            </Form.Group>

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}

            <div className="mt-4 small">
              <p className="mb-1 fw-bold">{t("Paroles prasības")}:</p>
              <ul className="ps-4 mb-0">
                <li className={newPassword.length >= 8 ? "text-success" : "text-muted"}>
                  {t("Vismaz 8 simboli")}
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "text-success" : "text-muted"}>
                  {t("Vismaz 1 lielais burts")}
                </li>
                <li className={/\d/.test(newPassword) ? "text-success" : "text-muted"}>
                  {t("Vismaz 1 cipars")}
                </li>
              </ul>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPasswordModal(false)}>
            {t("Atcelt")}
          </Button>
          <Button
            variant="primary"
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            {t("Saglabāt jauno paroli")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Profile Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">{t("Dzēst profilu")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">{t("Vai tiešām vēlaties dzēst savu profilu? Šī darbība ir neatgriezeniska.")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            {t("Atcelt")}
          </Button>
          <Button variant="danger" onClick={handleDeleteProfile}>
            {t("Dzēst profilu")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Global Loading Overlay */}
      {showLoader && (
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
          <div className="text-center">
            <ClipLoader color="#0066CC" loading={true} size={40} />
            <p className="mt-3 text-muted">{t('Lūdzu uzgaidiet...')}</p>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Profils;