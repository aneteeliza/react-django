import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Spinner, Alert, Modal, Card } from 'react-bootstrap';
import './styles.css';

function Profils() {
  const [profile, setProfile] = useState({ email: ''});
  const [originalProfile, setOriginalProfile] = useState({ email: ''});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the delete confirmation modal
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState(null); 

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/user')
      .then(response => {
        const fetchedProfile = {
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
        };
        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);
        setLoading(false);
      })
      .catch(error => {
        setError(
          error.response ? error.response.data : 'An error occurred while fetching the data.'
        );
        setLoading(false); 
      });
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      axios
        .put('http://127.0.0.1:8000/user', profile, {
          headers: {
            'X-CSRFToken': csrfToken, 
          },
          withCredentials: true, 
        })
        .then(response => {
          setError(null); 
          setSuccessMessage('Profile updated successfully!');
        })
        .catch(error => {
          setError(
            error.response ? error.response.data : 'An error occurred while saving the data.'
          );
        });
    }
    setEditMode(!editMode); 
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleChangePassword = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    const passwordValidationErrors = [];
    if (!/[A-Z]/.test(newPassword)) {
      passwordValidationErrors.push('The password must contain at least one uppercase letter.');
    }
    if (passwordValidationErrors.length > 0) {
      setPasswordError(passwordValidationErrors.join(' ')); 
      return; 
    }
    setPasswordError(''); 
    setPasswordChangeError(null);

    axios
      .put('http://127.0.0.1:8000/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(response => {
        setSuccessMessage('Password changed successfully!');
        setCurrentPassword(''); 
        setNewPassword(''); 
        setShowPasswordModal(false); 

        return axios.post('http://127.0.0.1:8000/login', {
          email: profile.email,
          password: newPassword,
        }, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        });
      })
      .then(() => {
        console.log('User re-authenticated');
      })
      .catch(error => {
        if (error.response) {
          if (error.response.data.current_password) {
            setPasswordChangeError('Current password is incorrect.');
          } else {
            setPasswordChangeError(error.response.data.detail || 'An error occurred while changing the password.');
          }
        } else {
          setPasswordChangeError('An error occurred while changing the password.');
        }
      });
  };

  const handleDeleteProfile = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  
    axios
      .delete('http://127.0.0.1:8000/user', {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      })
      .then(() => {
        setSuccessMessage('Your profile has been deleted.');
        setProfile({});
        document.cookie = 'csrftoken=; Max-Age=0'; // Clear CSRF token
        document.cookie = 'sessionid=; Max-Age=0'; // Clear session cookie
        localStorage.clear(); // Clear any local storage
        window.location.href = '/login'; // Redirect to login
      })
      .catch(error => {
        setError(
          error.response ? error.response.data : 'An error occurred while deleting the profile.'
        );
      })
      .finally(() => {
        setShowDeleteModal(false);
      });
  };
  
  

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-center align-items-center">
        <Card className="w-50 text-center p-4 shadow-lg rounded">
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
            <Form>
              <Form.Group className="mb-3 w-100">
                <Form.Label>E-pasta adrese</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="E-pasta adrese"
                  value={profile.email}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-100">
                <Form.Label>Vārds</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Vārds"
                  value={profile.first_name}
                  readOnly={!editMode}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-100">
                <Form.Label>Uzvārds</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Uzvārds"
                  value={profile.last_name}
                  readOnly={!editMode}
                  onChange={handleInputChange}
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
              >
                {editMode ? 'Saglabāt izmaiņas' : 'Rediģēt'}
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
              <Form.Label>Pašreizējā parole</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ievadiet pašreizējo paroli"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 w-100">
              <Form.Label>Jaunā parole</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ievadiet jauno paroli"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowPasswordModal(false)}>
            Aizvērt
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Saglabāt jauno paroli
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apstiprināt profila dzēšanu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Vai tiešām vēlaties dzēst savu profilu? Šī darbība ir neatgriezeniska.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowDeleteModal(false)}>
            Atcelt
          </Button>
          <Button variant="danger" onClick={handleDeleteProfile}>
            Dzēst
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profils;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Button, Container, Spinner, Alert, Modal, Card } from 'react-bootstrap';
// import './styles.css';

// function Profils() {
//   const [profile, setProfile] = useState({ email: ''});
//   const [originalProfile, setOriginalProfile] = useState({ email: ''});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);  // General error state for profile fetch
//   const [editMode, setEditMode] = useState(false);
//   const [successMessage, setSuccessMessage] = useState(null);

//   // State for password change
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [passwordError, setPasswordError] = useState(''); // New state for password validation error
//   const [passwordChangeError, setPasswordChangeError] = useState(null); // Separate error state for password change

//   useEffect(() => {
//     // Fetch user profile data when component mounts
//     axios
//       .get('http://127.0.0.1:8000/user')
//       .then(response => {
//         const fetchedProfile = {
//           email: response.data.user.email,
//           first_name: response.data.user.first_name,
//           last_name: response.data.user.last_name,
//         };
//         setProfile(fetchedProfile);
//         setOriginalProfile(fetchedProfile);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(
//           error.response ? error.response.data : 'An error occurred while fetching the data.'
//         );
//         setLoading(false); // Stop loading on error
//       });
//   }, []);

//   const handleEditToggle = () => {
//     if (editMode) {
//       // Fetch CSRF token from the cookies
//       const csrfToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         ?.split('=')[1];

//       // Save changes when exiting edit mode
//       axios
//         .put('http://127.0.0.1:8000/user', profile, {
//           headers: {
//             'X-CSRFToken': csrfToken, // Attach CSRF token for PUT request
//           },
//           withCredentials: true, // Ensure cookies are sent
//         })
//         .then(response => {
//           console.log('Profile updated:', response.data);
//           setError(null); // Clear any previous errors
//           setSuccessMessage('Profile updated successfully!'); // Show success message
//         })
//         .catch(error => {
//           setError(
//             error.response ? error.response.data : 'An error occurred while saving the data.'
//           );
//         });
//     }
//     setEditMode(!editMode); // Toggle edit mode
//   };

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setProfile(prevState => ({ ...prevState, [name]: value }));
//   };

//   // Function to handle password change
//   const handleChangePassword = () => {
//     const csrfToken = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('csrftoken='))
//       ?.split('=')[1];

//     // Validate password requirements
//     const passwordValidationErrors = [];
//     if (!/[A-Z]/.test(newPassword)) {
//       passwordValidationErrors.push('The password must contain at least one uppercase letter.');
//     }
//     if (passwordValidationErrors.length > 0) {
//       setPasswordError(passwordValidationErrors.join(' ')); // Show validation error
//       return; // Do not proceed if validation fails
//     }
//     setPasswordError(''); // Clear any previous validation error
//     setPasswordChangeError(null); // Clear any previous password change errors

//     // Make the PUT request to change the password
//     axios
//       .put('http://127.0.0.1:8000/user/change-password', {
//         current_password: currentPassword,
//         new_password: newPassword,
//       }, {
//         headers: {
//           'X-CSRFToken': csrfToken,
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       })
//       .then(response => {
//         setSuccessMessage('Password changed successfully!');
//         setError(null);
//         setCurrentPassword(''); // Clear the current password field
//         setNewPassword(''); // Clear the new password field
//         setShowPasswordModal(false); // Hide password change modal after success

//         // Re-authenticate after password change
//         return axios.post('http://127.0.0.1:8000/login', {
//           email: profile.email,
//           password: newPassword,
//         }, {
//           headers: {
//             'X-CSRFToken': csrfToken,
//           },
//           withCredentials: true,
//         });
//       })
//       .then(loginResponse => {
//         // Successfully re-authenticated, keep user logged in
//         console.log('User re-authenticated');
//       })
//       .catch(error => {
//         if (error.response) {
//           // Handle specific error for incorrect current password
//           if (error.response.data.current_password) {
//             setPasswordChangeError('Current password is incorrect.');
//           } else {
//             // General error handling
//             setPasswordChangeError(error.response.data.detail || 'An error occurred while changing the password.');
//           }
//         } else {
//           setPasswordChangeError('An error occurred while changing the password.');
//         }
//       });
//   };

//   return (
//     <Container className="p-4">
//       <div className="d-flex justify-content-center align-items-center">
//         <Card className="w-50 text-center p-4 shadow-lg rounded">
//         <h1>Profils</h1>

//         {loading ? (
//           <Spinner animation="border" />
//         ) : error ? (
//           <Alert variant="danger">
//             {typeof error === 'string' ? error : JSON.stringify(error)}
//           </Alert>
//         ) : (
//           <>
//             {successMessage && (
//               <Alert variant="success">
//                 {successMessage}
//               </Alert>
//             )}
//             <Form>
//               <Form.Group className="mb-3 w-100">
//                 <Form.Label>E-pasta adrese</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   placeholder="E-pasta adrese"
//                   value={profile.email}
//                   readOnly={!editMode}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3 w-100">
//                   <Form.Label>Vārds</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="first_name"
//                     placeholder="Vārds"
//                     value={profile.first_name}
//                     readOnly={!editMode}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3 w-100">
//                   <Form.Label>Uzvārds</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="last_name"
//                     placeholder="Uzvārds"
//                     value={profile.last_name}
//                     readOnly={!editMode}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>

//               {/* <Button variant="primary" onClick={handleEditToggle} className="me-2">
//                 {editMode ? 'Saglabāt izmaiņas' : 'Rediģēt'}
//               </Button>
//               <Button variant="link" onClick={() => setShowPasswordModal(true)} className="text-primary">
//                 Nomainīt paroli
//               </Button> */}
//               {editMode && (
//                   <Button
//                     variant="dark"
//                     className="me-2"
//                     onClick={() => {
//                       setEditMode(false);
//                       setProfile(originalProfile); // Reset profile to original values
//                     }}
//                   >
//                     Atcelt
//                   </Button>
//                 )}
//               <Button variant="primary" onClick={handleEditToggle}>
//                   {editMode ? 'Saglabāt izmaiņas' : 'Rediģēt'}
//                 </Button>
                

//                 {/* Show "Nomainīt paroli" only when not in edit mode */}
//                 {!editMode && (
//                   <Button
//                     variant="link"
//                     onClick={() => setShowPasswordModal(true)}
//                     className="text-primary"
//                   >
//                     Nomainīt paroli
//                   </Button>
//                 )}

//             </Form>
            
//           </>
//         )}
//         </Card>
//       </div>

//       {/* Modal for Password Change */}
//       <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Nomainīt paroli</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {passwordChangeError && (
//             <Alert variant="danger">
//               {passwordChangeError}
//             </Alert>
//           )}
//           <Form>
//             <Form.Group className="mb-3 w-100">
//               <Form.Label>Pašreizējā parole</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Ievadiet pašreizējo paroli"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3 w-100">
//               <Form.Label>Jaunā parole</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Ievadiet jauno paroli"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//             </Form.Group>

//             {/* Display password error if it exists */}
//             {passwordError && <Alert variant="danger">{passwordError}</Alert>}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="dark" onClick={() => setShowPasswordModal(false)}>
//             Aizvērt
//           </Button>
//           <Button variant="primary" onClick={handleChangePassword}>
//             Saglabāt jauno paroli
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default Profils;
