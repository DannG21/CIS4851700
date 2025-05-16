# Habit Tracker Application

A full-stack web application for tracking daily habits and personal goals.

## Features

- User authentication and authorization
- Habit tracking with customizable frequencies
- Progress tracking and streaks
- Push notifications for reminders
- Secure API with rate limiting
- Progressive Web App (PWA) support

## Tech Stack

### Frontend
- React 18
- Material-UI
- React Router for SPA routing
- Service Workers for PWA
- Push notifications
- Jest for testing

### Backend
- Node.js & Express
- PostgreSQL database
- JWT authentication
- HTTPS support
- Rate limiting
- Unit and integration tests

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
Create `.env` files in both `backend` and `fronted` directories:

Backend `.env`:
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_PUBLIC_VAPID_KEY=your_vapid_key
```

4. Start development servers:
```bash
npm run dev
```

## Testing

Run backend tests:
```bash
cd backend && npm test
```

Run frontend tests:
```bash
cd fronted && npm test
```

## Deployment

The application is set up for automatic deployment using GitHub Actions:

1. Backend deploys to Heroku
2. Frontend deploys to Netlify
3. Database hosted on managed PostgreSQL service

### Required Secrets for Deployment

Add the following secrets to your GitHub repository:

- `HEROKU_API_KEY`
- `HEROKU_APP_NAME`
- `HEROKU_EMAIL`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### SSL Certificate Setup

For HTTPS support in production:

1. Generate SSL certificates:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout backend/config/ssl/key.pem -out backend/config/ssl/cert.pem
```

2. Add the certificates to your hosting provider's SSL configuration.

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Habits Endpoints

- GET `/api/habits` - Get all habits
- POST `/api/habits` - Create new habit
- GET `/api/habits/:id` - Get specific habit
- PUT `/api/habits/:id` - Update habit
- DELETE `/api/habits/:id` - Delete habit

### Records Endpoints

- GET `/api/records` - Get all records
- POST `/api/records` - Create new record
- GET `/api/records/:id` - Get specific record
- PUT `/api/records/:id` - Update record
- DELETE `/api/records/:id` - Delete record

### Streaks Endpoints

- GET `/api/streaks` - Get all streaks
- POST `/api/streaks` - Create new streak
- GET `/api/streaks/:id` - Get specific streak
- PUT `/api/streaks/:id` - Update streak
- DELETE `/api/streaks/:id` - Delete streak

## Security Features

- HTTPS in production
- JWT authentication
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection protection
- XSS protection

## License

MIT 