import React from 'react';
import './TotalDisplay.css';

const TotalDisplay = ({ total, formatCurrency }) => {
    return (
        <div className="total-display">
            <strong className="total-text">
                Total: {formatCurrency(total)}
            </strong>
        </div>
    );
};

export default TotalDisplay;