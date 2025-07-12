// src/components/BookTable.js
import React from 'react';
import PriceInput from './PriceInput';
import DeleteButton from './DeleteButton';
import './BookTable.css';

const BookTable = ({ books, onPriceChange, onDeleteBook, disabled }) => {
    // Check if we're on mobile
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="table-container">
            <table className="books-table">
                <thead>
                <tr>
                    <th>Book Title</th>
                    <th className="author-column">Author(s)</th>
                    <th className="price-column">Price (₹)</th>
                    <th className="action-column">Action</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book, index) => (
                    <tr key={book.id} className={index % 2 === 1 ? 'even-row' : ''}>
                        <td>
                            <div className="book-title">{book.title}</div>
                            {isMobile && (
                                <div className="book-author">{book.author}</div>
                            )}
                        </td>
                        {!isMobile && (
                            <td className="author-column">
                                <div className="book-author">{book.author}</div>
                            </td>
                        )}
                        <td className="price-cell">
                            <PriceInput
                                value={book.price}
                                onChange={(value) => onPriceChange(book.id, value)}
                                disabled={disabled}
                            />
                        </td>
                        <td className="action-cell">
                            <DeleteButton
                                onClick={() => onDeleteBook(book.id)}
                                title={`Delete ${book.title}`}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;