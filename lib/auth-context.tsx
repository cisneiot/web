"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  company: string
}

export interface WindPlant {
  id: string
  name: string
  location: string
  turbineCount: number
  turbines: Turbine[]
}

export interface Turbine {
  id: string
  name: string
  x: number
  y: number
  birdCount: number
  lastDetection: string
  status: "online" | "offline" | "maintenance"
}

interface AuthContextType {
  user: User | null
  plants: WindPlant[]
  login: (email: string, password: string) => boolean
  logout: () => void
}

const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: "admin@cisneiot.cl",
    password: "admin123",
    user: {
      id: "1",
      name: "Administrador",
      email: "admin@cisneiot.cl",
      company: "CisneIoT",
    },
  },
]

const mockPlants: Record<string, WindPlant[]> = {
  "1": [
    {
      id: "plant-1",
      name: "Parque Eólico San Juan",
      location: "Región de Atacama, Chile",
      turbineCount: 1,
      turbines: [
        {
          id: "t1",
          name: "Turbina 1",
          x: 50,
          y: 50,
          birdCount: 0,
          lastDetection: "Cargando...",
          status: "online",
        },
      ],
    },
  ],
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [plants, setPlants] = useState<WindPlant[]>([])

  const login = (email: string, password: string): boolean => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    )
    if (found) {
      setUser(found.user)
      setPlants(mockPlants[found.user.id] || [])
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setPlants([])
  }

  return (
    <AuthContext.Provider value={{ user, plants, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}