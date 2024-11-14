import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
import Home from './pages/Home'; // Import Home page
import './App.css';
import Profils from './pages/Profile';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {
  const [currentUser, setCurrentUser] = useState(false);
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(true);
    } else {
      setCurrentUser(false);
    }
  }, []);

  function update_form_btn() {
    setRegistrationToggle(!registrationToggle); // Toggle registration state
  }
  
  function submitLogin(e) {
    e.preventDefault();
    client.post("/login", { email, password })
      .then(function() {
        localStorage.setItem('currentUser', 'true');
        setCurrentUser(true);
      });
  }
  
  function submitRegistration(e) {
    e.preventDefault();
    client.post("/register", { email, username, password })
      .then(function() {
        client.post("/login", { email, password })
          .then(function() {
            localStorage.setItem('currentUser', 'true');
            setCurrentUser(true);
          });
      });
  }
  
  function submitLogout(e) {
    e.preventDefault();
    client.post("/logout", { withCredentials: true })
      .then(function() {
        localStorage.removeItem('currentUser');
        setCurrentUser(false);
        setEmail('');  // Clear the email field
        setPassword('');  // Clear the password field
        navigate('/');  // Navigate to the login page after logout
      });
  }
  

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latvijas Kara muzejs</a></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="d-flex">

  {currentUser && (
    <Button variant="outline-light" className="ms-2 d-inline">
      <Link to="/home" className="text-decoration-none text-light">Meklēšana</Link>
    </Button>
  )}

{currentUser && (
    <Button variant="outline-light" className="ms-2 d-inline">
      <Link to="/" className="text-decoration-none text-light">Home</Link>
    </Button>
  )}

{currentUser && (
  <Button variant="outline-light" className="ms-2 d-inline">
    <Link to="/profils" className="text-decoration-none text-light">Profils</Link>
  </Button>
)}

{currentUser ? (
    <form onSubmit={submitLogout} className="ms-2 d-inline">
      <Button variant="outline-light" type="submit">Atteikties</Button>
    </form>
  ) : (
    <Button
      id="form_btn"
      onClick={update_form_btn}
      variant="outline-light"
      className="d-inline"
    >
      {registrationToggle ? 'Pieteikties' : "Reģistrēties"}
    </Button>
  )}
</Navbar.Text>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <Routes>
          <Route path="/" element={
            currentUser ? (
              <Card className="w-50 text-center p-4 shadow-lg rounded">
                <h3>Publiskā datubāze "Latviešu karavīri"</h3>
                <p className="text-muted"><a href="https://www.karamuzejs.lv/" className='muzejs'>Latvijas Kara muzejs</a></p>
              </Card>
            ) : (
              <Card className="w-50 p-4 shadow-lg rounded">
                <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
                <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-pasta adrese</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ievadiet e-pasta adresi"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>

                  {registrationToggle && (
                    <Form.Group className="mb-3">
                      <Form.Label>Lietotājvārds</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ievadiet lietotājvārdu"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="rounded-pill"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Parole</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ievadiet paroli"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 rounded-pill">
                    Pieteikties
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <Button variant="link" onClick={update_form_btn} className="text-success">
                    {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
                  </Button>
                </div>
              </Card>
            )
          } />
          
          <Route path="/home" element={<Home />} />

          {/* Redirect to Home if user is not logged in */}
          <Route path="*" element={<Navigate to={currentUser ? "/home" : "/"} />} />
          <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/" />} />
        </Routes>
      </Container>

      <footer className="footer">
        <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
      </footer>
    </div>
  );
}

export default App;