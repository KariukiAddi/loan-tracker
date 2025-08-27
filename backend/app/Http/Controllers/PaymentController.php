<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function index($loanId): JsonResponse
    {
        try {
            $loan = Loan::findOrFail($loanId);
            $payments = $loan->payments()->orderBy('payment_date', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, $loanId): JsonResponse
    {
        try {
            $loan = Loan::findOrFail($loanId);

            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01|max:999999999.99',
                'payment_date' => 'required|date|before_or_equal:today',
                'notes' => 'nullable|string|max:1000'
            ]);

            $validated['loan_id'] = $loanId;

            // Check if payment amount exceeds remaining balance
            if ($validated['amount'] > $loan->remaining_balance) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment amount exceeds remaining balance',
                    'remaining_balance' => $loan->remaining_balance
                ], 422);
            }

            $payment = Payment::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Payment added successfully',
                'data' => $payment
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
                'message' => 'Failed to add payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($loanId, $paymentId): JsonResponse
    {
        try {
            $payment = Payment::where('loan_id', $loanId)
                ->findOrFail($paymentId);

            return response()->json([
                'success' => true,
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $loanId, $paymentId): JsonResponse
    {
        try {
            $payment = Payment::where('loan_id', $loanId)
                ->findOrFail($paymentId);

            $validated = $request->validate([
                'amount' => 'numeric|min:0.01|max:999999999.99',
                'payment_date' => 'date|before_or_equal:today',
                'notes' => 'nullable|string|max:1000'
            ]);

            $payment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data' => $payment
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
                'message' => 'Failed to update payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($loanId, $paymentId): JsonResponse
    {
        try {
            $payment = Payment::where('loan_id', $loanId)
                ->findOrFail($paymentId);
            
            $payment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
