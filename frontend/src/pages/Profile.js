import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './styles.css';

function Profils() {
  const [profile, setProfile] = useState({ email: '', username: '' });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/user')
    .then(response => {
        // Update the profile state with the user data
        setProfile({
            email: response.data.user.email,
            username: response.data.user.username
        });
    })
    .catch(error => {
        if (error.response) {
            console.error('Error:', error.response.data);
        } else {
            console.error('Error message:', error.message);
        }
    });

  }, []);  // Empty dependency array to only run once when component mounts

  return (
    <Container className="p-4">
      <h3>Profils</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>E-pasta adrese</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-pasta adrese"
            value={profile.email}
            readOnly
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Lietotājvārds</Form.Label>
          <Form.Control
            type="text"
            placeholder="Lietotājvārds"
            value={profile.username}
            readOnly
          />
        </Form.Group>

        <Button variant="primary">Saglabāt izmaiņas</Button>
        <Button variant="link">Nomainīt paroli</Button>

        {/* Add other fields or update functionality as needed */}
      </Form>
    </Container>
  );
}

export default Profils;
