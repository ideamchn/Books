import React from 'react';
import './SaveButton.css';

const SaveButton = ({ onClick, disabled, loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`save-button ${loading ? 'loading' : ''}`}
        >
            {loading ? 'Saving...' : disabled ? 'Saved' : 'Save Prices'}
        </button>
    );
};

export default SaveButton;