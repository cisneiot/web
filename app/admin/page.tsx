"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { AdminPanel } from "@/components/admin-panel"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const { user, logout } = useAuth()

  // No autenticado
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <LoginForm />
        </main>
        <Footer />
      </div>
    )
  }

  // Autenticado pero sin permisos de admin
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Acceso restringido</h2>
              <p className="text-muted-foreground">
                Solo los administradores pueden acceder al panel de gestión.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.company}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <AdminPanel />
        </div>
      </main>

      <Footer />
    </div>
  )
}
