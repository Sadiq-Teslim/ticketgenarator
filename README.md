# ULES Annual Dinner & Awards Night - Ticket Portal

This is the official web portal for purchasing tickets to the University of Lagos Engineering Society (ULES) Annual Dinner & Awards Night. The application features a stunning landing page with event details and a seamless, multi-step ticketing process with a secure payment integration via Paystack.

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Elegant Landing Page (`index.html`):** A visually appealing introduction to the event with details on date, venue, and dress code.
- **Interactive Ticket Selection (`pages/tickets.html`):** Users can choose from multiple ticket tiers (Regular, VIP, VVIP) and easily adjust quantities.
- **Real-time Order Summary:** A "cart" that dynamically updates the subtotal and total price as users select tickets.
- **Secure Payment Flow:** Integration with Paystack for secure, off-site payment processing.
- **User-friendly Checkout:** A simple modal form to collect user details (name and email) before redirecting to payment.
- **Responsive Design:** A clean and functional layout that works seamlessly on desktop, tablet, and mobile devices.
- **Modern "Glassmorphism" UI:** A beautiful user interface with blurred, semi-transparent elements and fluid background animations.

## Live Demo

> [Live Demo](https://ules-dinner.vercel.app)

## Technology Stack

### Frontend

- **HTML5:** For the structure and content of the web pages.
- **Tailwind CSS:** A utility-first CSS framework for rapid and responsive UI development.
- **Vanilla JavaScript:** For all client-side interactivity, including cart logic, modal handling, and communication with the backend.

### Backend

- **Node.js:** A JavaScript runtime for building the server-side application.
- **Express.js:** A minimal and flexible Node.js web application framework.
- **Paystack API:** Used for initializing payment transactions.
- **`node-fetch`:** To make HTTP requests from the backend to the Paystack API.
- **`cors`:** To enable Cross-Origin Resource Sharing, allowing the frontend and backend to communicate.
- **`dotenv`:** To manage environment variables securely.

## Project Structure

```
.
├── payments/
│   ├── node_modules/
│   ├── .env            # Securely stores API keys (DO NOT COMMIT)
│   ├── package.json
│   ├── package-lock.json
│   └── server.js       # The Express server logic
│
├── index.html          # The main event landing page
├──pages/
    ├── tickets.html        # The ticket selection and checkout page
    ├── success.html        # Page shown after a successful payment
└── README.md           # You are here!
```

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Paystack](https://paystack.com/) account to get your API keys.

### Frontend Setup

The frontend consists of static HTML files and requires no special build steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ules-ticketing-portal.git
    ```
2.  **Open the HTML files:**
    You can open `index.html` directly in your browser. For the best experience, especially with API calls, use a local server extension like **Live Server** in VS Code.

### Backend Setup

The backend server is required to handle the secure payment logic.

1.  **Navigate to the backend directory:**

    ```bash
    cd payment
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a file named `.env` in the `backend` directory.

    ```bash
    touch .env
    ```

4.  **Add your Paystack Secret Key:**
    Open the `.env` file and add your **Test Secret Key** from your Paystack dashboard.

    ```env
    # .env
    PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

    > **Security Warning:** Never commit the `.env` file to version control. The `.gitignore` file should include `.env`.

5.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server will start, typically on port 3000. You should see the message: `Server is running on port 3000`.

## Configuration

- **Callback URL:** In `payment/server.js`, you can change the `callback_url` to your desired success page URL. This is where Paystack will redirect the user after a successful payment.
- **API Endpoint:** The frontend JavaScript in `pages/tickets.html` assumes the backend is running on `http://localhost:3000`. If you deploy your backend elsewhere, update the `fetch` URL accordingly.

## How It Works

1.  A user selects their desired tickets on the `pages/tickets.html` page.
2.  Upon clicking "Proceed to Checkout," a modal appears asking for their name and email.
3.  The frontend sends the cart total and user details to the `/api/pay` endpoint on the backend server.
4.  The backend server receives the request and securely uses its Paystack Secret Key to initialize a transaction with the Paystack API.
5.  Paystack responds with a unique `authorization_url`.
6.  The backend sends this URL back to the frontend.
7.  The frontend's JavaScript redirects the user's browser to the Paystack payment page to complete the purchase securely.

## Contributing

Contributions are welcome! If you'd like to improve the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
