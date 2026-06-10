# LocalHero – Community Service Platform

## Overview

LocalHero is a full-stack web application that connects customers with verified local service professionals such as plumbers, electricians, carpenters, and home maintenance workers. The platform provides secure authentication, service booking, worker verification, booking management, review systems, and administrative analytics.

The project was developed to simplify the process of finding trusted local service providers while offering workers a platform to manage bookings and grow their business.

---

## Features

### Customer Features

* User Registration & Login
* Secure JWT Authentication
* Search Verified Workers
* View Worker Profiles
* Book Services
* Track Booking Status
* Submit Ratings & Reviews
* Manage Personal Profile

### Worker Features

* Worker Registration
* Profile Management
* View Incoming Bookings
* Accept / Reject Bookings
* Complete Services
* View Service History

### Admin Features

* Dashboard Analytics
* User Management
* Worker Verification
* Booking Monitoring
* Revenue Tracking
* Platform Statistics

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Context API
* CSS

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate

### Database

* PostgreSQL

### Development Tools

* Git
* GitHub
* Postman
* VS Code
* IntelliJ IDEA

---

## System Architecture

Customer → React Frontend → Spring Boot REST API → PostgreSQL Database

Worker → React Frontend → Spring Boot REST API → PostgreSQL Database

Admin → React Frontend → Spring Boot REST API → PostgreSQL Database

---

## Database Configuration

Database: PostgreSQL

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/localhero_db
spring.datasource.username=postgres
spring.jpa.hibernate.ddl-auto=update
```

---

## API Security

* JWT-Based Authentication
* Role-Based Authorization
* Protected Endpoints
* Secure Password Encryption
* CORS Configuration

Roles:

* CUSTOMER
* WORKER
* ADMIN

---

## Workflow

### Customer Booking Flow

Customer Registration
→ Login
→ Search Worker
→ Book Service
→ Worker Receives Request
→ Worker Accepts Service
→ Service Completed
→ Customer Reviews Worker

---

## Project Structure

Frontend

```text
localhero/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── App.js
```

Backend

```text
backend/
├── controllers/
├── services/
├── repositories/
├── entities/
├── security/
├── config/
└── LocalHeroApplication.java
```

---

## Installation

### Backend Setup

```bash
git clone <repository-url>

cd backend

mvn clean install

mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

```bash
cd localhero

npm install

npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Testing Results

Successfully Tested:

✔ Customer Registration

✔ Customer Login

✔ Worker Search

✔ Service Booking

✔ Booking Acceptance

✔ Booking Completion

✔ Review Submission

✔ Admin Dashboard Analytics

✔ Role-Based Access Control

✔ Error Handling

✔ PostgreSQL Integration

✔ JWT Authentication

---

## Future Enhancements

* Real-Time Notifications
* Razorpay Payment Integration
* Live Chat System
* AI-Based Worker Recommendation
* Mobile Application
* Deployment on Cloud

---

## Learning Outcomes

This project helped in gaining practical experience with:

* Full Stack Development
* REST API Design
* Authentication & Authorization
* Database Design
* React State Management
* Spring Security
* PostgreSQL Integration
* Git Version Control

---

## Author

Manoj Rajivee

Full Stack Developer

LinkedIn: https://www.linkedin.com/in/manoj-rajivee-31bba13a3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app

GitHub: https://github.com/Manojrajivee

---

## License

This project is developed for educational and learning purposes.
