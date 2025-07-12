// src/components/DeleteButton.js
import React from 'react';
import './DeleteButton.css';

const DeleteButton = ({ onClick, title }) => {
    return (
        <button
            className="delete-button"
            onClick={onClick}
            title={title}
            aria-label={title}
        >
            <svg
                className="delete-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <span className="delete-text">Delete</span>
        </button>
    );
};

export default DeleteButton;