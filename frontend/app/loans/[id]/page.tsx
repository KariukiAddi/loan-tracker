"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { StatusBadge } from "@/components/ui/status-badge"
import { apiClient, type Loan, type Repayment } from "@/lib/api"
import { formatCurrency, formatDate, calculateLoanSummary } from "@/lib/utils"
import Link from "next/link"
import { CreditCard, Calendar, DollarSign } from "lucide-react"

interface LoanDetailPageProps {
  params: {
    id: string
  }
}

export default function LoanDetailPage({ params }: LoanDetailPageProps) {
  const [loan, setLoan] = useState<Loan | null>(null)
  const [repayments, setRepayments] = useState<Repayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLoanDetails()
  }, [params.id])

  const loadLoanDetails = async () => {
    try {
      const [loanResponse, repaymentsResponse] = await Promise.all([
        apiClient.getLoan(Number.parseInt(params.id)),
        apiClient.getRepayments(Number.parseInt(params.id)),
      ])

      if (loanResponse.success && loanResponse.data) {
        setLoan(loanResponse.data)
      } else {
        setError("Loan not found")
      }

      if (repaymentsResponse.success && repaymentsResponse.data) {
        setRepayments(repaymentsResponse.data)
      }
    } catch (error) {
      console.error("Error loading loan details:", error)
      setError("An error occurred while loading loan details")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Loading..." showBackButton={true} backHref="/dashboard" />
        <main className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">Loading loan details...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Error" showBackButton={true} backHref="/dashboard" />
        <main className="max-w-4xl mx-auto py-12 px-4">
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <p className="text-red-600 mb-4">{error || "Loan not found"}</p>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const loanSummary = calculateLoanSummary(loan.amount, loan.interest_rate, loan.repayment_period)
  const progressPercentage = (loan.total_paid / loanSummary.totalAmount) * 100

  return (
    <div className="min-h-screen bg-white">
      <Header title={`Loan #${loan.id}`} showBackButton={true} backHref="/dashboard" />

      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Loan Overview */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black">Loan Overview</CardTitle>
                <CardDescription className="text-gray-600">Created on {formatDate(loan.created_at)}</CardDescription>
              </div>
              <StatusBadge status={loan.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Original Amount</p>
                <p className="text-xl font-bold text-black">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="text-xl font-bold text-black">{formatCurrency(loan.monthly_installment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(loan.total_paid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(
                  calculateLoanSummary(loan.amount, loan.interest_rate, loan.repayment_period).totalAmount - loan.total_paid
                )}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Payment Progress</span>
                <span>{progressPercentage.toFixed(1)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Borrower Name:</p>
                <p className="font-medium text-black">{loan.borrower_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate:</p>
                <p className="font-medium text-black">{loan.interest_rate}% per month</p>
              </div>
              <div>
                <p className="text-gray-600">Repayment Period:</p>
                <p className="font-medium text-black">{loan.repayment_period} months</p>
              </div>
              <div>
                <p className="text-gray-600">Total with Interest:</p>
                <p className="font-medium text-black">{formatCurrency(loanSummary.totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href={`/repayments/create?loan=${loan.id}`}>
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Make Payment
            </Button>
          </Link>
        </div>

        {/* Payment History */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-600">
              {repayments.length} payment{repayments.length !== 1 ? "s" : ""} recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {repayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No payments recorded yet.</p>
                <Link href={`/repayments/create?loan=${loan.id}`}>
                  <Button className="bg-black text-white hover:bg-gray-800">Make First Payment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {repayments.map((repayment) => (
                  <div
                    key={repayment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">{formatCurrency(repayment.amount)}</p>
                        <p className="text-sm text-gray-600">Payment #{repayment.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{formatDate(repayment.payment_date)}</p>
                      <p className="text-sm text-gray-600">Recorded on {formatDate(repayment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
