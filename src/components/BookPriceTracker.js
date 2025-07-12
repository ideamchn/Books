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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const bookToDelete = books.find(book => book.id === id);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${bookToDelete.title}"?`
        );

        if (confirmDelete) {
            setBooks(books.filter(book => book.id !== id));

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

    const handleSave = async () => {
        setIsSubmitting(true);

    let calculatedTotal = 0;
    const priceData = [];

    books.forEach(book => {
        const price = parseFloat(book.price) || 0;
        calculatedTotal += price;
        if (price > 0) {
            priceData.push({
                title: book.title,
                author: book.author,
                price: price
            });
        }
    });

    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // Create URL-encoded form data for Netlify
    const encode = (data) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    // Submit to Netlify Forms
    try {
        const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({
                "form-name": "book-prices",
                "submission-date": new Date().toISOString(),
                "total": calculatedTotal.toString(),
                "book-count": priceData.length.toString(),
                "books-data": JSON.stringify(priceData)
            })
        });

        if (response.ok) {
            setTotal(calculatedTotal);
            setShowTotal(true);
            setIsSaved(true);
            setIsSubmitting(false);

            // Show success message
            alert('Prices saved successfully! You can view submissions in your Netlify dashboard.');
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
        alert('Failed to save prices. Please try again.');
    }
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
                    <SaveButton
                        onClick={handleSave}
                        disabled={isSaved || isSubmitting}
                        loading={isSubmitting}
                    />
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

            {/* Hidden form for Netlify Forms detection */}
            <form name="book-prices" data-netlify="true" hidden>
                <input type="hidden" name="form-name" value="book-prices" />
                <input type="hidden" name="submission-date" />
                <input type="hidden" name="total" />
                <input type="hidden" name="book-count" />
                <textarea name="books-data"></textarea>
            </form>
        </div>
    );
};

export default BookPriceTracker;