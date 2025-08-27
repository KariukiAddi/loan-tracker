"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiClient } from "@/lib/api"
import { formatCurrency, calculateLoanSummary } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function CreateLoanPage() {
  const [borrowerName, setBorrowerName] = useState("")
  const [loanAmount, setLoanAmount] = useState("")
  const [repaymentPeriod, setRepaymentPeriod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await apiClient.createLoan({
        amount: Number.parseFloat(loanAmount),
        repayment_period: Number.parseInt(repaymentPeriod),
        borrower_name: borrowerName,
        interest_rate: 2.0 // 2% monthly interest rate
      })

      if (response.success && response.data) {
        // Redirect to dashboard after successful creation
        router.push("/dashboard")
      } else if (response.errors) {
        setErrors(response.errors)
      }
    } catch (error) {
      console.error("Error creating loan:", error)
      setErrors({ general: ["An unexpected error occurred. Please try again."] })
    } finally {
      setIsLoading(false)
    }
  }

  const loanSummary =
    loanAmount && repaymentPeriod
      ? calculateLoanSummary(Number.parseFloat(loanAmount), 2, Number.parseInt(repaymentPeriod))
      : null

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="Create New Loan"
        subtitle="Enter the loan amount and repayment period. Interest rate is fixed at 2% per month."
        showBackButton={true}
        backHref="/"
      />

      <main className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-black">Loan Details</CardTitle>
            <CardDescription className="text-gray-600">
              Complete the form below to create your loan with our fixed 2% monthly interest rate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{errors.general[0]}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="borrowerName" className="text-black">
                  Borrower Name
                </Label>
                <Input
                  id="borrowerName"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Enter borrower's full name"
                  required
                  className="mt-2"
                />
                {errors.borrower_name && <p className="text-red-600 text-sm mt-1">{errors.borrower_name[0]}</p>}
              </div>

              <div>
                <Label htmlFor="loanAmount" className="text-black">
                  Loan Amount (KES)
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  required
                  className="mt-2"
                />
                {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount[0]}</p>}
              </div>

              <div>
                <Label htmlFor="repaymentPeriod" className="text-black">
                  Repayment Period (Months)
                </Label>
                <Input
                  id="repaymentPeriod"
                  type="number"
                  min="1"
                  max="360"
                  value={repaymentPeriod}
                  onChange={(e) => setRepaymentPeriod(e.target.value)}
                  placeholder="Enter repayment period in months"
                  required
                  className="mt-2"
                />
                {errors.repayment_period && (
                  <p className="text-red-600 text-sm mt-1">{errors.repayment_period[0]}</p>
                )}
              </div>

              {loanSummary && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-black mb-3">Loan Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Loan Amount:</p>
                      <p className="font-medium text-black">{formatCurrency(Number.parseFloat(loanAmount))}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interest Rate:</p>
                      <p className="font-medium text-black">2% per month</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Repayment Period:</p>
                      <p className="font-medium text-black">{repaymentPeriod} months</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Interest:</p>
                      <p className="font-medium text-black">{formatCurrency(loanSummary.totalInterest)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t">
                      <p className="text-gray-600">Monthly Installment:</p>
                      <p className="font-bold text-black text-lg">{formatCurrency(loanSummary.monthlyInstallment)}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isLoading ? "Creating Loan..." : "Create Loan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
