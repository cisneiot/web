"use client"

import { WindPlant } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Wind, ChevronRight } from "lucide-react"

interface PlantSelectorProps {
  plants: WindPlant[]
  onSelectPlant: (plant: WindPlant) => void
}

export function PlantSelector({ plants, onSelectPlant }: PlantSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Selecciona tu planta eólica</h2>
        <p className="mt-2 text-muted-foreground">
          Elige la planta que deseas monitorear
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plants.map((plant) => (
          <Card
            key={plant.id}
            className="cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            onClick={() => onSelectPlant(plant)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wind className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <CardTitle className="text-lg">{plant.name}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {plant.location}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-muted-foreground">
                    {plant.turbineCount} turbinas
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    {plant.turbines.filter((t) => t.status === "online").length} activas
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
