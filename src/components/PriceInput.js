import React from 'react';
import './PriceInput.css';

const PriceInput = ({ value, onChange, disabled }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <input
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            placeholder="0.00"
            className="price-input"
        />
    );
};

export default PriceInput;