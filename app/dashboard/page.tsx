"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { PlantSelector } from "@/components/plant-selector"
import { TurbineMap } from "@/components/turbine-map"
import { useAuth, WindPlant } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function DashboardPage() {
  const { user, plants, logout } = useAuth()
  const [selectedPlant, setSelectedPlant] = useState<WindPlant | null>(null)

  // Not logged in - show login form
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* User Header */}
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
          {selectedPlant ? (
            <TurbineMap 
              plant={selectedPlant} 
              onBack={() => setSelectedPlant(null)} 
            />
          ) : (
            <PlantSelector 
              plants={plants} 
              onSelectPlant={setSelectedPlant} 
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
