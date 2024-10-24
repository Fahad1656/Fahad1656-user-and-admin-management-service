# user-and-admin-management-service
# User and Admin Management Service

## Features

### User Features
1. **Login and Registration**: Users can easily register for an account and log in to access the system.
2. **User Chat**: Users can chat with each other in real-time using WebSocket technology.
3. **Join Streams**: Users can join live streaming sessions using Agora Streaming Service, available exclusively for registered users.

### Admin Features
1. **Admin Login and Registration**: Admins can log in and register to manage the platform.
2. **Job Allocation**: Admins can allocate jobs to other admins and set their salaries.
3. **User Management**: 
   - **Delete Users**: Admins have the ability to delete user accounts.
   - **Update User Information**: Admins can update user details and information as necessary.

## Tech Stack
- **Frontend**: Built with Vite framework for a fast and optimized user experience.
- **Backend**: Developed using NestJS for a scalable and maintainable server-side application.

## Getting Started
1. **Clone the Repository**:  
   ```bash
   git clone <repository-url>
   cd user-and-admin-management-service
   ```

2. **Install Dependencies**:  
   For the frontend:
   ```bash
   cd client
   npm install
   ```
   For the backend:
   ```bash
   cd server
   npm install
   ```

3. **Run the Application**:
   - Start the backend:
     ```bash
     npm run start:dev
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

4. **Access the Application**:  
   - Frontend is usually accessible at `http://localhost:3000` (or the port specified in the Vite config).
   - Backend is typically accessible at `http://localhost:3001` (or the port specified in the NestJS config).

## License
This project is licensed under the MIT License.

## Acknowledgments
- Agora Streaming Service for real-time streaming capabilities.
- WebSocket for enabling real-time chat functionality.
