import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
import Home from './pages/Home'; // Import Home page
import './App.css';
import Profils from './pages/Profile';
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Add FaHome and FaSearch here

axios.defaults.baseURL = 'http://127.0.0.1:8000';
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
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setCurrentUser(user === 'true');
  }, []);

  function update_form_btn() {
    setRegistrationToggle(!registrationToggle); // Toggle registration state
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
        setUsername('');
        setPassword('');  // Clear the password field
        navigate('/');  // Navigate to the login page after logout
      });
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" className="sticky-top">
        <Container>
          <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latvijas Kara muzejs</a></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="d-flex">
            

{currentUser && (
  <Button variant="outline-dark" className="ms-2 d-inline">
    <Link to="/" className="text-decoration-none text-light">
      <FaHome className="icon-button" /> Sākums {/* Add home icon */}
    </Link>
  </Button>
)}

{currentUser && (
  <Button variant="outline-dark" className="ms-2 d-inline">
    <Link to="/home" className="text-decoration-none text-light">
      <FaSearch className="icon-button" /> Meklēšana {/* Add search icon */}
    </Link>
  </Button>
)}

{currentUser && (
  <Button variant="outline-dark" className="ms-2 d-inline">
    <Link to="/profils" className="text-decoration-none text-light">
      <FaUser className="icon-button" /> Profils {/* Add user icon */}
    </Link>
  </Button>
)}

{currentUser ? (
  <form onSubmit={submitLogout} className="ms-2 d-inline">
    <Button variant="outline-dark" type="submit" className="text-light">
      <FaSignOutAlt /> Atteikties {/* Add sign-out icon */}
    </Button>
  </form>
) : (
  // Other button for the case when the user is not logged in
  <Button
    id="form_btn"
    onClick={update_form_btn}
    variant="outline-dark"
    className="text-light"
  >
    {registrationToggle ? (
    <>
      <FaSignInAlt className="me-2 icon-button" /> Pieteikties
    </>
  ) : (
    <>
      <FaUserPlus className="me-2 icon-button" /> Reģistrēties
    </>
  )}
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
              <Card className="w-70 text-center p-4 shadow-lg rounded">
                <h3 className="mb-4">Publiskā datubāze "Latviešu karavīri"</h3>
                {/* About the Database Section */}
                <section className="mb-4 text-start">
                  <h4>Par datubāzi</h4>
                  <p className="text-muted">
                    Datubāze "Latviešu karavīri" piedāvā iespēju piekļūt informācijai par latviešu karavīriem. Šeit var atrast informāciju par karavīru vēsturi, viņu dalību dažādos militārajos notikumos, un daudz ko citu. Datubāze ir izveidota, lai atvieglotu piekļuvi šiem vēsturiskajiem datiem, un ir piemērota gan pētniekiem, gan interesentiem.
                  </p>
                </section>
                <hr />
                {/* FAQ Section */}
                <section className="mb-4 text-start">
                  <h4>BUJ (Biežāk Uzdotie Jautājumi)</h4>
                  <ul className="list-unstyled text-muted">
                    <li className="mb-2">
                      <strong>Kā reģistrēties?</strong><br />
                      Lai reģistrētos, nospiediet pogu "Reģistrēties" un aizpildiet nepieciešamo informāciju.
                    </li>
                    <li className="mb-2">
                      <strong>Kā veikt meklēšanu?</strong><br />
                      Pēc pieteikšanās izmantojiet meklēšanas iespēju, lai atrastu informāciju par karavīriem.
                    </li>
                    <li>
                      <strong>Ko darīt, ja aizmirstu paroli?</strong><br />
                      Ja aizmirstat paroli, lūdzu, sazinieties ar mums, izmantojot norādīto e-pasta adresi.
                    </li>
                  </ul>
                </section>
                <hr />

                {/* Contact Section */}
                <section>
                  <h4 className="text-start">Kontakti</h4>
                  <p className="text-muted text-start">
                    Atbildīgā institūcija: <a href="https://www.karamuzejs.lv/" className="text-decoration-none">Latvijas Kara muzejs</a>
                  </p>
                  <p className="text-muted text-start">
                    E-pasts saziņai: <a href="mailto:datubaze@karamuzejs.lv" className="text-decoration-none">datubaze@karamuzejs.lv</a>
                  </p>
                  <p className="text-muted text-start">
                    Atbildes uz e-pastiem tiek sniegtas darba dienās, darba laikā. Jautājumiem par datu bāzes saturu atbildēs Vēstures departaments, savukārt par tehniskām problēmām, ja nepieciešams, varēs palīdzēt IT Atbalsta komanda.
                  </p>
                </section>
              </Card>
            ) : (
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
                    Pieteikties
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <Button variant="link" onClick={update_form_btn} className="text-primary">
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

// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Container, Navbar, Button, Form, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
// import Home from './pages/Home'; // Import Home page
// import './App.css';
// import Profils from './pages/Profile';
// import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons'; // Import React Bootstrap icons
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

//   useEffect(() => {
//     const user = localStorage.getItem('currentUser');
//     setCurrentUser(user === 'true');
//   }, []);

//   function update_form_btn() {
//     setRegistrationToggle(!registrationToggle); // Toggle registration state
//   }
  
//   function submitLogin(e) {
//     e.preventDefault();
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
//         setPassword('');  // Clear the password field
//         navigate('/');  // Navigate to the login page after logout
//       });
//   }

//   return (
//     <div className="app-content d-flex flex-column bg-light">
//       <Navbar bg="dark" variant="dark">
//         <Container>
//           <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latvijas Kara muzejs</a></Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text className="d-flex">

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
//         <Routes>
//         <Route path="/" element={
//   currentUser ? (
//     <Card className="w-75 text-center p-4 shadow-lg rounded">
//       <h3 className="mb-4">Publiskā datubāze "Latviešu karavīri"</h3>
      
//       {/* About the Database Section */}
//       <section className="mb-4">
//         <h4 className="mb-3">Par datubāzi</h4>
//         <p className="text-muted">
//           Datubāze "Latviešu karavīri" piedāvā iespēju piekļūt informācijai par latviešu karavīriem. Šeit var atrast informāciju par karavīru vēsturi, viņu dalību dažādos militārajos notikumos, un daudz ko citu. Datubāze ir izveidota, lai atvieglotu piekļuvi šiem vēsturiskajiem datiem, un ir piemērota gan pētniekiem, gan interesentiem.
//         </p>
//       </section>

//       {/* FAQ Section */}
//       <section className="mb-4">
//         <h4 className="mb-3">BUJ (Biežāk Uzdotie Jautājumi)</h4>
//         <ul className="list-unstyled text-muted">
//           <li className="mb-2">
//             <strong>Kā reģistrēties?</strong><br />
//             Lai reģistrētos, nospiediet pogu "Reģistrēties" un aizpildiet nepieciešamo informāciju.
//           </li>
//           <li className="mb-2">
//             <strong>Kā veikt meklēšanu?</strong><br />
//             Pēc pieteikšanās izmantojiet meklēšanas iespēju, lai atrastu informāciju par karavīriem.
//           </li>
//           <li>
//             <strong>Ko darīt, ja aizmirstu paroli?</strong><br />
//             Ja aizmirstat paroli, lūdzu, sazinieties ar mums, izmantojot norādīto e-pasta adresi.
//           </li>
//         </ul>
//       </section>

//       {/* Contact Section */}
//       <section>
//         <h4 className="mb-3">Kontakti</h4>
//         <p className="text-muted">
//           Atbildīgā institūcija: <a href="https://www.karamuzejs.lv/" className="text-decoration-none">Latvijas Kara muzejs</a>
//         </p>
//         <p className="text-muted">
//           E-pasts saziņai: <a href="mailto:datubaze@karamuzejs.lv" className="text-decoration-none">datubaze@karamuzejs.lv</a>
//         </p>
//         <p className="text-muted">
//           Atbildes uz e-pastiem tiek sniegtas darba dienās, darba laikā. Jautājumiem par datu bāzes saturu atbildēs Vēstures departaments, savukārt par tehniskām problēmām, ja nepieciešams, varēs palīdzēt IT Atbalsta komanda.
//         </p>
//       </section>
//     </Card>
//   ) : (
//     // Login/Register Form as before
//     <Card className="w-50 p-4 shadow-lg rounded">
//       <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
//       <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
//         {/* Form Fields as before */}
//       </Form>
//       <div className="mt-3 text-center">
//         <Button variant="link" onClick={update_form_btn} className="text-success">
//           {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
//         </Button>
//       </div>
//     </Card>
//   )
// } />          
//           <Route path="/home" element={<Home />} />

//           {/* Redirect to Home if user is not logged in */}
//           <Route path="*" element={<Navigate to={currentUser ? "/home" : "/"} />} />
//           <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/" />} />
          
//         </Routes>
//       </Container>

//       <footer className="footer mt-auto">
//         <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;


// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Container, Navbar, Button, Form, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
// import Home from './pages/Home'; // Import Home page
// import './App.css';
// import Profils from './pages/Profile';

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

//   // useEffect(() => {
//   //   const user = localStorage.getItem('currentUser');
//   //   if (user) {
//   //     setCurrentUser(true);
//   //   } else {
//   //     setCurrentUser(false);
//   //   }
//   // }, []);

//   useEffect(() => {
//     const user = localStorage.getItem('currentUser');
//     setCurrentUser(user === 'true');
//   }, []);
  

//   function update_form_btn() {
//     setRegistrationToggle(!registrationToggle); // Toggle registration state
//   }
  
//   // function submitLogin(e) {
//   //   e.preventDefault();
//   //   client.post("/login", { email, password })
//   //     .then(function() {
//   //       localStorage.setItem('currentUser', 'true');
//   //       setCurrentUser(true);
//   //     });
//   // }

//   function submitLogin(e) {
//     e.preventDefault();
//     client.post("/login", { email, password })
//       .then(function() {
//         localStorage.setItem('currentUser', 'true');
//         setCurrentUser(true);
//         navigate('/home'); // Navigate to Home after login
//       })
//       .catch(error => {
//         console.error('Login error:', error);
//       });
//   }
  
  
//   function submitRegistration(e) {
//     e.preventDefault();
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
//         setPassword('');  // Clear the password field
//         navigate('/');  // Navigate to the login page after logout
//       });
//   }
  

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <Navbar bg="dark" variant="dark">
//         <Container>
//           <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latvijas Kara muzejs</a></Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text className="d-flex">

//   {currentUser && (
//     <Button variant="outline-light" className="ms-2 d-inline">
//       <Link to="/" className="text-decoration-none text-light">Sākums</Link>
//     </Button>
//   )}

//   {currentUser && (
//     <Button variant="outline-light" className="ms-2 d-inline">
//       <Link to="/home" className="text-decoration-none text-light">Meklēšana</Link>
//     </Button>
//   )}

// {currentUser && (
//   <Button variant="outline-light" className="ms-2 d-inline">
//     <Link to="/profils" className="text-decoration-none text-light">Profils</Link>
//   </Button>
// )}

// {currentUser ? (
//     <form onSubmit={submitLogout} className="ms-2 d-inline">
//       <Button variant="outline-light" type="submit">Atteikties</Button>
//     </form>
//   ) : (
//     <Button
//       id="form_btn"
//       onClick={update_form_btn}
//       variant="outline-light"
//       className="d-inline"
//     >
//       {registrationToggle ? 'Pieteikties' : "Reģistrēties"}
//     </Button>
//   )}
// </Navbar.Text>

//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
//         <Routes>
//           <Route path="/" element={
//             currentUser ? (
//               <Card className="w-50 text-center p-4 shadow-lg rounded">
//                 <h3>Publiskā datubāze "Latviešu karavīri"</h3>
//                 <p className="text-muted"><a href="https://www.karamuzejs.lv/" className='muzejs'>Latvijas Kara muzejs</a></p>
//               </Card>
//             ) : (
//               <Card className="w-50 p-4 shadow-lg rounded">
//                 <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
//                 <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
//                   <Form.Group className="mb-3 w-100">
//                     <Form.Label>E-pasta adrese</Form.Label>
//                     <Form.Control
//                       type="email"
//                       placeholder="Ievadiet e-pasta adresi"
//                       value={email}
//                       onChange={e => setEmail(e.target.value)}
//                       className="rounded-pill"
//                     />
//                   </Form.Group>

//                   {registrationToggle && (
//                     <Form.Group className="mb-3 w-100">
//                       <Form.Label>Lietotājvārds</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Ievadiet lietotājvārdu"
//                         value={username}
//                         onChange={e => setUsername(e.target.value)}
//                         className="rounded-pill"
//                       />
//                     </Form.Group>
//                   )}

//                   <Form.Group className="mb-3 w-100">
//                     <Form.Label>Parole</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Ievadiet paroli"
//                       value={password}
//                       onChange={e => setPassword(e.target.value)}
//                       className="rounded-pill"
//                     />
//                   </Form.Group>

//                   <Button variant="success" type="submit" className="w-100 rounded-pill">
//                     Pieteikties
//                   </Button>
//                 </Form>
//                 {/* <div className="mt-2 text-center"><Button variant="link" className="text-success">Aizmirsi paroli?</Button></div> */}
//                 <div className="mt-3 text-center">
//                   <Button variant="link" onClick={update_form_btn} className="text-success">
//                     {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
//                   </Button>
//                 </div>
//               </Card>
//             )
//           } />
          
//           <Route path="/home" element={<Home />} />

//           {/* Redirect to Home if user is not logged in */}
//           <Route path="*" element={<Navigate to={currentUser ? "/home" : "/"} />} />
//           <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/" />} />
          
//         </Routes>
//       </Container>

//       <footer className="footer">
//         <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;








// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { Container, Navbar, Button, Form, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom'; // Import routing components
// import Home from './pages/Home'; // Import Home page
// import './App.css';
// import Profils from './pages/Profile';
// import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons'; // Import React Bootstrap icons
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

//   useEffect(() => {
//     const user = localStorage.getItem('currentUser');
//     setCurrentUser(user === 'true');
//   }, []);

//   function update_form_btn() {
//     setRegistrationToggle(!registrationToggle); // Toggle registration state
//   }
  
//   function submitLogin(e) {
//     e.preventDefault();
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
//         setPassword('');  // Clear the password field
//         navigate('/');  // Navigate to the login page after logout
//       });
//   }

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <Navbar bg="dark" variant="dark">
//         <Container>
//           <Navbar.Brand><a href="https://www.karamuzejs.lv/" className='NavText'>Latvijas Kara muzejs</a></Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//           <Navbar.Text className="d-flex">

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
//         <Routes>
//           <Route path="/" element={
//             currentUser ? (
//               <Card className="w-50 text-center p-4 shadow-lg rounded">
//                 <h3>Publiskā datubāze "Latviešu karavīri"</h3>
//                 <p className="text-muted"><a href="https://www.karamuzejs.lv/" className='muzejs'>Latvijas Kara muzejs</a></p>
//               </Card>
//             ) : (
//               <Card className="w-50 p-4 shadow-lg rounded">
//                 <h4 className="text-center mb-4">{registrationToggle ? 'Reģistrēties' : 'Pieteikties'}</h4>
//                 <Form onSubmit={registrationToggle ? submitRegistration : submitLogin}>
//                   <Form.Group className="mb-3 w-100">
//                     <Form.Label>E-pasta adrese</Form.Label>
//                     <Form.Control
//                       type="email"
//                       placeholder="Ievadiet e-pasta adresi"
//                       value={email}
//                       onChange={e => setEmail(e.target.value)}
//                       className="rounded-pill"
//                     />
//                   </Form.Group>

//                   {registrationToggle && (
//                     <Form.Group className="mb-3 w-100">
//                       <Form.Label>Lietotājvārds</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Ievadiet lietotājvārdu"
//                         value={username}
//                         onChange={e => setUsername(e.target.value)}
//                         className="rounded-pill"
//                       />
//                     </Form.Group>
//                   )}

//                   <Form.Group className="mb-3 w-100">
//                     <Form.Label>Parole</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Ievadiet paroli"
//                       value={password}
//                       onChange={e => setPassword(e.target.value)}
//                       className="rounded-pill"
//                     />
//                   </Form.Group>

//                   <Button variant="success" type="submit" className="w-100 rounded-pill">
//                     Pieteikties
//                   </Button>
//                 </Form>
//                 <div className="mt-3 text-center">
//                   <Button variant="link" onClick={update_form_btn} className="text-success">
//                     {registrationToggle ? 'Jau ir lietotāja konts? Pieteikties' : "Nav lietotāja konts? Reģistrēties"}
//                   </Button>
//                 </div>
//               </Card>
//             )
//           } />
          
//           <Route path="/home" element={<Home />} />

//           {/* Redirect to Home if user is not logged in */}
//           <Route path="*" element={<Navigate to={currentUser ? "/home" : "/"} />} />
//           <Route path="/profils" element={currentUser ? <Profils /> : <Navigate to="/" />} />
          
//         </Routes>
//       </Container>

//       <footer className="footer">
//         <p>&copy; 2024 Larvijas Kara muzejs. Visas tiesības aizsargātas.</p>
//       </footer>
//     </div>
//   );
// }

// export default App;