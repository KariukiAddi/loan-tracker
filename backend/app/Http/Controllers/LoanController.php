<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class LoanController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $loans = Loan::with('payments')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($loan) {
                    return [
                        'id' => $loan->id,
                        'borrower_name' => $loan->borrower_name,
                        'amount' => $loan->amount,
                        'interest_rate' => $loan->interest_rate,
                        'repayment_period' => $loan->repayment_period,
                        'start_date' => $loan->start_date,
                        'created_at' => $loan->created_at,
                        'monthly_installment' => $loan->calculateMonthlyInstallment(),
                        'total_paid' => $loan->total_paid,
                        'remaining_balance' => $loan->remaining_balance,
                        'expected_paid' => $loan->expected_paid,
                        'months_elapsed' => $loan->months_elapsed,
                        'status' => $loan->status,
                        'payments_count' => $loan->payments->count()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $loans
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch loans',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'borrower_name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0.01|max:999999999.99',
                'interest_rate' => 'numeric|min:0|max:100',
                'repayment_period' => 'required|integer|min:1|max:600',
                'start_date' => 'date|after_or_equal:today'
            ]);

            $validated['interest_rate'] = $validated['interest_rate'] ?? 2.00;
            $validated['start_date'] = $validated['start_date'] ?? now();

            $loan = Loan::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Loan created successfully',
                'data' => $loan
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create loan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $loan = Loan::with(['payments' => function($query) {
                $query->orderBy('payment_date', 'desc');
            }])->findOrFail($id);

            $loanData = [
                'id' => $loan->id,
                'borrower_name' => $loan->borrower_name,
                'amount' => $loan->amount,
                'interest_rate' => $loan->interest_rate,
                'repayment_period' => $loan->repayment_period,
                'start_date' => $loan->start_date,
                'created_at' => $loan->created_at,
                'monthly_installment' => $loan->calculateMonthlyInstallment(),
                'total_paid' => $loan->total_paid,
                'remaining_balance' => $loan->remaining_balance,
                'expected_paid' => $loan->expected_paid,
                'months_elapsed' => $loan->months_elapsed,
                'status' => $loan->status,
                'payments' => $loan->payments
            ];

            return response()->json([
                'success' => true,
                'data' => $loanData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Loan not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $loan = Loan::findOrFail($id);

            $validated = $request->validate([
                'borrower_name' => 'string|max:255',
                'amount' => 'numeric|min:0.01|max:999999999.99',
                'interest_rate' => 'numeric|min:0|max:100',
                'repayment_period' => 'integer|min:1|max:600',
                'start_date' => 'date'
            ]);

            $loan->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Loan updated successfully',
                'data' => $loan
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update loan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $loan = Loan::findOrFail($id);
            $loan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Loan deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete loan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
