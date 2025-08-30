# khana_khajana

Schemas:
Admin Schema
Student User Schema
Mess User Schema
Daily Menu Schema
Student Transaction Schema
Khana Khajana - Project Overview
Khana Khajana is a comprehensive mess management system built with a modern full-stack architecture. The project consists of a Node.js backend API and a React frontend application.

🏗️ Architecture
Backend (Node.js/Express)
Framework: Express.js with ES6 modules
Database: MongoDB with Mongoose ODM
Port: 3001
Key Features:
RESTful API architecture
Session management with express-session
CORS enabled for frontend communication
QR code generation capabilities
UUID for unique identifiers
Frontend (React/Vite)
Framework: React 19 with Vite build tool
Styling: Material-UI, Bootstrap, Tailwind CSS, Framer Motion
Routing: React Router DOM
Port: 3000 (development)
Key Features:
Modern UI with multiple design systems
QR code display functionality
Responsive design
👥 User Roles & Features

1. Student Users
   Student registration and authentication
   Meal plan management
   Profile management
   Transaction history
   Menu viewing
   Dashboard with meal details
2. Mess Users (Staff/Management)
   Mess management dashboard
   Menu management (CRUD operations)
   Price settings configuration
   Student details viewing
   Transaction history monitoring
   User management capabilities
3. Admin Users
   Administrative dashboard
   Contact submission management
   System-wide oversight
   📊 Data Models (Schemas)
   StudentUser: Student information and credentials
   MessUser: Mess staff/management data
   Admin: Administrative user data
   DailyMenu: Daily meal offerings
   StudentTransaction: Financial transactions
   Price: Pricing configurations
   Contact: Contact form submissions
   🔧 Key Technologies
   Backend Dependencies:
   Express.js, Mongoose, MongoDB
   CORS, dotenv, express-session
   QRCode generation, UUID, Validator
   Frontend Dependencies:
   React 19, React Router DOM
   Material-UI ecosystem (@mui/material, @mui/icons-material)
   Tailwind CSS, Bootstrap
   Framer Motion for animations
   Axios for API calls
   QRCode.react for QR functionality
   📁 Project Structure
   khana_khajana/
   ├── Backend/
   │ ├── controllers/ # Business logic
   │ ├── routes/ # API endpoints
   │ ├── schemas/ # Database models
   │ └── server/ # Database connection
   └── Frontend/
   ├── src/
   │ ├── components/ # Reusable components
   │ ├── pages/ # Page components
   │ └── assets/ # Static resources
   └── public/ # Public assets
   🚀 Development Setup
   Backend: npm start (uses nodemon for hot reload)
   Frontend: npm run dev (Vite development server)
   Database: MongoDB connection via Mongoose
   This appears to be a college/university mess management system that handles student meal planning, payment processing, menu management, and administrative oversight through a modern web application interface.
