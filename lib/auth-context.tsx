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
      turbineCount: 13,
      turbines: [
        { id: "t1", name: "Turbina 1", x: 17, y: 38, birdCount: 0, lastDetection: "Cargando...", status: "online" },
        { id: "t2", name: "Turbina 2", x: 24, y: 37, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t3", name: "Turbina 3", x: 31, y: 36, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t4", name: "Turbina 4", x: 38, y: 36, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t5", name: "Turbina 5", x: 45, y: 37, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t6", name: "Turbina 6", x: 51, y: 38, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t7", name: "Turbina 7", x: 57, y: 38, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t8", name: "Turbina 8", x: 63, y: 39, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t9", name: "Turbina 9", x: 69, y: 39, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t10", name: "Turbina 10", x: 75, y: 40, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t11", name: "Turbina 11", x: 80, y: 41, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t12", name: "Turbina 12", x: 86, y: 42, birdCount: 0, lastDetection: "-", status: "online" },
        { id: "t13", name: "Turbina 13", x: 91, y: 43, birdCount: 0, lastDetection: "-", status: "online" },
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