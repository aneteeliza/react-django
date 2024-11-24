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
  // Initialize `currentUser` from localStorage
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser') === 'true');
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If user is logged in and page is refreshed, ensure `currentUser` is set correctly
    if (localStorage.getItem('currentUser') === 'true') {
      setCurrentUser(true);
    }
  }, []);

  function update_form_btn() {
    setRegistrationToggle(!registrationToggle);
    // Navigate to /login if on a different page
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  }

  function validateFields() {
    if (!email || !password || (registrationToggle && !username)) {
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
      .then(function() {
        localStorage.setItem('currentUser', 'true');
        setCurrentUser(true);
        navigate('/'); // Navigate to Home after login
      })
      .catch(error => {
        console.error('Login error:', error);
        setErrorMessage('Login failed. Please check your credentials.');
      });
  }

  function submitRegistration(e) {
    e.preventDefault();
    if (!validateFields()) return;

    client.post("/register", { email, username, password })
      .then(function() {
        client.post("/login", { email, password })
          .then(function() {
            localStorage.setItem('currentUser', 'true');
            setCurrentUser(true);
            navigate('/'); // Navigate to Home after successful registration
          });
      })
      .catch(error => {
        console.error('Registration error:', error);
        setErrorMessage('Registration failed. Please try again.');
      });
  }

  function submitLogout(e) {
    e.preventDefault();
    client.post("/logout", { withCredentials: true })
      .then(function() {
        localStorage.removeItem('currentUser');
        setCurrentUser(false);
        setEmail('');
        setUsername('');
        setPassword('');
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" className="sticky-top">
        <Container>
          <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latviešu karavīri</a></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex">
              {!currentUser && (
                <Button variant="outline-dark" className="ms-2 d-inline">
                  <Link to="/info" className="text-decoration-none text-light">
                    Par Datubāzi
                  </Link>
                </Button>
              )}
              {currentUser && (
                <>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/info" className="text-decoration-none text-light">
                      <FaHome className="icon-button" /> Par Datubāzi
                    </Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/meklesana" className="text-decoration-none text-light">
                      <FaSearch className="icon-button" /> Meklēšana
                    </Link>
                  </Button>
                  <Button variant="outline-dark" className="ms-2 d-inline">
                    <Link to="/profils" className="text-decoration-none text-light">
                      <FaUser className="icon-button" /> Profils
                    </Link>
                  </Button>
                </>
              )}
              {currentUser ? (
                <form onSubmit={submitLogout} className="ms-2 d-inline">
                  <Button variant="outline-dark" type="submit" className="text-light">
                    <FaSignOutAlt /> Atteikties
                  </Button>
                </form>
              ) : (
                <Button
                  id="form_btn"
                  onClick={update_form_btn}
                  variant="outline-dark"
                  className="text-light"
                >
                  {registrationToggle ? (
                    <>
                      <FaSignInAlt className="me-2 icon-button"/> Pieteikties
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2 icon-button"/> Reģistrēties
                    </>
                  )}
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
                  <Form.Control
                    type="email"
                    placeholder="Ievadiet e-pasta adresi"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="rounded-pill"
                  />
                </Form.Group>
                {registrationToggle && (
                  <Form.Group className="mb-3 w-100">
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
                <Form.Group className="mb-3 w-100">
                  <Form.Label>Parole</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ievadiet paroli"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="rounded-pill"
                  />
                </Form.Group>
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
         <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
       </footer>
    </div>
  );
}

export default App;


// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Container, Navbar, Button, Form, Card, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
// import Home from './pages/Home';
// import './App.css';
// import Profils from './pages/Profile';
// import Info from './pages/Info';
// import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

// axios.defaults.baseURL = 'http://127.0.0.1:8000';
// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// axios.defaults.withCredentials = true;

// const client = axios.create({
//   baseURL: "http://127.0.0.1:8000"
// });

// function App() {
//   const [currentUser, setCurrentUser] = useState(false);
//   const [registrationToggle, setRegistrationToggle] = useState(false);
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const user = localStorage.getItem('currentUser');
//     setCurrentUser(user === 'true');
//   }, []);

//   function update_form_btn() {
//     setRegistrationToggle(!registrationToggle);
//     // Navigate to /login if on a different page
//     if (window.location.pathname !== '/login') {
//       navigate('/login');
//     }
//   }

//   function validateFields() {
//     if (!email || !password || (registrationToggle && !username)) {
//       setErrorMessage('Visi lauki ir jāaizpilda!'); // "All fields are required!"
//       return false;
//     }
//     setErrorMessage('');
//     return true;
//   }

//   function submitLogin(e) {
//     e.preventDefault();
//     if (!validateFields()) return;

//     client.post("/login", { email, password })
//       .then(function() {
//         localStorage.setItem('currentUser', 'true');
//         setCurrentUser(true);
//         navigate('/'); // Navigate to Home after login
//       })
//       .catch(error => {
//         console.error('Login error:', error);
//         setErrorMessage('Login failed. Please check your credentials.');
//       });
//   }

//   function submitRegistration(e) {
//     e.preventDefault();
//     if (!validateFields()) return;

//     client.post("/register", { email, username, password })
//       .then(function() {
//         client.post("/login", { email, password })
//           .then(function() {
//             localStorage.setItem('currentUser', 'true');
//             setCurrentUser(true);
//             navigate('/'); // Navigate to Home after successful registration
//           });
//       })
//       .catch(error => {
//         console.error('Registration error:', error);
//         setErrorMessage('Registration failed. Please try again.');
//       });
//   }

//   function submitLogout(e) {
//     e.preventDefault();
//     client.post("/logout", { withCredentials: true })
//       .then(function() {
//         localStorage.removeItem('currentUser');
//         setCurrentUser(false);
//         setEmail('');
//         setUsername('');
//         setPassword('');
//         navigate('/login');
//       })
//       .catch(error => {
//         console.error('Logout error:', error);
//       });
//   }

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <Navbar bg="dark" variant="dark" className="sticky-top">
//         <Container>
//           <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latviešu karavīri</a></Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//             <Navbar.Text className="d-flex">
//               {!currentUser && (
//                 <Button variant="outline-dark" className="ms-2 d-inline">
//                   <Link to="/info" className="text-decoration-none text-light">
//                     Par Datubāzi
//                   </Link>
//                 </Button>
//               )}
//               {currentUser && (
//                 <>
//                   <Button variant="outline-dark" className="ms-2 d-inline">
//                     <Link to="/info" className="text-decoration-none text-light">
//                       <FaHome className="icon-button" /> Par Datubāzi
//                     </Link>
//                   </Button>
//                   <Button variant="outline-dark" className="ms-2 d-inline">
//                     <Link to="/home" className="text-decoration-none text-light">
//                       <FaSearch className="icon-button" /> Meklēšana
//                     </Link>
//                   </Button>
//                   <Button variant="outline-dark" className="ms-2 d-inline">
//                     <Link to="/profils" className="text-decoration-none text-light">
//                       <FaUser className="icon-button" /> Profils
//                     </Link>
//                   </Button>
//                 </>
//               )}
//               {currentUser ? (
//                 <form onSubmit={submitLogout} className="ms-2 d-inline">
//                   <Button variant="outline-dark" type="submit" className="text-light">
//                     <FaSignOutAlt /> Atteikties
//                   </Button>
//                 </form>
//               ) : (
//                 <Button
//                   id="form_btn"
//                   onClick={update_form_btn}
//                   variant="outline-dark"
//                   className="text-light"
//                 >
//                   {registrationToggle ? (
//                     <>
//                       <FaSignInAlt className="me-2 icon-button"/> Pieteikties
//                     </>
//                   ) : (
//                     <>
//                       <FaUserPlus className="me-2 icon-button"/> Reģistrēties
//                     </>
//                   )}
//                 </Button>
//               )}
//             </Navbar.Text>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//         <Routes>
//           <Route path="/login" element={
//             <Card className="w-50 p-4 shadow-lg rounded">
//               <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
//               <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
//                 {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//                 <Form.Group className="mb-3 w-100">
//                   <Form.Label>E-pasta adrese</Form.Label>
//                   <Form.Control
//                     type="email"
//                     placeholder="Ievadiet e-pasta adresi"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     className="rounded-pill"
//                   />
//                 </Form.Group>
//                 {registrationToggle && (
//                   <Form.Group className="mb-3 w-100">
//                     <Form.Label>Lietotājvārds</Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Ievadiet lietotājvārdu"
//                       value={username}
//                       onChange={e => setUsername(e.target.value)}
//                       className="rounded-pill"
//                     />
//                   </Form.Group>
//                 )}
//                 <Form.Group className="mb-3 w-100">
//                   <Form.Label>Parole</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Ievadiet paroli"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     className="rounded-pill"
//                   />
//                 </Form.Group>
//                 <Button variant="primary" type="submit" className="w-100 rounded-pill">
//                   {registrationToggle ? 'Reģistrēties' : 'Pieteikties'}
//                 </Button>
//               </Form>
//               <div className="mt-3 text-center">
//                 <Button variant="link" onClick={update_form_btn} className="text-primary">
//                   {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
//                 </Button>
//               </div>
//             </Card>
//           } />

//           <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
//           <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/login" />} />
//           <Route path="/info" element={<Info />} />
//           <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/login" />} />
//           <Route path="*" element={<Navigate to={currentUser ? "/home" : "/login"} />} />
//         </Routes>
//       </Container>

//       <footer className="footer">
//         <p>&copy; 2024 Latviešu Kara muzejs. Visas tiesības aizsargātas.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;



// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Container, Navbar, Button, Form, Card, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
// import Home from './pages/Home'; // Import Home page
// import './App.css';
// import Profils from './pages/Profile';
// import Info from './pages/Info';
// import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Add FaHome and FaSearch here

// axios.defaults.baseURL = 'http://127.0.0.1:8000';
// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// axios.defaults.withCredentials = true;

// const client = axios.create({
//   baseURL: "http://127.0.0.1:8000"
// });

// function App() {
//   const [currentUser, setCurrentUser] = useState(false);
//   const [registrationToggle, setRegistrationToggle] = useState(false);
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Hook to programmatically navigate
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const user = localStorage.getItem('currentUser');
//     setCurrentUser(user === 'true');
//   }, []);

//   function update_form_btn() {
//     setRegistrationToggle(!registrationToggle); // Toggle registration state
//   }
  
//   function validateFields() {
//     if (!email || !password || (registrationToggle && !username)) {
//       setErrorMessage('Visi lauki ir jāaizpilda!'); // "All fields are required!"
//       return false;
//     }
//     setErrorMessage('');
//     return true;
//   }

//   function submitLogin(e) {
//     e.preventDefault();
//     if (!validateFields()) return;

//     client.post("/login", { email, password })
//       .then(function() {
//         localStorage.setItem('currentUser', 'true');
//         setCurrentUser(true);
//         navigate('/'); // Navigate to Home after login
//       })
//       .catch(error => {
//         console.error('Login error:', error);
//       });
//   }
  
//   function submitRegistration(e) {
//     e.preventDefault();
//     if (!validateFields()) return;

//     client.post("/register", { email, username, password })
//       .then(function() {
//         client.post("/login", { email, password })
//           .then(function() {
//             localStorage.setItem('currentUser', 'true');
//             setCurrentUser(true);
//           });
//       });
//   }
  
//   function submitLogout(e) {
//     e.preventDefault();
//     client.post("/logout", { withCredentials: true })
//       .then(function() {
//         localStorage.removeItem('currentUser');
//         setCurrentUser(false);
//         setEmail('');  // Clear the email field
//         setUsername('');
//         setPassword('');  // Clear the password field
//         navigate('/login');  // Navigate to the login page after logout
//       });
//   }

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <Navbar bg="dark" variant="dark" className="sticky-top">
//         <Container>
//           <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latviešu karavīri</a></Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text className="d-flex">


//           <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text className="d-flex">
//             {!currentUser && (
//               <Button variant="outline-dark" className="ms-2 d-inline">
//                 <Link to="/info" className="text-decoration-none text-light">
//                   Par Datubāzi
//                 </Link>
//               </Button>
//             )}
//             {/* Other buttons */}
//           </Navbar.Text>
//         </Navbar.Collapse>
  
           
            
            

// {currentUser && (
//   <Button variant="outline-dark" className="ms-2 d-inline">
//     <Link to="/" className="text-decoration-none text-light">
//       <FaHome className="icon-button" /> Sākums {/* Add home icon */}
//     </Link>
//   </Button>
// )}

// {currentUser && (
//   <Button variant="outline-dark" className="ms-2 d-inline">
//     <Link to="/home" className="text-decoration-none text-light">
//       <FaSearch className="icon-button" /> Meklēšana {/* Add search icon */}
//     </Link>
//   </Button>
// )}

// {currentUser && (
//   <Button variant="outline-dark" className="ms-2 d-inline">
//     <Link to="/profils" className="text-decoration-none text-light">
//       <FaUser className="icon-button" /> Profils {/* Add user icon */}
//     </Link>
//   </Button>
// )}

// {currentUser ? (
//   <form onSubmit={submitLogout} className="ms-2 d-inline">
//     <Button variant="outline-dark" type="submit" className="text-light">
//       <FaSignOutAlt /> Atteikties {/* Add sign-out icon */}
//     </Button>
//   </form>
// ) : (
//   // Other button for the case when the user is not logged in
//   <Button
//     id="form_btn"
//     onClick={update_form_btn}
//     variant="outline-dark"
//     className="text-light"
//   >
//     {registrationToggle ? (
//     <>
//       <FaSignInAlt className="me-2 icon-button" /> Pieteikties
//     </>
//   ) : (
//     <>
//       <FaUserPlus className="me-2 icon-button" /> Reģistrēties
//     </>
//   )}
// </Button>
// )}


// </Navbar.Text>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//       <Routes>
//   {/* Define an explicit route for login/register page */}
//   <Route path="/login" element={
//     <Card className="w-50 p-4 shadow-lg rounded">
//       <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
//       <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
//         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//         <Form.Group className="mb-3 w-100">
//           <Form.Label>E-pasta adrese</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Ievadiet e-pasta adresi"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="rounded-pill"
//           />
//         </Form.Group>

//         {registrationToggle && (
//           <Form.Group className="mb-3 w-100">
//             <Form.Label>Lietotājvārds</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Ievadiet lietotājvārdu"
//               value={username}
//               onChange={e => setUsername(e.target.value)}
//               className="rounded-pill"
//             />
//           </Form.Group>
//         )}

//         <Form.Group className="mb-3 w-100">
//           <Form.Label>Parole</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Ievadiet paroli"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="rounded-pill"
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit" className="w-100 rounded-pill">
//           Pieteikties
//         </Button>
//       </Form>
//       <div className="mt-3 text-center">
//         <Button variant="link" onClick={update_form_btn} className="text-primary">
//           {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
//         </Button>
//       </div>
//     </Card>
//   } />

//   {/* Home route for logged-in users */}
//   <Route path="/" element={
//     currentUser ? (
//       <Card className="w-70 text-center p-4 shadow-lg rounded">
//         {/* Your home content here */}
//       </Card>
//     ) : (
//       <Navigate to="/login" />
//     )
//   } />

//   <Route path="/home" element={<Home />} />
//   <Route path="/info" element={<Info />} />

//   {/* Redirect to Home if user is not logged in */}
//   <Route path="*" element={<Navigate to={currentUser ? "/home" : "/login"} />} />
//   <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/login" />} />
// </Routes>

//       </Container>

//       <footer className="footer">
//         <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;