import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Radio, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                </span>
                Monitoreo en tiempo real
              </div>
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Monitoreo inteligente de{" "}
                <span className="text-primary">aves</span> con IoT
              </h1>
              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                Sistema avanzado de detección y seguimiento de aves en tiempo real.
                Captura automática, análisis instantáneo y visualización de datos.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/dashboard">
                    Ver Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#caracteristicas">
                    Conocer más
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent md:text-4xl">24/7</div>
                <div className="mt-1 text-sm text-muted-foreground">Monitoreo continuo</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent md:text-4xl">{"< 1s"}</div>
                <div className="mt-1 text-sm text-muted-foreground">Tiempo de detección</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent md:text-4xl">99%</div>
                <div className="mt-1 text-sm text-muted-foreground">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent md:text-4xl">HD</div>
                <div className="mt-1 text-sm text-muted-foreground">Calidad de imagen</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="caracteristicas" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Características del sistema
              </h2>
              <p className="text-muted-foreground">
                Tecnología de punta para el monitoreo y conservación de aves
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/val_batch2_labels-nx66E2h23ImAqu47PPFpa2QFvjjRoA.jpg" 
                    alt="Sistema de detección automática de aves"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Detección automática
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Captura automática de imágenes cuando se detecta un ave en el campo de visión con bounding boxes precisos.
                  </p>
                </CardContent>
              </Card>

              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ave2-2kZy2fiaFHBb1bYWLsnyJlpsKJiJQX.jpg" 
                    alt="Monitoreo en tiempo real de aves"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Radio className="h-5 w-5" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Tiempo real
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Visualiza el feed de la cámara y recibe alertas instantáneas con segmentación precisa de aves.
                  </p>
                </CardContent>
              </Card>

              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/val_batch0_pred-aVz3EH7pcrdRVMp9qrX5qGFGQvghc4.jpg" 
                    alt="Análisis de datos con predicciones"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Análisis de datos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dashboard completo con estadísticas, predicciones con confianza y tendencias de avistamientos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
                Comienza a monitorear ahora
              </h2>
              <p className="mb-8 text-primary-foreground/80">
                Accede al dashboard para ver las detecciones en tiempo real
              </p>
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/dashboard">
                  Ir al Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
