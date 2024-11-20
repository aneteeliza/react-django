// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
// import './styles.css';

// function Profils() {
//   const [profile, setProfile] = useState({ email: '', username: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     axios
//       .get('http://127.0.0.1:8000/user')
//       .then(response => {
//         setProfile({
//           email: response.data.user.email,
//           username: response.data.user.username,
//         });
//         setLoading(false); // Data is successfully fetched
//       })
//       .catch(error => {
//         setError(
//           error.response
//             ? error.response.data
//             : 'An error occurred while fetching the data.'
//         );
//         setLoading(false); // Stop loading on error
//       });
//   }, []);

//   const handleEditToggle = () => {
//     setEditMode(!editMode);
//   };

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setProfile(prevState => ({ ...prevState, [name]: value }));
//   };

//   return (
//     <Container className="p-4">
//       <h3>Profils</h3>

//       {loading ? (
//         <Spinner animation="border" />
//       ) : error ? (
//         <Alert variant="danger">
//           {typeof error === 'string' ? error : JSON.stringify(error)}
//         </Alert>
//       ) : (
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>E-pasta adrese</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               placeholder="E-pasta adrese"
//               value={profile.email}
//               readOnly={!editMode}
//               onChange={handleInputChange}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Lietotājvārds</Form.Label>
//             <Form.Control
//               type="text"
//               name="username"
//               placeholder="Lietotājvārds"
//               value={profile.username}
//               readOnly={!editMode}
//               onChange={handleInputChange}
//             />
//           </Form.Group>

//           <Button variant="primary" onClick={handleEditToggle}>
//             {editMode ? 'Saglabāt izmaiņas' : 'Rediģēt'}
//           </Button>
//           <Button variant="link">Nomainīt paroli</Button>
//         </Form>
//       )}
//     </Container>
//   );
// }

// export default Profils;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import './styles.css';

function Profils() {
  const [profile, setProfile] = useState({ email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch user profile data when component mounts
    axios
      .get('http://127.0.0.1:8000/user')
      .then(response => {
        setProfile({
          email: response.data.user.email,
          username: response.data.user.username,
        });
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        setError(
          error.response ? error.response.data : 'An error occurred while fetching the data.'
        );
        setLoading(false); // Stop loading on error
      });
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      // Fetch CSRF token from the cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      // Save changes when exiting edit mode
      axios
        .put('http://127.0.0.1:8000/user', profile, {
          headers: {
            'X-CSRFToken': csrfToken, // Attach CSRF token for PUT request
          },
          withCredentials: true, // Ensure cookies are sent
        })
        .then(response => {
          console.log('Profile updated:', response.data);
          setError(null); // Clear any previous errors
          setSuccessMessage('Profile updated successfully!'); // Show success message
        })
        .catch(error => {
          setError(
            error.response ? error.response.data : 'An error occurred while saving the data.'
          );
        });
    }
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProfile(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <Container className="p-4">
      <h3>Profils</h3>

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
            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
              <Form.Label>Lietotājvārds</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Lietotājvārds"
                value={profile.username}
                readOnly={!editMode}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleEditToggle}>
              {editMode ? 'Saglabāt izmaiņas' : 'Rediģēt'}
            </Button>
            <Button variant="link">Nomainīt paroli</Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default Profils;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Button, Container } from 'react-bootstrap';
// import './styles.css';

// function Profils() {
//   const [profile, setProfile] = useState({ email: '', username: '' });

//   useEffect(() => {
//     axios.get('http://127.0.0.1:8000/user')
//     .then(response => {
//         // Update the profile state with the user data
//         setProfile({
//             email: response.data.user.email,
//             username: response.data.user.username
//         });
//     })
//     .catch(error => {
//         if (error.response) {
//             console.error('Error:', error.response.data);
//         } else {
//             console.error('Error message:', error.message);
//         }
//     });

//   }, []);  // Empty dependency array to only run once when component mounts

//   return (
//     <Container className="p-4">
//       <h3>Profils</h3>
//       <Form>
//         <Form.Group className="mb-3">
//           <Form.Label>E-pasta adrese</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="E-pasta adrese"
//             value={profile.email}
//             readOnly
//           />
//         </Form.Group>
        
//         <Form.Group className="mb-3">
//           <Form.Label>Lietotājvārds</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Lietotājvārds"
//             value={profile.username}
//             readOnly
//           />
//         </Form.Group>

//         <Button variant="primary">Saglabāt izmaiņas</Button>
//         <Button variant="link">Nomainīt paroli</Button>

//         {/* Add other fields or update functionality as needed */}
//       </Form>
//     </Container>
//   );
// }

// export default Profils;
