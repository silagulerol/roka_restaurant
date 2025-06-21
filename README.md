# Roka Restaurant Reservation & Online Ordering System

A full-stack web application for managing restaurant reservations and online orders, featuring a responsive customer interface, role-based admin panel, AI chatbot integration, and cloud deployment.

🔗 **Live Project Repo**: [Roka Restaurant on GitHub](https://github.com/silagulerol/roka_restaurant)

---

## Features

### Customer Interface
- View dynamic menu with item names, prices, ingredients, and images
- Add items to cart and place online orders
- Submit, update, and view personal reservations
- Chatbot support for menu and reservation help via **StackAI**
- Mobile-friendly EJS-based responsive design

### Admin Panel (Manager Role)
- Secure login via **JWT-based authentication**
- Access all reservations and all orders
- Protected routes and role-based access using custom middleware

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS Templates
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **AI Chatbot**: StackAI iframe embedding
- **DevOps**: Docker, Render deployment
- **Libraries**: Axios, Mongoose, dotenv, bcrypt, rate-limit-mongo

---


---

## Authentication & Roles

- **JWT-based** secure login for both customers and managers
- Token storage and role decoding on protected pages
- **Role-based access** control middleware (`checkRoles`) enforces privileges:
  - Customers: Can only manage their own orders and reservations
  - Managers: Full access to all system data and menu management

---

## AI Chatbot Integration

Embedded AI assistant using **StackAI**, enabling:
- Natural language queries about menu items
- Assistance with reservation times, dates, and dietary questions

```html
<iframe 
  src="https://www.stack-ai.com/public_form/..." 
  width="600" 
  height="400"
  title="Roka Chatbot">
</iframe>


