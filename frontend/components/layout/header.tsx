import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
}

export function Header({ title, subtitle, showBackButton = false, backHref = "/" }: HeaderProps) {
  return (
    <header className="bg-yellow-400 text-black py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="text-black hover:bg-yellow-300">
                ← Back
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold text-balance">{title}</h1>
            {subtitle && <p className="text-lg mt-2">{subtitle}</p>}
          </div>
        </div>
      </div>
    </header>
  )
}
