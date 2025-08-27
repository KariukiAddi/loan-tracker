"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { StatusBadge } from "@/components/ui/status-badge"
import { apiClient, type Loan } from "@/lib/api"
import { formatCurrency, formatDate, calculateLoanSummary } from "@/lib/utils"
import Link from "next/link"
import { Plus, Eye, CreditCard } from "lucide-react"

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      const response = await apiClient.getLoans()
      if (response.success && response.data) {
        setLoans(response.data)
      } else {
        setError("Failed to load loans")
      }
    } catch (error) {
      console.error("Error loading loans:", error)
      setError("An error occurred while loading loans")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateValidLoanAmount = (loan: Loan) => {
    const amount = Number(loan.amount)
    const interestRate = Number(loan.interest_rate)
    const period = Number(loan.repayment_period)
    const totalPaid = Number(loan.total_paid)

    if (isNaN(amount) || isNaN(interestRate) || isNaN(period)) {
      return { amount: 0, totalAmount: 0, paid: 0, remaining: 0 }
    }

    const { totalAmount } = calculateLoanSummary(amount, interestRate, period)
    const remaining = Math.max(0, totalAmount - totalPaid)

    return {
      amount,
      totalAmount: totalAmount || 0,
      paid: totalPaid || 0,
      remaining
    }
  }

  const totals = loans.reduce((sums, loan) => {
    const { amount, totalAmount, paid, remaining } = calculateValidLoanAmount(loan)
    return {
      loaned: sums.loaned + amount,
      withInterest: sums.withInterest + totalAmount,
      paid: sums.paid + paid,
      remaining: sums.remaining + remaining
    }
  }, { loaned: 0, withInterest: 0, paid: 0, remaining: 0 })

  const totalLoaned = totals.loaned
  const totalWithInterest = totals.withInterest
  const totalPaid = totals.paid
  const totalRemaining = totals.remaining

  const statusCounts = loans.reduce(
    (counts, loan) => {
      counts[loan.status] = (counts[loan.status] || 0) + 1
      return counts
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-white">
      <Header title="Loan Dashboard" subtitle="Overview of all your loans and their current status" />

      <main className="max-w-6xl mx-auto py-12 px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Loaned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{formatCurrency(totalLoaned)}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Remaining Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRemaining)}</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{loans.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        {loans.length > 0 && (
          <Card className="border-2 mb-8">
            <CardHeader>
              <CardTitle className="text-black">Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status="On Track" />
                  <span className="text-sm text-gray-600">{statusCounts["On Track"] || 0} loans</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="Ahead" />
                  <span className="text-sm text-gray-600">{statusCounts["Ahead"] || 0} loans</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status="Behind" />
                  <span className="text-sm text-gray-600">{statusCounts["Behind"] || 0} loans</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/loans/create">
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Loan
            </Button>
          </Link>
          <Link href="/repayments/create">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-gray-50 flex items-center gap-2 bg-transparent"
            >
              <CreditCard className="w-4 h-4" />
              Record Payment
            </Button>
          </Link>
        </div>

        {/* Loans List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-black">Your Loans</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">Loading loans...</span>
            </div>
          ) : error ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadLoans} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : loans.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">No loans found. Create your first loan to get started.</p>
                <Link href="/loans/create">
                  <Button className="bg-black text-white hover:bg-gray-800">Create Your First Loan</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {loans.map((loan) => (
                <Card key={loan.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-black">Loan #{loan.id}</CardTitle>
                        <CardDescription className="text-gray-600">
                          Created on {formatDate(loan.created_at)}
                        </CardDescription>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {(() => {
                        const { amount, totalAmount, paid, remaining } = calculateValidLoanAmount(loan)
                        return (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Loan Amount</p>
                              <p className="font-semibold text-black">{formatCurrency(amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="font-semibold text-black">{formatCurrency(totalAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="font-semibold text-green-600">{formatCurrency(paid)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Remaining</p>
                              <p className="font-semibold text-red-600">{formatCurrency(remaining)}</p>
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      {(() => {
                        const { totalAmount, paid } = calculateValidLoanAmount(loan)
                        const progress = totalAmount > 0 ? (paid / totalAmount) * 100 : 0
                        return (
                          <>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Payment Progress</span>
                              <span>{progress.toFixed(1)}% complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, progress)}%`,
                                }}
                              />
                            </div>
                          </>
                        )
                      })()}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/loans/${loan.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/repayments/create?loan=${loan.id}`}>
                        <Button size="sm" className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Make Payment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
