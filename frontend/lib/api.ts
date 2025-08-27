const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface Loan {
  id: number
  borrower_name: string
  amount: number
  interest_rate: number
  repayment_period: number
  start_date: string
  monthly_installment: number
  total_paid: number
  remaining_balance: number
  expected_paid: number
  months_elapsed: number
  status: "On Track" | "Ahead" | "Behind"
  payments_count: number
  created_at: string
}

export interface Repayment {
  id: number
  loan_id: number
  amount: number
  payment_date: string
  created_at: string
}

export interface CreateLoanRequest {
  borrower_name: string
  amount: number
  repayment_period: number
  interest_rate: number
}

export interface CreateRepaymentRequest {
  amount: number
  payment_date: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
  message?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()
    return data
  }

  async getLoans(): Promise<ApiResponse<Loan[]>> {
    return this.request<Loan[]>("/loans")
  }

  async createLoan(loan: CreateLoanRequest): Promise<ApiResponse<Loan>> {
    return this.request<Loan>("/loans", {
      method: "POST",
      body: JSON.stringify(loan),
    })
  }

  async getLoan(id: number): Promise<ApiResponse<Loan>> {
    return this.request<Loan>(`/loans/${id}`)
  }

  async getLoanStatus(id: number): Promise<
    ApiResponse<{
      expected_monthly_installment: number
      total_paid: number
      remaining_balance: number
      status: string
    }>
  > {
    return this.request(`/loans/${id}/status`)
  }

  async getRepayments(loanId: number): Promise<ApiResponse<Repayment[]>> {
    return this.request<Repayment[]>(`/loans/${loanId}/payments`)
  }

  async createRepayment(loanId: number, repayment: CreateRepaymentRequest): Promise<ApiResponse<Repayment>> {
    return this.request<Repayment>(`/loans/${loanId}/payments`, {
      method: "POST",
      body: JSON.stringify(repayment),
    })
  }
}

export const apiClient = new ApiClient()
