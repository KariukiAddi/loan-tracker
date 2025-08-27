# Loan Management System

A modern loan management system built with **Laravel (PHP)** backend and **Next.js** frontend. Manage loans, track payments, and monitor repayment status with an intuitive interface.

## 🚀 Features

- **Loan Management**: Create and track loans with 2% monthly interest
- **Payment Tracking**: Record and monitor repayment progress  
- **Status Monitoring**: Automatic calculation of repayment status (On Track, Ahead, Behind)
- **Dashboard**: Visual overview with summary statistics
- **RESTful API**: Complete Laravel API with proper validation
- **Responsive UI**: Modern Next.js interface with Tailwind CSS


## 🛠️ Quick Setup
#### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Setup environment
copy .env.example .env
php artisan key:generate

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=loan_tracking
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations and seed data
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```


#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
copy .env.local.example .env.local

# Start development server
npm run dev
```


## 🔧 Configuration

### Database Setup (MySQL)
1. Create database: `loan_tracking`
2. Update `.env` in backend folder:
\`\`\`env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=loan_tracking
DB_USERNAME=root
DB_PASSWORD=your_password
\`\`\`

### API Configuration
Update `frontend/.env.local`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

## 📊 Loan Calculation Logic

The system uses the standard loan formula for monthly installments:

\`\`\`
Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]
\`\`\`

Where:
- **P** = Principal loan amount
- **r** = Monthly interest rate (2% = 0.02)
- **n** = Number of months

### Status Determination:
- **On Track**: Payments within 10% of expected amount
- **Ahead**: Payments exceed expected by >10%  
- **Behind**: Payments fall short by >10%

## 🌐 API Endpoints

### Loans
- `GET /api/loans` - Get all loans with status
- `POST /api/loans` - Create new loan
- `GET /api/loans/{id}` - Get specific loan
- `PUT /api/loans/{id}` - Update loan
- `DELETE /api/loans/{id}` - Delete loan

### Payments  
- `GET /api/loans/{id}/payments` - Get loan payments
- `POST /api/loans/{id}/payments` - Add payment
- `PUT /api/loans/{id}/payments/{paymentId}` - Update payment
- `DELETE /api/loans/{id}/payments/{paymentId}` - Delete payment

### Health Check
- `GET /api/health` - API health status

## 🎯 Usage

1. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Health Check: http://localhost:8000/api/health

2. **Create a loan**:
   - Go to "Create Loan" tab
   - Fill in borrower details
   - System calculates monthly installment automatically

3. **Add payments**:
   - Go to "Add Payment" tab  
   - Select loan and enter payment amount
   - System updates status automatically

4. **Monitor dashboard**:
   - View all loans with color-coded status
   - Track payment progress with visual indicators
   - See summary statistics



## 🚨 Troubleshooting

### Common Issues:

**Database connection error:**
- Ensure MySQL/MariaDB is running
- Check database credentials in `.env`
- Verify database exists

**CORS issues:**
- Ensure CORS middleware is properly configured
- Check API URL in frontend `.env.local`

**Composer/NPM errors:**
- Clear caches: `composer clear-cache`, `npm cache clean --force`
- Delete vendor/node_modules and reinstall

## 📁 Project Structure

```
loan-system/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   │   ├── Loan.php
│   │   │   └── Payment.php
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── create_loans_table.php
│   │   │   └── create_payments_table.php
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── composer.json
│   └── .env.example
├── frontend/               # Next.js App
│   ├── app/
│   │   ├── dashboard/
│   │   ├── loans/
│   │   │   ├── [id]/
│   │   │   └── create/
│   │   └── repayments/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── package.json
│   └── .env.local.example
└── README.md
\`\`\`

**Database connection error:**
- Ensure MySQL/MariaDB is running
- Check database credentials in `.env`
- Verify database exists

**Composer/NPM errors:**
- Clear caches: `composer clear-cache`, `npm cache clean --force`
- Delete vendor/node_modules and reinstall

## 🔐 Security Features

- Input validation on both frontend and backend
- SQL injection prevention via Eloquent ORM
- XSS protection with proper data sanitization
- Environment variable protection

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for overdue payments
- [ ] Advanced reporting and analytics
- [ ] Export functionality (PDF/Excel)


