"use client"

import { useState, useEffect, useRef } from "react"
import { WindPlant, Turbine } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bird, Camera, Clock, MapPin, AlertTriangle,
  CheckCircle, Wrench, Video, VideoOff, Image, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"


const API_URL = "https://api.cisneiot.cl/detecciones"
const STREAM_API = "https://api.cisneiot.cl/stream"
const STREAM_URL = "https://stream.cisneiot.cl/camara1"
const CAMARA_STATUS_URL = "https://api.cisneiot.cl/camara/status"
const STREAM_TIMEOUT = 60

/*const API_URL = "https://cisneiot.duckdns.org:8000/detecciones"
const STREAM_URL = "https://cisneiot.duckdns.org:8888/camara1"
const STREAM_API = "https://cisneiot.duckdns.org:8000/stream"
const CAMARA_STATUS_URL = "https://cisneiot.duckdns.org:8000/camara/status"
const STREAM_TIMEOUT = 60*/

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
  const [isLiveActive, setIsLiveActive] = useState(false)
  const [countdown, setCountdown] = useState(STREAM_TIMEOUT)
  const [deteccion, setDeteccion] = useState<Deteccion | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [cameraOnline, setCameraOnline] = useState(false)
  const [streamReady, setStreamReady] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

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

  const checkCameraStatus = async () => {
    try {
      const res = await fetch(CAMARA_STATUS_URL, { cache: "no-store" })
      const data = await res.json()
      setCameraOnline(data.online)
    } catch {
      setCameraOnline(false)
    }
  }

  useEffect(() => {
    fetchDeteccion()
    checkCameraStatus()
    const interval = setInterval(fetchDeteccion, 10000)
    const cameraInterval = setInterval(checkCameraStatus, 30000)
    return () => {
      clearInterval(interval)
      clearInterval(cameraInterval)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const activarStream = async () => {
    try {
      await fetch(`${STREAM_API}/activar`, { method: "POST" })
    } catch (e) {
      console.error("Error activando stream:", e)
    }

    setIsLiveActive(true)
    setStreamReady(false)
    setCountdown(STREAM_TIMEOUT)

    setTimeout(() => setStreamReady(true), 3000)

    timerRef.current = setTimeout(async () => {
      try {
        await fetch(`${STREAM_API}/desactivar`, { method: "POST" })
      } catch (e) {
        console.error("Error desactivando stream:", e)
      }
      setIsLiveActive(false)
      setStreamReady(false)
      setCountdown(STREAM_TIMEOUT)
    }, STREAM_TIMEOUT * 1000)

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          return STREAM_TIMEOUT
        }
        return prev - 1
      })
    }, 1000)
  }

  const desactivarStream = async () => {
    try {
      await fetch(`${STREAM_API}/desactivar`, { method: "POST" })
    } catch (e) {
      console.error("Error desactivando stream:", e)
    }
    setIsLiveActive(false)
    setStreamReady(false)
    setCountdown(STREAM_TIMEOUT)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

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
            <h2 className="text-2xl font-bold text-foreground">{plant.name}</h2>
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
              {plant.turbines.map((turbine) => (
                <button
                  key={turbine.id}
                  onClick={() => setSelectedTurbine(turbine)}
                  className={cn(
                    "group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110",
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
                    cameraOnline ? "bg-green-500" : "bg-destructive"
                  )} />
                </button>
              ))}
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

                {/* Estado real de la cámara */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white",
                    cameraOnline ? "bg-green-500" : "bg-destructive"
                  )}>
                    {cameraOnline ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {cameraOnline ? "En línea" : "Sin conexión"}
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

                {/* Cámara en vivo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Cámara en vivo</span>
                      {isLiveActive && cameraOnline && (
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                          </span>
                          <span className="text-xs text-destructive font-mono font-bold">{countdown}s</span>
                        </span>
                      )}
                    </div>
                    {cameraOnline && (
                      <Button
                        variant={isLiveActive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => isLiveActive ? desactivarStream() : activarStream()}
                        className="h-8 gap-1.5"
                      >
                        {isLiveActive ? (
                          <><VideoOff className="h-3.5 w-3.5" />Desactivar</>
                        ) : (
                          <><Video className="h-3.5 w-3.5" />Activar</>
                        )}
                      </Button>
                    )}
                  </div>

                  {isLiveActive && cameraOnline ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                      {streamReady ? (
                        <iframe
                          src={STREAM_URL}
                          className="h-full w-full border-0"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white text-sm">
                          Iniciando cámara...
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                        {selectedTurbine.name} — cerrando en {countdown}s
                      </div>
                      <div className="absolute right-2 top-2 rounded bg-destructive px-2 py-1 text-xs font-medium text-white">
                        EN VIVO
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/50 text-muted-foreground">
                      {cameraOnline ? (
                        <>
                          <VideoOff className="mb-2 h-8 w-8" />
                          <p className="text-sm">Feed desactivado</p>
                          <p className="text-xs">Activa para ver en tiempo real (60s)</p>
                        </>
                      ) : (
                        <>
                          <Camera className="mb-2 h-8 w-8" />
                          <p className="text-sm">Cámara no disponible</p>
                          <p className="text-xs">Sin conexión</p>
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

      {/* Lista de turbinas */}
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
                  <div className={cn("h-2 w-2 rounded-full",
                    cameraOnline ? "bg-green-500" : "bg-destructive"
                  )} />
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