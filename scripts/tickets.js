document.addEventListener('DOMContentLoaded', () => {
  const tickets = {
    regular: { name: 'Regular Ticket', price: 10000, quantity: 0 },
    vip: { name: 'VIP Ticket', price: 25000, quantity: 0 },
    vvip: { name: 'VVIP Table', price: 150000, quantity: 0 }
  }
  let currentTotal = 0

  // --- Element Selectors ---
  const cartItemsEl = document.getElementById('cart-items')
  const totalPriceEl = document.getElementById('total-price')
  const checkoutBtn = document.getElementById('checkout-btn')
  const successModal = document.getElementById('success-modal')
  const successMessage = document.getElementById('success-message')
  const checkoutModal = document.getElementById('checkout-modal')
  const closeModalBtn = document.getElementById('close-modal-btn')
  const paymentForm = document.getElementById('payment-form')
  const paymentAmountEl = document.getElementById('payment-amount')
  const payBtn = document.getElementById('pay-btn')

  // --- Functions ---
  function showSuccessModal (ticketName) {
    successMessage.textContent = `${ticketName} added to cart!`
    successModal.classList.remove('hidden')
    setTimeout(() => {
      successModal.classList.add('hidden')
    }, 3000)
  }

  function updateCart () {
    cartItemsEl.innerHTML = ''
    let total = 0
    let hasItems = false

    for (const key in tickets) {
      const ticket = tickets[key]
      if (ticket.quantity > 0) {
        hasItems = true
        const itemTotal = ticket.price * ticket.quantity
        total += itemTotal
        const itemEl = document.createElement('div')
        itemEl.className = 'flex justify-between items-center text-sm'
        itemEl.innerHTML = `<p class="font-semibold text-slate-700">${
          ticket.name
        } <span class="text-slate-500 font-normal">x ${
          ticket.quantity
        }</span></p><p class="font-bold text-slate-800">₦${itemTotal.toLocaleString()}</p>`
        cartItemsEl.appendChild(itemEl)
      }
    }

    if (!hasItems) {
      cartItemsEl.innerHTML =
        '<p class="text-slate-400 text-center py-8">Your cart is empty</p>'
    }

    currentTotal = total
    totalPriceEl.textContent = `₦${total.toLocaleString()}`
    checkoutBtn.disabled = !hasItems
  }

  // --- Event Listeners ---
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', () => {
      const ticketType = button.dataset.ticket
      const wasZero = tickets[ticketType].quantity === 0

      if (button.classList.contains('quantity-plus')) {
        tickets[ticketType].quantity++
        if (wasZero) {
          showSuccessModal(tickets[ticketType].name)
        }
      } else if (
        button.classList.contains('quantity-minus') &&
        tickets[ticketType].quantity > 0
      ) {
        tickets[ticketType].quantity--
      }
      document.getElementById(`quantity-${ticketType}`).textContent =
        tickets[ticketType].quantity
      updateCart()
    })
  })

  checkoutBtn.addEventListener('click', () => {
    if (currentTotal > 0) {
      paymentAmountEl.textContent = `₦${currentTotal.toLocaleString()}`
      checkoutModal.classList.remove('hidden')
    }
  })

  closeModalBtn.addEventListener('click', () =>
    checkoutModal.classList.add('hidden')
  )

  // --- Payment Form Submission (UPDATED) ---
  paymentForm.addEventListener('submit', async e => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const amountInKobo = currentTotal * 100

    // Create a detailed cart object to send to the backend
    const cartDetails = Object.entries(tickets)
      .filter(([key, value]) => value.quantity > 0)
      .map(([key, value]) => ({
        type: key, // 'regular', 'vip', or 'vvip'
        name: value.name,
        quantity: value.quantity
      }))

    payBtn.disabled = true
    payBtn.textContent = 'Processing...'

    try {
      // Send payment request to the backend
      const response = await fetch(
        'https://ticket-backend-zyfn.onrender.com/api/pay',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            amount: amountInKobo,
            frontend_origin: window.location.origin, // Sends your frontend URL for the callback
            cart: cartDetails // Send the detailed cart
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed.')
      }

      // Redirect user to the Paystack payment page
      window.location.href = data.data.authorization_url
    } catch (error) {
      alert(`Error: ${error.message}`)
      payBtn.disabled = false
      payBtn.innerHTML = `Pay <span id="payment-amount">₦${currentTotal.toLocaleString()}</span>`
    }
  })

  // Initial call to set up the cart on page load
  updateCart()
})
