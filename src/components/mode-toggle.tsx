"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // برای جلوگیری از خطای Hydration (چک کردن لود شدن در کلاینت)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-sage-200 dark:border-stone-700 hover:bg-sage-50 dark:hover:bg-stone-800 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-orange-400" />
      ) : (
        <Moon className="h-5 w-5 text-sage-600" />
      )}
    </button>
  )
}