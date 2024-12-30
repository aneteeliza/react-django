import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Profils from './pages/Profile';
import Info from './pages/Info';
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser') === 'true');
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('Visi lauki ir jāaizpilda!'); // "All fields are required!"
      return false;
    }
    setErrorMessage('');
    return true;
  }

  function submitLogin(e) {
    e.preventDefault();
    if (!validateFields()) return;

    client.post("/login", { email, password })
      .then(() => {
        localStorage.setItem('currentUser', 'true');
        setCurrentUser(true);
        navigate('/');
      })
      .catch(error => {
        console.error('Login error:', error);
        setErrorMessage('Pietikšanās neizdevās. Pārbaudiet e-pastu un/vai paroli.');
      });
  }

  // function submitRegistration(e) {
  //   e.preventDefault();
  //   if (!validateFields()) return;

  //   client.post("/register", { 
  //     email, 
  //     password, 
  //     confirm_password: confirmPassword, 
  //     first_name: firstName, 
  //     last_name: lastName 
  //   })    
  //     .then(() => {
  //       client.post("/login", { email, password })
  //         .then(() => {
  //           localStorage.setItem('currentUser', 'true');
  //           setCurrentUser(true);
  //           navigate('/');
  //         });
  //     })
  //     .catch(error => {
  //       console.error('Kļūda reģistrācijā:', error.response ? error.response.data : error);
  //       setErrorMessage('Reģistrācija neizdevās. Mēģiniet vēlreiz.');
  //     });      
  // }

  function submitRegistration(e) {
    e.preventDefault();
    if (!validateFields()) return;
  
    client.post("/register", { 
      email, 
      password, 
      confirm_password: confirmPassword, 
      first_name: firstName, 
      last_name: lastName 
    })
    .then(() => {
      client.post("/login", { email, password })
        .then(() => {
          localStorage.setItem('currentUser', 'true');
          setCurrentUser(true);
          navigate('/');
        });
    })
    .catch(error => {
      if (error.response && error.response.data) {
        // Error handling based on field-specific errors
        const errorData = error.response.data;
  
        // Check if email error exists
        if (errorData.email) {
          console.error('Email Error:', errorData.email);
          setErrorMessage(errorData.email); // Display email-specific error
        }
        // Check if password error exists
        else if (errorData.password) {
          console.error('Password Error:', errorData.password);
          setErrorMessage(errorData.password); // Display password-specific error
        }
        // General error fallback
        else {
          const generalError = errorData.detail || 'Reģistrācija neizdevās. Mēģiniet vēlreiz.';
          console.error('General Error:', generalError);
          setErrorMessage(generalError); // Display general error
        }
      } else {
        // If no response, display a generic error message
        console.error('Kļūda reģistrācijā:', error);
        setErrorMessage('Reģistrācija neizdevās. Mēģiniet vēlreiz.');
      }
    });
  }
  
  

  function submitLogout(e) {
    e.preventDefault();
    client.post("/logout")
      .then(() => {
        localStorage.removeItem('currentUser');
        setCurrentUser(false);
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }

  const [confirmPassword, setConfirmPassword] = useState('');

  // Update validation logic
  function validateFields() {
    if (!email || !password || (registrationToggle && (!firstName || !lastName || !confirmPassword))) {
      setErrorMessage('Visi lauki ir jāaizpilda!'); // "All fields are required!"
      return false;
    }
    if (registrationToggle && password !== confirmPassword) {
      setErrorMessage('Paroles nesakrīt!'); // "Passwords do not match!"
      return false;
    }
    setErrorMessage('');
    return true;
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" className="sticky-top">
        <Container>
          <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latviešu karavīri</a></Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex">
              {!currentUser && (
                <Button variant="outline-dark" className="ms-2 d-inline">
                  <Link to="/info" className="text-decoration-none text-light">Par Datubāzi</Link>
                </Button>
              )}
              {currentUser && (
                <>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/info" className="text-decoration-none text-light"><FaHome className="icon-button" /> Par Datubāzi</Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/meklesana" className="text-decoration-none text-light"><FaSearch className="icon-button" /> Meklēšana</Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/profils" className="text-decoration-none text-light"><FaUser className="icon-button" /> Profils</Link>
                  </Button>
                </>
              )}
              {currentUser ? (
                <form onSubmit={submitLogout} className="ms-2 d-inline">
                  <Button variant="outline-dark" type="submit" className="text-light"><FaSignOutAlt /> Atteikties</Button>
                </form>
              ) : (
                <Button id="form_btn" onClick={update_form_btn} variant="outline-dark" className="text-light">
                  {registrationToggle ? <><FaSignInAlt className="me-2 icon-button"/> Pieteikties</> : <><FaUserPlus className="me-2 icon-button"/> Reģistrēties</>}
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-1">
        <Routes>
          <Route path="/login" element={
            <Card className="w-50 p-4 shadow-lg rounded">
              <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
              <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group className="mb-3 w-100">
                  <Form.Label>E-pasta adrese</Form.Label>
                  <Form.Control type="email" placeholder="Ievadiet e-pasta adresi" value={email} onChange={e => setEmail(e.target.value)} className="rounded-pill" />
                </Form.Group>
                {registrationToggle && (
                  <>
                    <Form.Group className="mb-3 w-100">
                      <Form.Label>Vārds</Form.Label>
                      <Form.Control type="text" placeholder="Ievadiet vārdu" value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-pill" />
                    </Form.Group>
                    <Form.Group className="mb-3 w-100">
                      <Form.Label>Uzvārds</Form.Label>
                      <Form.Control type="text" placeholder="Ievadiet uzvārdu" value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-pill" />
                    </Form.Group>
                  </>
                )}
                <Form.Group className="mb-3 w-100">
                  <Form.Label>Parole</Form.Label>
                  <Form.Control type="password" placeholder="Ievadiet paroli" value={password} onChange={e => setPassword(e.target.value)} className="rounded-pill" />
                </Form.Group>
                {registrationToggle && (
                  <>
                    <Form.Group className="mb-3 w-100">
                      <Form.Label>Apstipriniet paroli</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="Atkārtoti ievadiet paroli" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        className="rounded-pill" 
                      />
                    </Form.Group>

                  </>
                )}
                <Button variant="primary" type="submit" className="w-100 rounded-pill">
                  {registrationToggle ? 'Reģistrēties' : 'Pieteikties'}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <Button variant="link" onClick={update_form_btn} className="text-primary">
                  {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
                </Button>
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
        <p>&copy; 2024 Latviešu Kara muzejs. Visas tiesības aizsargātas.</p>
      </footer>
    </div>
  );
}

export default App;
