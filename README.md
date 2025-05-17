# Platform Mie Mami - Backend

This repository contains the **backend** source code for the Platform Mie Mami project.  
The backend is responsible for business logic, data storage, and providing APIs to the frontend.

---

## Project Overview

Platform Mie Mami backend is built to handle server-side operations including data management, authentication, and API endpoints.  
It supports seamless integration with the frontend and ensures robust, scalable performance.

---

## Technologies Used

- Laravel (PHP) 
- Composer (dependency management)  
- MySQL (database)  
- RESTful API design  
- Middleware for authentication and security  

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ciipii/platform-mie-mami.git
2. Navigate to backend folder:
   ```bash
   cd platform-mie-mami
3. Install dependencies:
   ```bash
   composer install
4. Setup environment variables (create .env file):
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
5. Run the backend server:
   ```bash
   php -S localhost:8000 -t public
