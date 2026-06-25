# Shopsphere

Shopsphere is a modern full-stack e-commerce application featuring a Spring Boot REST API backend and a responsive React frontend.

---

## Key Features

*   **User Authentication**: JWT-based login, registration, and role-based access control (Customer and Admin roles).
*   **Product Catalog**: Browse products in a responsive grid layout. Filter by category, search by product name/description, and sort by price.
*   **Product Details & Reviews**: View detailed product specifications, stock status, average star ratings, and read customer reviews. Customers can submit ratings (1-5 stars) and comments.
*   **Cart & Checkout**: Add items, modify quantities, and complete order placement using a clean, two-step checkout form to collect shipping and contact details.
*   **Admin Dashboard**: Admins can manage catalog inventory (Create, Read, Update, Delete products) and monitor all user orders with interactive status updates (Placed, Processing, Shipped, Delivered, Cancelled).
*   **API Documentation**: Interactive Swagger/OpenAPI docs for developers.

---

## Technology Stack

*   **Backend**: Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT (JSON Web Tokens), Lombok, MySQL.
*   **Frontend**: React 19, Vite, Axios, React Router, React Hot Toast, Vanilla CSS.

---

## Local Setup

### 1. Database Setup
Ensure you have a MySQL server running and create a database named `shopsphere`:
```sql
CREATE DATABASE shopsphere;
```

### 2. Backend Config & Launch
Set the database environment variables and run the Spring Boot application:
```bash
cd backend
# Set environment variables (on Windows Command Prompt)
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/shopsphere
set SPRING_DATASOURCE_USERNAME=root
set SPRING_DATASOURCE_PASSWORD=yourpassword

# Run the app
mvn spring-boot:run
```
The backend API will run at `http://localhost:8080`. You can access the interactive Swagger API documentation at `http://localhost:8080/swagger-ui/index.html`.

### 3. Frontend Launch
Install dependencies and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## Deployment (Single-Unit Build)

For cost-effective and simple cloud deployments (e.g. Render, Railway, or fly.io), Shopsphere is configured to compile the React frontend assets directly into the Spring Boot backend jar so they serve from a single port.

1.  Open PowerShell in the project root.
2.  Run the build script:
    ```powershell
    .\build-and-package.ps1
    ```
3.  The unified runnable JAR will be compiled at `backend/target/shopsphere-0.0.1-SNAPSHOT.jar`.
4.  Deploy this single JAR to your host, injecting cloud database credentials via environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
