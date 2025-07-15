document.addEventListener('DOMContentLoaded', () => {
    // Dummy book data (could come from a backend API in a real application)
    const books = [
        { id: 'b1', title: 'The Great Adventure', price: 19.99 },
        { id: 'b2', title: 'Mystery of the Old House', price: 24.50 },
        { id: 'b3', title: 'Coding for Beginners', price: 30.00 },
        { id: 'b4', title: 'Science Fiction Anthology', price: 22.00 },
        { id: 'b5', title: 'Historical Fiction Masterpiece', price: 28.75 }
    ];

    // --- Books Page Logic (books.html) ---
    const bookSelect = document.getElementById('book-select');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const messageElement = document.getElementById('message');

    if (bookSelect) {
        // Populate the combo box
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} - $${book.price.toFixed(2)}`;
            bookSelect.appendChild(option);
        });

        addToCartBtn.addEventListener('click', () => {
            const selectedBookId = bookSelect.value;
            const selectedBook = books.find(book => book.id === selectedBookId);

            if (selectedBook) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                // Check if book is already in cart, if so, just update quantity (optional)
                // For simplicity, we'll just add it as a new item for now.
                cart.push(selectedBook);
                localStorage.setItem('cart', JSON.stringify(cart));
                messageElement.textContent = `${selectedBook.title} added to cart!`;
                messageElement.style.color = 'green';
                setTimeout(() => {
                    messageElement.textContent = '';
                }, 2000);
            } else {
                messageElement.textContent = 'Please select a book.';
                messageElement.style.color = 'red';
            }
        });
    }

    // --- Cart Page Logic (cart.html) ---
    const cartItemsList = document.getElementById('cart-items');
    const buyBtn = document.getElementById('buy-btn');
    const orderSummaryDiv = document.getElementById('order-summary');
    const orderedBooksList = document.getElementById('ordered-books');
    const totalPriceSpan = document.getElementById('total-price');

    if (cartItemsList) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const displayCartItems = () => {
            cartItemsList.innerHTML = ''; // Clear previous items
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<li class="empty-cart-message">Your cart is empty.</li>';
                buyBtn.disabled = true; // Disable buy button if cart is empty
            } else {
                buyBtn.disabled = false; // Enable buy button
                cart.forEach((book, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('cart-item');
                    listItem.innerHTML = `
                        <span>${book.title} - $${book.price.toFixed(2)}</span>
                        <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
                    `;
                    cartItemsList.appendChild(listItem);
                });
            }
        };

        displayCartItems();

        // Event listener for removing items from cart
        cartItemsList.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart-btn')) {
                const indexToRemove = parseInt(event.target.dataset.index);
                cart.splice(indexToRemove, 1); // Remove item from array
                localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
                displayCartItems(); // Re-render cart
            }
        });

        buyBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                orderSummaryDiv.style.display = 'block';
                orderedBooksList.innerHTML = '';
                let totalPrice = 0;

                cart.forEach(book => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${book.title} - $${book.price.toFixed(2)}`;
                    orderedBooksList.appendChild(listItem);
                    totalPrice += book.price;
                });

                totalPriceSpan.textContent = `$${totalPrice.toFixed(2)}`;

                // Clear the cart after "buying"
                cart = [];
                localStorage.removeItem('cart');
                displayCartItems(); // Update cart display to show it's empty
            } else {
                alert('Your cart is empty. Please add books before buying.');
            }
        });
    }
});