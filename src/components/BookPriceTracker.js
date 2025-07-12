// Updated handleSave function in BookPriceTracker.js
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