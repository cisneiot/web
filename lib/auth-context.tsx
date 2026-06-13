"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  password: string
  company: string
  role: "admin" | "operador"
  plantIds: string[]
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

export interface WindPlant {
  id: string
  name: string
  location: string
  image: string
  turbineCount: number
  turbines: Turbine[]
}

interface AuthContextType {
  user: User | null
  plants: WindPlant[]
  // datos globales (para el panel de administración)
  allPlants: WindPlant[]
  allUsers: User[]
  login: (email: string, password: string) => boolean
  logout: () => void
  // CRUD de plantas
  addPlant: (plant: Omit<WindPlant, "id" | "turbines" | "turbineCount">) => void
  updatePlant: (id: string, data: Partial<Omit<WindPlant, "id" | "turbines">>) => void
  deletePlant: (id: string) => void
  // CRUD de turbinas
  addTurbine: (plantId: string, turbine: Omit<Turbine, "id">) => void
  updateTurbine: (plantId: string, turbineId: string, data: Partial<Omit<Turbine, "id">>) => void
  deleteTurbine: (plantId: string, turbineId: string) => void
  // CRUD de usuarios
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, data: Partial<Omit<User, "id">>) => void
  deleteUser: (id: string) => void
}

// ---------- Datos iniciales (semilla) ----------
const seedPlants: WindPlant[] = [
  {
    id: "plant-1",
    name: "Parque Eólico San Juan",
    location: "Región de Atacama, Chile",
    image: "/parque1.png",
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
]

const seedUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@cisneiot.cl",
    password: "admin123",
    company: "CisneIoT",
    role: "admin",
    plantIds: ["plant-1"],
  },
]

// ---------- Persistencia en localStorage ----------
const PLANTS_KEY = "cisneiot_plants"
const USERS_KEY = "cisneiot_users"

function loadPlants(): WindPlant[] {
  if (typeof window === "undefined") return seedPlants
  try {
    const raw = localStorage.getItem(PLANTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seedPlants
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return seedUsers
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seedUsers
}

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [allPlants, setAllPlants] = useState<WindPlant[]>(seedPlants)
  const [allUsers, setAllUsers] = useState<User[]>(seedUsers)

  // Cargar desde localStorage al montar (cliente)
  useEffect(() => {
    setAllPlants(loadPlants())
    setAllUsers(loadUsers())
  }, [])

  // Guardar cambios
  const persistPlants = (next: WindPlant[]) => {
    setAllPlants(next)
    try {
      localStorage.setItem(PLANTS_KEY, JSON.stringify(next))
    } catch {}
  }

  const persistUsers = (next: User[]) => {
    setAllUsers(next)
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(next))
    } catch {}
  }

  const login = (email: string, password: string): boolean => {
    const found = allUsers.find((u) => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  // ----- Plantas -----
  const addPlant: AuthContextType["addPlant"] = (plant) => {
    const newPlant: WindPlant = {
      ...plant,
      id: genId("plant"),
      turbines: [],
      turbineCount: 0,
    }
    persistPlants([...allPlants, newPlant])
  }

  const updatePlant: AuthContextType["updatePlant"] = (id, data) => {
    persistPlants(allPlants.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deletePlant: AuthContextType["deletePlant"] = (id) => {
    persistPlants(allPlants.filter((p) => p.id !== id))
    // quitar la planta de los usuarios asignados
    persistUsers(allUsers.map((u) => ({ ...u, plantIds: u.plantIds.filter((pid) => pid !== id) })))
  }

  // ----- Turbinas -----
  const addTurbine: AuthContextType["addTurbine"] = (plantId, turbine) => {
    persistPlants(
      allPlants.map((p) => {
        if (p.id !== plantId) return p
        const turbines = [...p.turbines, { ...turbine, id: genId("t") }]
        return { ...p, turbines, turbineCount: turbines.length }
      }),
    )
  }

  const updateTurbine: AuthContextType["updateTurbine"] = (plantId, turbineId, data) => {
    persistPlants(
      allPlants.map((p) => {
        if (p.id !== plantId) return p
        return {
          ...p,
          turbines: p.turbines.map((t) => (t.id === turbineId ? { ...t, ...data } : t)),
        }
      }),
    )
  }

  const deleteTurbine: AuthContextType["deleteTurbine"] = (plantId, turbineId) => {
    persistPlants(
      allPlants.map((p) => {
        if (p.id !== plantId) return p
        const turbines = p.turbines.filter((t) => t.id !== turbineId)
        return { ...p, turbines, turbineCount: turbines.length }
      }),
    )
  }

  // ----- Usuarios -----
  const addUser: AuthContextType["addUser"] = (u) => {
    persistUsers([...allUsers, { ...u, id: genId("u") }])
  }

  const updateUser: AuthContextType["updateUser"] = (id, data) => {
    const next = allUsers.map((u) => (u.id === id ? { ...u, ...data } : u))
    persistUsers(next)
    // si edito al usuario logueado, refrescar su sesión
    if (user?.id === id) {
      const updated = next.find((u) => u.id === id) || null
      setUser(updated)
    }
  }

  const deleteUser: AuthContextType["deleteUser"] = (id) => {
    persistUsers(allUsers.filter((u) => u.id !== id))
  }

  // Plantas visibles para el usuario actual (admin ve todas)
  const plants =
    user?.role === "admin"
      ? allPlants
      : allPlants.filter((p) => user?.plantIds.includes(p.id))

  return (
    <AuthContext.Provider
      value={{
        user,
        plants,
        allPlants,
        allUsers,
        login,
        logout,
        addPlant,
        updatePlant,
        deletePlant,
        addTurbine,
        updateTurbine,
        deleteTurbine,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
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
