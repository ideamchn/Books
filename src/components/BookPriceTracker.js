// src/components/BookPriceTracker.js
import React, { useState } from 'react';
import BookTable from './BookTable';
import SaveButton from './SaveButton';
import TotalDisplay from './TotalDisplay';
import { booksData } from '../data/books';
import { formatCurrency } from '../utils/currency';
import './BookPriceTracker.css';

const BookPriceTracker = () => {
    const [books, setBooks] = useState(
        booksData.map((book, index) => ({
            ...book,
            id: index,
            price: ''
        }))
    );
    const [isSaved, setIsSaved] = useState(false);
    const [showTotal, setShowTotal] = useState(false);
    const [total, setTotal] = useState(0);

    const handlePriceChange = (id, value) => {
        const numValue = parseFloat(value);
        if (value !== '' && (isNaN(numValue) || numValue < 0)) {
            return;
        }

        setBooks(books.map(book =>
            book.id === id ? { ...book, price: value } : book
        ));
    };

    const handleDeleteBook = (id) => {
        // Confirm before deleting
        const bookToDelete = books.find(book => book.id === id);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${bookToDelete.title}"?`
        );

        if (confirmDelete) {
            setBooks(books.filter(book => book.id !== id));

            // If we've already saved, recalculate the total
            if (isSaved) {
                const newBooks = books.filter(book => book.id !== id);
                let newTotal = 0;
                newBooks.forEach(book => {
                    const price = parseFloat(book.price) || 0;
                    newTotal += price;
                });
                newTotal = Math.round(newTotal * 100) / 100;
                setTotal(newTotal);
            }
        }
    };

    const handleSave = () => {
        let calculatedTotal = 0;

        books.forEach(book => {
            const price = parseFloat(book.price) || 0;
            calculatedTotal += price;
        });

        calculatedTotal = Math.round(calculatedTotal * 100) / 100;

        setTotal(calculatedTotal);
        setShowTotal(true);
        setIsSaved(true);
    };

    return (
        <div className="book-price-tracker">
            <div className="container">
                <h1 className="page-title">Book Price Tracker</h1>

                <div className="books-count">
                    Total Books: {books.length}
                </div>

                <BookTable
                    books={books}
                    onPriceChange={handlePriceChange}
                    onDeleteBook={handleDeleteBook}
                    disabled={isSaved}
                />

                <div className="action-section">
                    <SaveButton onClick={handleSave} disabled={isSaved} />
                </div>

                {showTotal && (
                    <TotalDisplay total={total} formatCurrency={formatCurrency} />
                )}

                {isSaved && (
                    <div className="success-message">
                        <div className="status status--success">
                            ✓ Prices saved successfully!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookPriceTracker;