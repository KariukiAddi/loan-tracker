<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'borrower_name',
        'amount',
        'interest_rate',
        'repayment_period',
        'start_date'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'interest_rate' => 'decimal:2',
        'start_date' => 'date'
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function calculateMonthlyInstallment()
    {
        $principal = $this->amount;
        $monthlyRate = $this->interest_rate / 100;
        $months = $this->repayment_period;

        if ($monthlyRate == 0) {
            return $principal / $months;
        }

        $installment = ($principal * $monthlyRate * pow(1 + $monthlyRate, $months)) / 
                      (pow(1 + $monthlyRate, $months) - 1);

        return round($installment, 2);
    }

    public function getTotalPaidAttribute()
    {
        return $this->payments->sum('amount');
    }

    public function getRemainingBalanceAttribute()
    {
        return max(0, $this->amount - $this->total_paid);
    }

    public function getMonthsElapsedAttribute()
    {
        $startDate = $this->start_date ?? $this->created_at;
        return max(0, $startDate->diffInMonths(now()));
    }

    public function getExpectedPaidAttribute()
    {
        $monthlyInstallment = $this->calculateMonthlyInstallment();
        return min($this->months_elapsed * $monthlyInstallment, $this->amount);
    }

    public function getStatusAttribute()
    {
        $totalPaid = $this->total_paid;
        $expectedPaid = $this->expected_paid;
        $monthlyInstallment = $this->calculateMonthlyInstallment();
        $tolerance = $monthlyInstallment * 0.1;

        if ($totalPaid > $expectedPaid + $tolerance) {
            return 'Ahead';
        } elseif ($totalPaid < $expectedPaid - $tolerance) {
            return 'Behind';
        } else {
            return 'On Track';
        }
    }
}
