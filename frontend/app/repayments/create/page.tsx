"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { StatusBadge } from "@/components/ui/status-badge"
import { apiClient, type Loan } from "@/lib/api"
import { formatCurrency, formatDate, calculateLoanSummary } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function CreateRepaymentPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [selectedLoanId, setSelectedLoanId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLoans, setIsLoadingLoans] = useState(true)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const router = useRouter()

  useEffect(() => {
    loadLoans()
    // Set today's date as default
    setPaymentDate(new Date().toISOString().split("T")[0])
  }, [])

  const loadLoans = async () => {
    try {
      const response = await apiClient.getLoans()
      if (response.success && response.data) {
        setLoans(response.data)
      }
    } catch (error) {
      console.error("Error loading loans:", error)
    } finally {
      setIsLoadingLoans(false)
    }
  }

  const selectedLoan = loans.find((loan) => loan.id.toString() === selectedLoanId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLoanId) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await apiClient.createRepayment(Number.parseInt(selectedLoanId), {
        amount: Number.parseFloat(amount),
        payment_date: paymentDate,
      })

      if (response.success) {
        router.push("/dashboard")
      } else if (response.errors) {
        setErrors(response.errors)
      }
    } catch (error) {
      console.error("Error creating repayment:", error)
      setErrors({ general: ["An unexpected error occurred. Please try again."] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Record Payment"
        subtitle="Add a repayment to an existing loan"
        showBackButton={true}
        backHref="/"
      />

      <main className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-black">Payment Details</CardTitle>
            <CardDescription className="text-gray-600">
              Select a loan and enter the payment amount and date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{errors.general[0]}</p>
              </div>
            )}

            {isLoadingLoans ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">Loading loans...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="loanSelect" className="text-black">
                    Select Loan
                  </Label>
                  <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a loan to make payment for" />
                    </SelectTrigger>
                    <SelectContent>
                      {loans.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>
                              Loan #{loan.id} - {formatCurrency(loan.amount)}
                            </span>
                            <StatusBadge status={loan.status} className="ml-2" />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedLoan && (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-semibold text-black mb-3">Loan Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Loan Amount:</p>
                        <p className="font-medium text-black">{formatCurrency(selectedLoan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Installment:</p>
                        <p className="font-medium text-black">
                          {formatCurrency(selectedLoan.monthly_installment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Paid:</p>
                        <p className="font-medium text-black">{formatCurrency(selectedLoan.total_paid)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Remaining Balance:</p>
                        <p className="font-medium text-black">{formatCurrency(
                          calculateLoanSummary(selectedLoan.amount, selectedLoan.interest_rate, selectedLoan.repayment_period).totalAmount - selectedLoan.total_paid
                        )}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status:</p>
                        <StatusBadge status={selectedLoan.status} />
                      </div>
                      <div>
                        <p className="text-gray-600">Created:</p>
                        <p className="font-medium text-black">{formatDate(selectedLoan.created_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="amount" className="text-black">
                    Payment Amount (KES)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    required
                    className="mt-2"
                  />
                  {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount[0]}</p>}
                </div>

                <div>
                  <Label htmlFor="paymentDate" className="text-black">
                    Payment Date
                  </Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="mt-2"
                  />
                  {errors.payment_date && <p className="text-red-600 text-sm mt-1">{errors.payment_date[0]}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                  disabled={isLoading || !selectedLoanId}
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  {isLoading ? "Recording Payment..." : "Record Payment"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
