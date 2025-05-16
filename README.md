First of all, I had problems with my Git and this repository so it was a disaster trying to commit my final project and I had to restore the project. For that reason it was commited this way.

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
