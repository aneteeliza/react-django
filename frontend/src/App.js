import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
import Home from './pages/Home'; // Import Home page

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
      .then(function(res) {
        localStorage.setItem('currentUser', 'true');
        setCurrentUser(true);
      });
  }
  
  function submitRegistration(e) {
    e.preventDefault();
    client.post("/register", { email, username, password })
      .then(function(res) {
        client.post("/login", { email, password })
          .then(function(res) {
            localStorage.setItem('currentUser', 'true');
            setCurrentUser(true);
          });
      });
  }
  
  function submitLogout(e) {
    e.preventDefault();
    client.post("/logout", { withCredentials: true })
      .then(function(res) {
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
          <Navbar.Brand>Latvijas Kara muzejs</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex">
              {currentUser ? (
                <form onSubmit={submitLogout} className="d-inline">
                  <Button variant="outline-light" type="submit">Log out</Button>
                </form>
              ) : (
                <Button id="form_btn" onClick={update_form_btn} variant="outline-light" className="d-inline">Register</Button>
              )}

              {currentUser && (
                <Button variant="outline-light" className="ms-2 d-inline">
                  <Link to="/home" className="text-decoration-none text-light">Home</Link>
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
                <h3>You're logged in!</h3>
                <p className="text-muted">Welcome back to the app.</p>
              </Card>
            ) : (
              <Card className="w-50 p-4 shadow-lg rounded">
                <h4 className="text-center mb-4">{registrationToggle ? 'Register' : 'Log in'}</h4>
                <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>

                  {registrationToggle && (
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="rounded-pill"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 rounded-pill">
                    Submit
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <Button variant="link" onClick={update_form_btn} className="text-primary">
                    {registrationToggle ? 'Already have an account? Log in' : "Don't have an account? Register"}
                  </Button>
                </div>
              </Card>
            )
          } />
          
          <Route path="/home" element={<Home />} />

          {/* Redirect to Home if user is not logged in */}
          <Route path="*" element={<Navigate to={currentUser ? "/home" : "/"} />} />
        </Routes>
      </Container>

      <footer className="footer">
        <p>&copy; 2024 Larvijas Kara muzejs. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;