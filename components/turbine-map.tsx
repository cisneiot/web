"use client"

import { useState, useEffect } from "react"
import { WindPlant, Turbine } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bird, Clock, MapPin, AlertTriangle,
  CheckCircle, Wrench, Image, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const API_URL = "http://201.239.225.78:8000/detecciones"

interface Deteccion {
  created_at: string
  nombre_imagen: string
  ruta_imagen: string
  url_imagen: string
  cantidad_aves: number
  dispositivo: string
}

interface TurbineMapProps {
  plant: WindPlant
  onBack: () => void
}

export function TurbineMap({ plant, onBack }: TurbineMapProps) {
  const [selectedTurbine, setSelectedTurbine] = useState<Turbine | null>(null)
  const [deteccion, setDeteccion] = useState<Deteccion | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const fetchDeteccion = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" })
      const data = await res.json()
      const item = Array.isArray(data) ? data[0] : data
      setDeteccion(item)
      setLastUpdate(new Date().toLocaleTimeString("es-CL"))
    } catch (e) {
      console.error("Error al obtener datos:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeteccion()
    const interval = setInterval(fetchDeteccion, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Turbine["status"]) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "offline": return "bg-destructive"
      case "maintenance": return "bg-yellow-500"
    }
  }

  const getStatusIcon = (status: Turbine["status"]) => {
    switch (status) {
      case "online": return <CheckCircle className="h-4 w-4" />
      case "offline": return <AlertTriangle className="h-4 w-4" />
      case "maintenance": return <Wrench className="h-4 w-4" />
    }
  }

  const totalBirds = deteccion?.cantidad_aves ??
    plant.turbines.reduce((s, t) => s + t.birdCount, 0)
  const onlineTurbines = plant.turbines.filter(t => t.status === "online").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{plant.name}</h2>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {plant.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button onClick={fetchDeteccion} className="text-muted-foreground hover:text-primary">
            <RefreshCw className="h-4 w-4" />
          </button>
          {lastUpdate && <span className="text-xs text-muted-foreground">Actualizado: {lastUpdate}</span>}
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <Bird className="h-4 w-4 text-primary" />
            <span className="font-bold text-accent">{totalBirds}</span>
            <span className="text-muted-foreground">aves detectadas</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <span className="font-medium text-accent">{onlineTurbines}/{plant.turbineCount}</span>
            <span className="text-muted-foreground">en línea</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Vista aérea de la planta</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-lg"
              style={{
                backgroundImage: "url('/parque1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center top"
              }}
            >
              {/* Turbine icons */}
              {plant.turbines.map((turbine) => (
                <button
                  key={turbine.id}
                  onClick={() => setSelectedTurbine(turbine)}
                  className={cn(
                    "group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all hover:scale-110",
                    selectedTurbine?.id === turbine.id
                      ? "border-white bg-primary text-white scale-110 z-10"
                      : "border-white bg-white/80 text-gray-800 hover:bg-primary hover:text-white"
                  )}
                  style={{ left: `${turbine.x}%`, top: `${turbine.y}%` }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 10V2" />
                    <path d="M12 14l-6.9 4" />
                    <path d="M12 14l6.9 4" />
                  </svg>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white",
                    getStatusColor(turbine.status)
                  )} />
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-sm">
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500" />En línea</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-yellow-500" />Mantenimiento</div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" />Fuera de línea</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Turbine Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedTurbine ? selectedTurbine.name : "Selecciona una turbina"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTurbine ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white",
                    getStatusColor(selectedTurbine.status)
                  )}>
                    {getStatusIcon(selectedTurbine.status)}
                    {selectedTurbine.status === "online" && "En línea"}
                    {selectedTurbine.status === "offline" && "Fuera de línea"}
                    {selectedTurbine.status === "maintenance" && "Mantenimiento"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Bird className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Aves detectadas</p>
                        <p className="text-2xl font-bold text-accent">
                          {loading ? "..." : deteccion?.cantidad_aves ?? selectedTurbine.birdCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Última detección</p>
                        <p className="text-sm font-semibold">
                          {loading ? "Cargando..." : deteccion?.created_at ?? selectedTurbine.lastDetection}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Última foto real */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Última detección</span>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    {loading ? (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Cargando...</div>
                    ) : deteccion?.url_imagen ? (
                      <img src={deteccion.url_imagen} alt="Última detección" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                    )}
                    {deteccion && (
                      <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                        {deteccion.created_at}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-sm">Haz clic en una turbina del mapa para ver sus detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}