"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%201%20may%202026%2C%2021_33_30-R8RFwkTbRkRxlVtKH1XzGh0s1bExL5.png" 
            alt="CisneIoT Logo" 
            className="h-12 w-auto"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#1a5fb4]">CISNE</span>
            <span className="text-[#3584e4]">IOT</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === "/"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === "/dashboard"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === "/admin"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground"
              )}
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
