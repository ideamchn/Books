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

    // Helper function to encode data for form submission
    const encode = (data) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    const handleSave = async () => {
        setIsSubmitting(true);

        let calculatedTotal = 0;
        const priceData = [];

        // Calculate total and gather book data
        books.forEach(book => {
            const price = parseFloat(book.price) || 0;
            calculatedTotal += price;
            if (price > 0) {
                priceData.push({
                    title: book.title,
                    author: book.author,
                    price: price.toFixed(2)
                });
            }
        });

        calculatedTotal = Math.round(calculatedTotal * 100) / 100;

        // Prepare submission data
        const submissionData = {
            "form-name": "book-prices",
            "submission-date": new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            "total": calculatedTotal.toFixed(2),
            "total-formatted": formatCurrency(calculatedTotal),
            "book-count": priceData.length.toString(),
            "books-data": JSON.stringify(priceData, null, 2)
        };

        console.log('Submitting data:', submissionData); // Debug log

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode(submissionData)
            });

            if (response.ok) {
                setTotal(calculatedTotal);
                setShowTotal(true);
                setIsSaved(true);
                setIsSubmitting(false);

                // Show success message with total
                alert(`✅ Prices saved successfully!\n\nTotal: ${formatCurrency(calculatedTotal)}\nBooks with prices: ${priceData.length}\n\nYou can view all submissions in your Netlify dashboard under Forms.`);
            } else {
                throw new Error(`Submission failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            alert('❌ Failed to save prices. Please try again.\n\nIf this persists, check if the form is registered in Netlify.');
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
        </div>
    );
};

export default BookPriceTracker;