document.addEventListener('DOMContentLoaded', () => {
  const tickets = {
    regular: { name: 'Regular Ticket', price: 10000, quantity: 0 },
    vip: { name: 'VIP Ticket', price: 25000, quantity: 0 },
    vvip: { name: 'VVIP Table', price: 150000, quantity: 0 }
  }
  let currentTotal = 0

  const cartItemsEl = document.getElementById('cart-items')
  const totalPriceEl = document.getElementById('total-price')
  const checkoutBtn = document.getElementById('checkout-btn')

  // Modal elements
  const checkoutModal = document.getElementById('checkout-modal')
  const closeModalBtn = document.getElementById('close-modal-btn')
  const paymentForm = document.getElementById('payment-form')
  const paymentAmountEl = document.getElementById('payment-amount')
  const payBtn = document.getElementById('pay-btn')

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
    currentTotal = total
    totalPriceEl.textContent = `₦${total.toLocaleString()}`
    checkoutBtn.disabled = !hasItems
  }

  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', () => {
      const ticketType = button.dataset.ticket
      if (button.classList.contains('quantity-plus')) {
        tickets[ticketType].quantity++
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

  // Modal logic
  checkoutBtn.addEventListener('click', () => {
    if (currentTotal > 0) {
      paymentAmountEl.textContent = `₦${currentTotal.toLocaleString()}`
      checkoutModal.classList.remove('hidden')
    }
  })

  closeModalBtn.addEventListener('click', () =>
    checkoutModal.classList.add('hidden')
  )

  // Payment form submission
  paymentForm.addEventListener('submit', async e => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    // Paystack requires amount in the lowest currency unit (Kobo)
    const amountInKobo = currentTotal * 100

    payBtn.disabled = true
    payBtn.textContent = 'Processing...'

    try {
      // Send data to YOUR backend, not Paystack directly
      const response = await fetch('http://localhost:3000/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, amount: amountInKobo })
      })

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

  updateCart() // Initial cart render
})
