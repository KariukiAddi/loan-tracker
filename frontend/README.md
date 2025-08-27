# Loan Tracker System

A comprehensive loan management and repayment tracking system built with Next.js frontend and Laravel backend.

## Features

- **Loan Management**: Create loans with fixed 2% monthly interest rate
- **Payment Tracking**: Record repayments and track payment history
- **Status Monitoring**: Real-time status tracking (On Track/Ahead/Behind)
- **Dashboard**: Comprehensive overview of all loans and their status
- **Redis Caching**: Fast API responses with intelligent cache invalidation
- **Nginx Reverse Proxy**: Production-ready deployment setup

## Architecture

### Frontend (Next.js)
- Modern React-based interface with TypeScript
- Responsive design with Tailwind CSS
- Real-time status updates and progress tracking
- Form validation and error handling

### Backend (Laravel)
- RESTful API with comprehensive endpoints
- MySQL database with proper relationships
- Redis caching for performance optimization
- Input validation and error handling

### Infrastructure
- Nginx reverse proxy with SSL termination
- Docker containerization for easy deployment
- Load balancing and rate limiting
- Security headers and CORS configuration

## API Endpoints

### Loans
- `POST /api/loans` - Create a new loan
- `GET /api/loans` - Get all loans
- `GET /api/loans/{id}` - Get specific loan details
- `GET /api/loans/{id}/status` - Get loan status (cached)

### Repayments
- `POST /api/loans/{id}/repayments` - Record a repayment
- `GET /api/loans/{id}/repayments` - Get loan repayment history

## Installation & Setup

### Using Docker (Recommended)

1. Clone the repository
2. Copy environment files:
   \`\`\`bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   \`\`\`

3. Generate SSL certificates (for production):
   \`\`\`bash
   mkdir ssl
   # Add your SSL certificates to the ssl/ directory
   \`\`\`

4. Start the services:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

5. Run database migrations:
   \`\`\`bash
   docker-compose exec laravel-backend php artisan migrate --seed
   \`\`\`

### Manual Setup

#### Backend (Laravel)
\`\`\`bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
\`\`\`

#### Frontend (Next.js)
\`\`\`bash
npm install
npm run build
npm start
\`\`\`

#### Nginx Configuration
Copy the nginx configuration files to your nginx directory and restart nginx.

## Environment Variables

### Backend (.env)
\`\`\`
APP_ENV=production
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=loan_tracker
DB_USERNAME=your_username
DB_PASSWORD=your_password
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
CACHE_DRIVER=redis
\`\`\`

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=https://api.loan-tracker.local
\`\`\`

## Nginx Configuration

The system includes production-ready Nginx configuration with:

- SSL/TLS termination
- Rate limiting
- CORS headers
- Static file caching
- Load balancing support
- Security headers
- Health checks

## Database Schema

### Loans Table
- `id` - Primary key
- `loan_amount` - Decimal(15,2)
- `interest_rate` - Decimal(5,4) - Fixed at 2.0000
- `repayment_period_months` - Integer
- `created_at`, `updated_at` - Timestamps

### Repayments Table
- `id` - Primary key
- `loan_id` - Foreign key to loans
- `amount` - Decimal(15,2)
- `payment_date` - Date
- `created_at`, `updated_at` - Timestamps

## Loan Calculation Logic

- **Interest Rate**: Fixed at 2% per month
- **Total Amount**: `loan_amount * (1 + interest_rate/100)`
- **Monthly Installment**: `total_amount / repayment_period_months`
- **Status Calculation**:
  - **On Track**: Within 10% of expected payment amount
  - **Ahead**: More than 10% above expected payment amount
  - **Behind**: More than 10% below expected payment amount

## Caching Strategy

- Loan status responses are cached in Redis for 5 minutes
- Cache is automatically invalidated when new repayments are added
- Static assets are cached with long expiration times
- API responses include cache status headers

## Security Features

- CORS configuration for API access
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers
- SSL/TLS encryption
- Secure session handling

## Performance Optimizations

- Redis caching for frequently accessed data
- Nginx static file serving
- Gzip compression
- Database query optimization
- Lazy loading and code splitting
- Image optimization

## Monitoring & Health Checks

- Nginx health check endpoint
- Database connection monitoring
- Redis connectivity checks
- Application error logging
- Performance metrics tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
