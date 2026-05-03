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
      name: "Operador1",
      email: "admin@cisneiot.cl",
      company: "Parque Eólico San Juan.",
    },
  },
  {
    email: "operador@windpower.com",
    password: "operador123",
    user: {
      id: "2",
      name: "María González",
      email: "operador@windpower.com",
      company: "WindPower Corp",
    },
  },
]

const mockPlants: Record<string, WindPlant[]> = {
  "1": [
    {
      id: "plant-1",
      name: "Parque Eólico San Juan",
      location: "Región de Atacama, Chile",
      turbineCount: 6,
      turbines: [
        { id: "t1", name: "Turbina A1", x: 15, y: 20, birdCount: 127, lastDetection: "hace 5 min", status: "online" },
      ],
    },
    {
      id: "plant-2",
      name: "Parque Eólico Sierra Norte",
      location: "Nuevo León, México",
      turbineCount: 4,
      turbines: [
        { id: "t1", name: "Turbina 01", x: 25, y: 30, birdCount: 94, lastDetection: "hace 7 min", status: "online" },
        { id: "t2", name: "Turbina 02", x: 55, y: 25, birdCount: 167, lastDetection: "hace 1 min", status: "online" },
        { id: "t3", name: "Turbina 03", x: 30, y: 65, birdCount: 45, lastDetection: "hace 20 min", status: "offline" },
        { id: "t4", name: "Turbina 04", x: 65, y: 60, birdCount: 231, lastDetection: "hace 4 min", status: "online" },
      ],
    },
  ],
  "2": [
    {
      id: "plant-3",
      name: "WindPower Central",
      location: "Texas, USA",
      turbineCount: 8,
      turbines: [
        { id: "t1", name: "WT-001", x: 10, y: 20, birdCount: 312, lastDetection: "hace 2 min", status: "online" },
        { id: "t2", name: "WT-002", x: 30, y: 15, birdCount: 187, lastDetection: "hace 5 min", status: "online" },
        { id: "t3", name: "WT-003", x: 50, y: 20, birdCount: 256, lastDetection: "hace 1 min", status: "online" },
        { id: "t4", name: "WT-004", x: 70, y: 18, birdCount: 143, lastDetection: "hace 8 min", status: "online" },
        { id: "t5", name: "WT-005", x: 15, y: 55, birdCount: 98, lastDetection: "hace 15 min", status: "maintenance" },
        { id: "t6", name: "WT-006", x: 35, y: 60, birdCount: 421, lastDetection: "hace 30 seg", status: "online" },
        { id: "t7", name: "WT-007", x: 55, y: 58, birdCount: 267, lastDetection: "hace 3 min", status: "online" },
        { id: "t8", name: "WT-008", x: 75, y: 55, birdCount: 189, lastDetection: "hace 6 min", status: "online" },
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
