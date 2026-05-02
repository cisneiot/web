"use client"

import { useState } from "react"
import { WindPlant, Turbine } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bird, Camera, Clock, MapPin, AlertTriangle, CheckCircle, Wrench, Video, VideoOff, Image } from "lucide-react"
import { cn } from "@/lib/utils"

interface TurbineMapProps {
  plant: WindPlant
  onBack: () => void
}

export function TurbineMap({ plant, onBack }: TurbineMapProps) {
  const [selectedTurbine, setSelectedTurbine] = useState<Turbine | null>(null)
  const [isLiveActive, setIsLiveActive] = useState(false)

  const getStatusColor = (status: Turbine["status"]) => {
    switch (status) {
      case "online":
        return "bg-accent"
      case "offline":
        return "bg-destructive"
      case "maintenance":
        return "bg-yellow-500"
    }
  }

  const getStatusIcon = (status: Turbine["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "offline":
        return <AlertTriangle className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
    }
  }

  const totalBirds = plant.turbines.reduce((sum, t) => sum + t.birdCount, 0)
  const onlineTurbines = plant.turbines.filter((t) => t.status === "online").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{plant.name}</h2>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {plant.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <Bird className="h-4 w-4 text-primary" />
            <span className="font-medium text-accent">{totalBirds}</span>
            <span className="text-muted-foreground">aves totales</span>
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
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-green-900/30 via-green-800/20 to-green-900/30">
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-foreground"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute bottom-0 top-0 w-px bg-foreground"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Turbine icons */}
              {plant.turbines.map((turbine) => (
                <button
                  key={turbine.id}
                  onClick={() => setSelectedTurbine(turbine)}
                  className={cn(
                    "group absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110",
                    selectedTurbine?.id === turbine.id
                      ? "border-primary bg-primary text-primary-foreground scale-110 z-10"
                      : "border-foreground/20 bg-background/90 text-foreground hover:border-primary"
                  )}
                  style={{ left: `${turbine.x}%`, top: `${turbine.y}%` }}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 10V2" />
                    <path d="M12 14l-6.9 4" />
                    <path d="M12 14l6.9 4" />
                  </svg>
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                      getStatusColor(turbine.status)
                    )}
                  />
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg bg-background/80 px-3 py-2 text-xs backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>En línea</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Mantenimiento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span>Fuera de línea</span>
                </div>
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
                {/* Status */}
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white", getStatusColor(selectedTurbine.status))}>
                    {getStatusIcon(selectedTurbine.status)}
                    {selectedTurbine.status === "online" && "En línea"}
                    {selectedTurbine.status === "offline" && "Fuera de línea"}
                    {selectedTurbine.status === "maintenance" && "Mantenimiento"}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Bird className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Aves detectadas</p>
                        <p className="text-2xl font-bold text-accent">{selectedTurbine.birdCount}</p>
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
                        <p className="text-lg font-semibold">{selectedTurbine.lastDetection}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Última detección */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Última detección</span>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/val_batch2_labels-nx66E2h23ImAqu47PPFpa2QFvjjRoA.jpg"
                      alt="Última detección de ave"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                      {selectedTurbine.lastDetection}
                    </div>
                  </div>
                </div>

                {/* Cámara en vivo (opcional) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Cámara en vivo</span>
                      {isLiveActive && selectedTurbine.status === "online" && (
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                          </span>
                          <span className="text-xs text-destructive">EN VIVO</span>
                        </span>
                      )}
                    </div>
                    {selectedTurbine.status === "online" && (
                      <Button
                        variant={isLiveActive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsLiveActive(!isLiveActive)}
                        className="h-8 gap-1.5"
                      >
                        {isLiveActive ? (
                          <>
                            <VideoOff className="h-3.5 w-3.5" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Video className="h-3.5 w-3.5" />
                            Activar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {isLiveActive && selectedTurbine.status === "online" ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/train_batch631-6MuBUrYoeU8C3xqEauhpgcO7j0ILiD.jpg"
                        alt="Feed de cámara en vivo"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                        {selectedTurbine.name} - TRANSMITIENDO
                      </div>
                      <div className="absolute right-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-white">
                        EN VIVO
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/50 text-muted-foreground">
                      {selectedTurbine.status === "online" ? (
                        <>
                          <VideoOff className="mb-2 h-8 w-8" />
                          <p className="text-sm">Feed desactivado</p>
                          <p className="text-xs">Activa para ver en tiempo real</p>
                        </>
                      ) : (
                        <>
                          <Camera className="mb-2 h-8 w-8" />
                          <p className="text-sm">Cámara no disponible</p>
                          <p className="text-xs">Turbina fuera de línea</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 10V2" />
                    <path d="M12 14l-6.9 4" />
                    <path d="M12 14l6.9 4" />
                  </svg>
                </div>
                <p className="text-sm">Haz clic en una turbina del mapa para ver sus detalles y cámara en vivo</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Turbine List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Todas las turbinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plant.turbines.map((turbine) => (
              <button
                key={turbine.id}
                onClick={() => setSelectedTurbine(turbine)}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 text-left transition-all hover:border-primary hover:bg-muted/50",
                  selectedTurbine?.id === turbine.id && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", getStatusColor(turbine.status))} />
                  <div>
                    <p className="font-medium">{turbine.name}</p>
                    <p className="text-xs text-muted-foreground">{turbine.lastDetection}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Bird className="h-3 w-3 text-primary" />
                  <span className="font-semibold text-accent">{turbine.birdCount}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
