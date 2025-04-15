// MainButton.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Assuming you're using react-icons for the icons

const MainButton = ({ t, title, onClick }) => {
    return (
        <Button id="form_btn" onClick={onClick} variant="outline-dark" className="text-light">
            {title}<FaSignInAlt className="me-2 icon-button" />
        </Button>
    );
};

export default MainButton;
