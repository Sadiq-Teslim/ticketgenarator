// scripts/tickets.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Key for storing the cart in the browser's local storage ---
    const CART_STORAGE_KEY = 'ulesDinnerCart';

    // --- Initial State (will be overwritten by local storage if it exists) ---
    let tickets = {
        regular: { name: 'Regular Ticket', price: 10000, quantity: 0 },
        vip: { name: 'VIP Ticket', price: 25000, quantity: 0 },
        vvip: { name: 'VVIP Table', price: 150000, quantity: 0 }
    };
    let currentTotal = 0;

    // --- Element Selectors ---
    const cartItemsEl = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const successModal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const paymentForm = document.getElementById('payment-form');
    const paymentAmountEl = document.getElementById('payment-amount');
    const payBtn = document.getElementById('pay-btn');

    // --- NEW: Functions for Local Storage ---
    function saveCartToLocalStorage() {
        // Converts the JavaScript 'tickets' object into a JSON string for storage
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tickets));
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            // If saved data exists, parse it from a JSON string back into an object
            tickets = JSON.parse(savedCart);
        }
    }

    // --- Core Functions ---
    function showSuccessModal(ticketName) {
        successMessage.textContent = `${ticketName} added to cart!`;
        successModal.classList.remove('hidden');
        setTimeout(() => {
            successModal.classList.add('hidden');
        }, 3000);
    }

    function updateCart() {
        cartItemsEl.innerHTML = '';
        let total = 0;
        let hasItems = false;

        for (const key in tickets) {
            // Update the quantity display on the page (e.g., the '0' between '+' and '-')
            document.getElementById(`quantity-${key}`).textContent = tickets[key].quantity;

            if (tickets[key].quantity > 0) {
                hasItems = true;
                const itemTotal = tickets[key].price * tickets[key].quantity;
                total += itemTotal;
                const itemEl = document.createElement('div');
                itemEl.className = 'flex justify-between items-center text-sm';
                itemEl.innerHTML = `<p class="font-semibold text-slate-700">${tickets[key].name} <span class="text-slate-500 font-normal">x ${tickets[key].quantity}</span></p><p class="font-bold text-slate-800">₦${itemTotal.toLocaleString()}</p>`;
                cartItemsEl.appendChild(itemEl);
            }
        }

        if (!hasItems) {
            cartItemsEl.innerHTML = '<p class="text-slate-400 text-center py-8">Your cart is empty</p>';
        }

        currentTotal = total;
        totalPriceEl.textContent = `₦${total.toLocaleString()}`;
        checkoutBtn.disabled = !hasItems;
    }

    // --- Event Listeners ---
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const ticketType = button.dataset.ticket;
            const wasZero = tickets[ticketType].quantity === 0;

            if (button.classList.contains('quantity-plus')) {
                tickets[ticketType].quantity++;
                if (wasZero) {
                    showSuccessModal(tickets[ticketType].name);
                }
            } else if (button.classList.contains('quantity-minus') && tickets[ticketType].quantity > 0) {
                tickets[ticketType].quantity--;
            }

            // After any change, update the UI and save the new state to local storage
            updateCart();
            saveCartToLocalStorage();
        });
    });

    checkoutBtn.addEventListener('click', () => {
        if (currentTotal > 0) {
            paymentAmountEl.textContent = `₦${currentTotal.toLocaleString()}`;
            checkoutModal.classList.remove('hidden');
        }
    });

    closeModalBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));

    paymentForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const amountInKobo = currentTotal * 100;
        const cartDetails = Object.entries(tickets)
            .filter(([key, value]) => value.quantity > 0)
            .map(([key, value]) => ({
                type: key,
                // 'regular, 'vip' or 'vvip'
                name: value.name,
                quantity: value.quantity
            }));
        if (cartDetails.length === 0) {
            alert("Your cart is empty")
        }

        payBtn.disabled = true;
        payBtn.textContent = 'Processing...';

        try {
            const response = await fetch('https://ticket-backend-zyfn.onrender.com/api/pay', { // Your backend URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, amount: amountInKobo, cart: cartDetails })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Payment initialization failed.');

            // Clear cart from local storage after successful payment initialization
            localStorage.removeItem(CART_STORAGE_KEY);
            window.location.href = data.data.authorization_url;

        } catch (error) {
            alert(`Error: ${error.message}`);
            payBtn.disabled = false;
            payBtn.innerHTML = `Pay <span id="payment-amount">₦${currentTotal.toLocaleString()}</span>`;
        }
    });

    // --- Initial Page Load ---
    // 1. Load any saved cart data from local storage first.
    loadCartFromLocalStorage();
    // 2. Then, render the cart UI based on what was loaded.
    updateCart();
});