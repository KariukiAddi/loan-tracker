<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Loan;
use App\Models\Payment;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample loans
        $loan1 = Loan::create([
            'borrower_name' => 'John Doe',
            'amount' => 10000.00,
            'interest_rate' => 2.00,
            'repayment_period' => 12,
            'start_date' => Carbon::now()->subMonths(3),
        ]);

        $loan2 = Loan::create([
            'borrower_name' => 'Jane Smith',
            'amount' => 25000.00,
            'interest_rate' => 2.00,
            'repayment_period' => 24,
            'start_date' => Carbon::now()->subMonths(6),
        ]);

        $loan3 = Loan::create([
            'borrower_name' => 'Bob Johnson',
            'amount' => 5000.00,
            'interest_rate' => 2.00,
            'repayment_period' => 6,
            'start_date' => Carbon::now()->subMonths(1),
        ]);

        // Add sample payments
        Payment::create([
            'loan_id' => $loan1->id,
            'amount' => 943.40,
            'payment_date' => Carbon::now()->subMonths(2),
        ]);

        Payment::create([
            'loan_id' => $loan1->id,
            'amount' => 943.40,
            'payment_date' => Carbon::now()->subMonths(1),
        ]);

        Payment::create([
            'loan_id' => $loan2->id,
            'amount' => 1313.32,
            'payment_date' => Carbon::now()->subMonths(5),
        ]);

        Payment::create([
            'loan_id' => $loan2->id,
            'amount' => 1313.32,
            'payment_date' => Carbon::now()->subMonths(4),
        ]);

        Payment::create([
            'loan_id' => $loan3->id,
            'amount' => 884.86,
            'payment_date' => Carbon::now()->subDays(15),
        ]);
    }
}
