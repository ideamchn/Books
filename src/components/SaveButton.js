import React from 'react';
import './SaveButton.css';

const SaveButton = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="save-button"
        >
            {disabled ? 'Saved' : 'Save'}
        </button>
    );
};

export default SaveButton;