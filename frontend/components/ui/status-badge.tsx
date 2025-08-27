import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "On Track" | "Ahead" | "Behind"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800 border-green-200"
      case "Ahead":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Behind":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        getStatusStyles(status),
        className,
      )}
    >
      {status}
    </span>
  )
}
