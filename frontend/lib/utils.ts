import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString))
}

export function calculateLoanSummary(loanAmount: number, interestRate: number, repaymentPeriodMonths: number) {
  const monthlyInterestRate = interestRate / 100
  const totalInterest = loanAmount * monthlyInterestRate * repaymentPeriodMonths
  const totalAmount = loanAmount + totalInterest
  const monthlyInstallment = totalAmount / repaymentPeriodMonths

  return {
    totalAmount,
    monthlyInstallment,
    totalInterest,
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "On Track":
      return "text-green-600"
    case "Ahead":
      return "text-blue-600"
    case "Behind":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}
