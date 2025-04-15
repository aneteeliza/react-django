import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Card, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import './App.css';
import Profils from './pages/Profile';
import Info from './pages/Info';
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { NetworkProvider } from './NetworkProvider';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';

function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser') === 'true');
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();
  const [showLoder, setShowLoader] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('currentUser') === 'true') {
      setCurrentUser(true);
    }
  }, []);

  function update_form_btn() {
    setRegistrationToggle(!registrationToggle);
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  }

  function validateFields() {
    if (!email || !password || (registrationToggle && (!firstName || !lastName))) {
      setErrorMessage(t('Visi lauki ir jāaizpilda'));
      return false;
    }
    setErrorMessage('');
    return true;
  }

  async function submitLogin(e) {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setShowLoader(true);
      const user = await NetworkProvider.loginUser({ email, password });
      localStorage.setItem('currentUser', 'true');
      setCurrentUser(true);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(t('Pietikšanās neizdevās. Pārbaudiet e-pastu un paroli'));
    } finally {
      setShowLoader(false);
    }
  }

  async function submitRegistration(e) {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setShowLoader(true);
      await NetworkProvider.registerUser({
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });

      const user = await NetworkProvider.loginUser({ email, password });

      localStorage.setItem('currentUser', 'true');
      setCurrentUser(true);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.email) {
          console.error('Email Error:', errorData.email);
          setErrorMessage(errorData.email);
        } else if (errorData.password) {
          console.error('Password Error:', errorData.password);
          setErrorMessage(errorData.password);
        } else {
          const generalError = errorData.detail || t('Reģistrācija neizdevās. Mēģiniet vēlreiz');
          console.error('General Error:', generalError);
          setErrorMessage(generalError);
        }
      } else {
        console.error(error);
        setErrorMessage(t('Reģistrācija neizdevās. Mēģiniet vēlreiz'));
      }
    } finally {
      setShowLoader(false)
    }
  }



  async function submitLogout(e) {
    e.preventDefault();
    try {
      setShowLoader(true)
      await NetworkProvider.logoutUser();
      localStorage.removeItem('currentUser');
      setCurrentUser(false);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setConfirmPassword('');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowLoader(false)
    }
  }

  const [confirmPassword, setConfirmPassword] = useState('');

  function validateFields() {
    if (!email || !password || (registrationToggle && (!firstName || !lastName || !confirmPassword))) {
      setErrorMessage(t('Visi lauki ir jāaizpilda')); // "All fields are required!"
      return false;
    }
    if (registrationToggle && password !== confirmPassword) {
      setErrorMessage(t('Paroles nesakrīt')); // "Passwords do not match!"
      return false;
    }
    setErrorMessage('');
    return true;
  }


  const [error, setError] = useState("");
  const validateEmail = () => {
    if (!email.includes("@")) {
      setError(t('Lūdzu, iekļaujiet „@” e-pasta adresē') + " " + email + " " + t("nav derīga e-pasta adrese"));
    } else {
      setError(""); // Clear the error if email is valid
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" className="sticky-top">
        <Container>
          <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>{t("Latviešu karavīri")}</a></Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex">
              {!currentUser && (
                <Button variant="outline-dark" className="ms-2 d-inline">
                  <Link to="/info" className="text-decoration-none text-light">{t("Par Datubāzi")}</Link>
                </Button>
              )}
              {currentUser && (
                <>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/info" className="text-decoration-none text-light"><FaHome className="icon-button" /> {t("Par Datubāzi")}</Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/meklesana" className="text-decoration-none text-light"><FaSearch className="icon-button" /> {t("Meklēšana")}</Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/profils" className="text-decoration-none text-light"><FaUser className="icon-button" /> {t("Profils")}</Link>
                  </Button>
                </>
              )}
              {currentUser ? (
                <form onSubmit={submitLogout} className="ms-2 d-inline">
                  <Button variant="outline-dark" type="submit" className="text-light"><FaSignOutAlt /> {t("Atteikties")}</Button>
                </form>
              ) : (
                <Button id="form_btn" onClick={update_form_btn} variant="outline-dark" className="text-light">
                  {registrationToggle ? <><FaSignInAlt className="me-2 icon-button" /> {t("Pieteikties")}</> : <><FaUserPlus className="me-2 icon-button" /> {t("Reģistrēties")}</>}
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-1">
        <Routes>
          <Route path="/login" element={
            <Card className="w-100 p-4 shadow-lg rounded" style={{ border: 'none', maxWidth: 550 }}>
              <h4 className="text-center mb-4">{registrationToggle ? t('Reģistrācija') : t('Pieteikties')}</h4>
              <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group className="mb-3 w-100">
                  <Form.Label className="d-block text-start w-100">{t("E-pasta adrese")}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("Ievadiet e-pasta adresi")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                    className={`rounded-sm ${error ? "is-invalid" : ""}`}
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </Form.Group>
                {registrationToggle && (
                  <Form.Group className="mb-3 mb-md-0 w-100">
                    <Row className="g-3 row-cols-1 row-cols-md-2">
                      {/* First Name */}
                      <Col className="w-50">
                        <Form.Label className="d-block text-start">{t("Vārds")}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t("Ievadiet vārdu")}
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="rounded-sm"
                        />
                      </Col>

                      {/* Last Name */}
                      <Col className="w-50">
                        <Form.Label className="d-block text-start">{t("Uzvārds")}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={t("Ievadiet uzvārdu")}
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="rounded-sm"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                )}
                <Form.Group className="mb-3 w-100">
                  <Form.Label className="d-block text-start w-100">{t("Parole")}</Form.Label>
                  <Form.Control type="password" placeholder={t("Ievadiet paroli")} value={password} onChange={e => setPassword(e.target.value)} className="rounded-sm" />
                </Form.Group>
                {registrationToggle && (
                  <>
                    <Form.Group className="mb-3 w-100">
                      <Form.Label className="d-block text-start w-100">{t("Apstipriniet paroli")}</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder={t("Atkārtoti ievadiet paroli")}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="rounded-sm"
                      />
                    </Form.Group>

                  </>
                )}
                <Button variant="primary" type="submit" className="w-100 rounded-sm">
                  {registrationToggle ? t('Reģistrēties') : t('Pieteikties')}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <span style={{ fontSize: '14px', display: 'inline-flex', alignItems: 'center' }}> {/* Apply flexbox for vertical alignment */}
                  {registrationToggle ? (
                    <>
                      {t('Jau ir lietotāja konts? ')}
                      <Button
                        variant="link"
                        onClick={update_form_btn}
                        className="text-primary p-0"
                        style={{
                          fontSize: '14px',
                          display: 'inline-flex',
                          marginLeft: 3,
                          alignItems: 'center'
                        }}
                      >
                        {t('Pieteikties')}
                      </Button>
                    </>
                  ) : (
                    <>
                      {t("Nav lietotāja konts? ")}
                      <Button
                        variant="link"
                        onClick={update_form_btn}
                        className="text-primary p-0"
                        style={{
                          fontSize: '14px',
                          display: 'inline-flex',
                          marginLeft: 3,
                          alignItems: 'center'
                        }}
                      >
                        {t("Reģistrēties")}
                      </Button>
                    </>
                  )}
                </span>
              </div>



            </Card>
          } />
          <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/meklesana" element={currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/login" />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Container>
      <footer className="footer">
        <p>&copy; 2024 Latvijas Kara muzejs.</p>
      </footer>
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
    </div>
  );
}

export default App;
