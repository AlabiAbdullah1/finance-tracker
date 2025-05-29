# Finance Tracker Application

A full-stack finance tracking application built with TypeScript, React, Node.js, and MongoDB.

## Features

- 🔒 **User Authentication**

  - JWT-based authentication
  - Sending Verfication token to verify user's mail authenticity
  - Register and login functionality
  - Protected routes

- 💰 **Transaction Management**

  - Add income and expenses
  - Categorize transactions
  - Filter and sort transactions
  - Pagination support
  - Date range filtering

- 💰 **Budget Management**
   - Create a budget and the budgetItems based on the saved category and category types
   - Update and Delete budget


- 📊 **Categories**

  - Create custom categories
  - Separate income and expense categories
  - Edit and delete categories

- 📈 **Dashboard**
  - Summary of income and expenses
  - Balance calculation
  - Transaction history

## Tech Stack

### Backend

- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Input validation with Joi
- Error handling middleware
- Request logging with Morgan

### Frontend

- React 18
- TypeScript
- React Query for state management
- React Router v6
- Axios for API calls
- Modern CSS with variables
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB

## Environment Variables

### Backend (.env)

```
MONGO_URI
JWT_SECRET
PORT
EMAIL_USER
EMAIL_PASS
CLIENT_URL

```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- GET `/api/auth/verify/:token` - Verify user's mail


### Categories

- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create new category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category

### Transactions

- GET `/api/transactions` - Get transactions (with filtering and pagination)
- POST `/api/transactions` - Create new transaction
- DELETE `/api/transactions/:id` - Delete transaction
- GET `/api/transactions/stats` - Get transaction statistics


### Budgets
- GET `/api/budget` - Get budget alongside the budgetItems of the budget
- POST `/api/budget/create` - create a budget and the budgetItems for it
- PUT `/api/budget/:id` - update budget
- GET `/api/budget/:id` - Delete budget



## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Write clean, modular code
- Add appropriate error handling
- Include type definitions

### Git Workflow

1. Create feature branch
2. Make changes
3. Test changes
4. Create pull request
5. Code review
6. Merge to main branch

## Production Deployment

1. Update environment variables for production
2. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

3. Build and deploy Docker containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Testing

### Backend Tests

```bash
cd backend
npm run test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
