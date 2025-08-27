import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header title="Loan Tracker System" subtitle="Manage your loans and track repayments efficiently" />

      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-black">Create New Loan</CardTitle>
              <CardDescription className="text-gray-600">
                Set up a new loan with 2% monthly interest rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/loans/create">
                <Button className="w-full bg-black text-white hover:bg-gray-800">Create Loan</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-black">Record Payment</CardTitle>
              <CardDescription className="text-gray-600">Add a repayment to an existing loan</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/repayments/create">
                <Button className="w-full bg-black text-white hover:bg-gray-800">Add Payment</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-black">Loan Dashboard</CardTitle>
              <CardDescription className="text-gray-600">View all loans and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full bg-black text-white hover:bg-gray-800">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-black mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-black mb-3">Loan Creation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Enter loan amount and repayment period</li>
                <li>• Fixed 2% monthly interest rate applied</li>
                <li>• System calculates expected monthly installments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black mb-3">Payment Tracking</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Record payments with amount and date</li>
                <li>• Real-time status tracking (On Track/Ahead/Behind)</li>
                <li>• View remaining balance and payment history</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
