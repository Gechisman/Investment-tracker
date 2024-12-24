"use client"
import InvestmentTracker from "./components/investment-tracker"
import { ThemeProvider } from "@/components/theme-provider"

export default function InvestmentsPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        <main className="py-8">
          <InvestmentTracker />
        </main>
      </div>
    </ThemeProvider>
  )
}

