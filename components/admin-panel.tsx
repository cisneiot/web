"use client"

import { useState } from "react"
import { useAuth, WindPlant, Turbine, User } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Wind, Plus, Pencil, Trash2, MapPin, Upload, ImageIcon } from "lucide-react"

export function AdminPanel() {
  const {
    allPlants,
    allUsers,
    addPlant,
    updatePlant,
    deletePlant,
    addTurbine,
    updateTurbine,
    deleteTurbine,
    addUser,
    updateUser,
    deleteUser,
  } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Panel de administración</h2>
        <p className="text-muted-foreground">
          Gestiona plantas eólicas, turbinas y usuarios sin tocar código.
        </p>
      </div>

      <Tabs defaultValue="plants">
        <TabsList>
          <TabsTrigger value="plants">Plantas</TabsTrigger>
          <TabsTrigger value="turbines">Turbinas</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="mt-6">
          <PlantsTab
            plants={allPlants}
            addPlant={addPlant}
            updatePlant={updatePlant}
            deletePlant={deletePlant}
          />
        </TabsContent>

        <TabsContent value="turbines" className="mt-6">
          <TurbinesTab
            plants={allPlants}
            addTurbine={addTurbine}
            updateTurbine={updateTurbine}
            deleteTurbine={deleteTurbine}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UsersTab
            users={allUsers}
            plants={allPlants}
            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ----------------- Imagen / Upload helper ----------------- */
function ImageField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <Label>Foto del parque (vista aérea)</Label>
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value || "/placeholder.svg"} alt="Vista del parque" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">
            <Upload className="h-4 w-4" />
            Subir imagen
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          <Input
            placeholder="o pega una ruta: /parque1.png"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

/* ----------------- Plantas ----------------- */
function PlantsTab({
  plants,
  addPlant,
  updatePlant,
  deletePlant,
}: {
  plants: WindPlant[]
  addPlant: ReturnType<typeof useAuth>["addPlant"]
  updatePlant: ReturnType<typeof useAuth>["updatePlant"]
  deletePlant: ReturnType<typeof useAuth>["deletePlant"]
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<WindPlant | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", location: "", image: "" })

  const openNew = () => {
    setEditing(null)
    setForm({ name: "", location: "", image: "" })
    setOpen(true)
  }

  const openEdit = (p: WindPlant) => {
    setEditing(p)
    setForm({ name: p.name, location: p.location, image: p.image })
    setOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) return
    if (editing) {
      updatePlant(editing.id, form)
    } else {
      addPlant(form)
    }
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva planta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plants.map((p) => (
          <Card key={p.id}>
            <div className="relative h-32 overflow-hidden rounded-t-xl bg-muted">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image || "/placeholder.svg"} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Wind className="h-8 w-8" />
                </div>
              )}
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <p className="font-semibold text-foreground">{p.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.location}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{p.turbineCount} turbinas</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => openEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={() => setDeleteId(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar planta" : "Nueva planta eólica"}</DialogTitle>
            <DialogDescription>
              Completa los datos de la planta. La foto se usa como vista aérea en el mapa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-name">Nombre</Label>
              <Input
                id="plant-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Parque Eólico San Juan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plant-location">Ubicación</Label>
              <Input
                id="plant-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Región de Atacama, Chile"
              />
            </div>
            <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? "Guardar cambios" : "Crear planta"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta planta?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán también sus turbinas y se quitará de los usuarios asignados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deletePlant(deleteId)
                setDeleteId(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* ----------------- Turbinas ----------------- */
function TurbinesTab({
  plants,
  addTurbine,
  updateTurbine,
  deleteTurbine,
}: {
  plants: WindPlant[]
  addTurbine: ReturnType<typeof useAuth>["addTurbine"]
  updateTurbine: ReturnType<typeof useAuth>["updateTurbine"]
  deleteTurbine: ReturnType<typeof useAuth>["deleteTurbine"]
}) {
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id ?? "")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Turbine | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", x: 50, y: 50, status: "online" as Turbine["status"] })

  const plant = plants.find((p) => p.id === selectedPlantId) ?? null

  const openNew = () => {
    setEditing(null)
    setForm({ name: `Turbina ${(plant?.turbines.length ?? 0) + 1}`, x: 50, y: 50, status: "online" })
    setOpen(true)
  }

  const openEdit = (t: Turbine) => {
    setEditing(t)
    setForm({ name: t.name, x: t.x, y: t.y, status: t.status })
    setOpen(true)
  }

  const save = () => {
    if (!plant || !form.name.trim()) return
    if (editing) {
      updateTurbine(plant.id, editing.id, form)
    } else {
      addTurbine(plant.id, { ...form, birdCount: 0, lastDetection: "-" })
    }
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Label className="mb-1 block text-sm">Planta</Label>
          <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una planta" />
            </SelectTrigger>
            <SelectContent>
              {plants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openNew} disabled={!plant} className="gap-2 sm:self-end">
          <Plus className="h-4 w-4" />
          Nueva turbina
        </Button>
      </div>

      {plant && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {plant.name} — {plant.turbines.length} turbinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plant.turbines.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      pos: {t.x}%, {t.y}% · {t.status}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {plant.turbines.length === 0 && (
                <p className="text-sm text-muted-foreground">Esta planta aún no tiene turbinas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar turbina" : "Nueva turbina"}</DialogTitle>
            <DialogDescription>
              La posición X/Y (0-100%) define dónde aparece el punto sobre la foto del parque.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="t-name">Nombre</Label>
              <Input
                id="t-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Turbina 2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="t-x">Posición X (%)</Label>
                <Input
                  id="t-x"
                  type="number"
                  min={0}
                  max={100}
                  value={form.x}
                  onChange={(e) => setForm({ ...form, x: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-y">Posición Y (%)</Label>
                <Input
                  id="t-y"
                  type="number"
                  min={0}
                  max={100}
                  value={form.y}
                  onChange={(e) => setForm({ ...form, y: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Turbine["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">En línea</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="offline">Fuera de línea</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? "Guardar cambios" : "Crear turbina"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta turbina?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (plant && deleteId) deleteTurbine(plant.id, deleteId)
                setDeleteId(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* ----------------- Usuarios ----------------- */
function UsersTab({
  users,
  plants,
  addUser,
  updateUser,
  deleteUser,
}: {
  users: User[]
  plants: WindPlant[]
  addUser: ReturnType<typeof useAuth>["addUser"]
  updateUser: ReturnType<typeof useAuth>["updateUser"]
  deleteUser: ReturnType<typeof useAuth>["deleteUser"]
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "operador" as User["role"],
    plantIds: [] as string[],
  })

  const openNew = () => {
    setEditing(null)
    setForm({ name: "", email: "", password: "", company: "", role: "operador", plantIds: [] })
    setOpen(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({
      name: u.name,
      email: u.email,
      password: u.password,
      company: u.company,
      role: u.role,
      plantIds: u.plantIds,
    })
    setOpen(true)
  }

  const togglePlant = (id: string) => {
    setForm((f) => ({
      ...f,
      plantIds: f.plantIds.includes(id)
        ? f.plantIds.filter((p) => p !== id)
        : [...f.plantIds, id],
    }))
  }

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return
    if (editing) {
      updateUser(editing.id, form)
    } else {
      addUser(form)
    }
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {users.map((u) => (
              <div key={u.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{u.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.company} ·{" "}
                    {u.role === "admin"
                      ? "todas las plantas"
                      : `${u.plantIds.length} planta(s) asignada(s)`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(u.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            <DialogDescription>
              Asigna un rol y las plantas que este usuario podrá ver.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="u-name">Nombre</Label>
                <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-company">Empresa</Label>
                <Input
                  id="u-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-email">Correo</Label>
              <Input
                id="u-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-pass">Contraseña</Label>
              <Input
                id="u-pass"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === "operador" && (
              <div className="space-y-2">
                <Label>Plantas asignadas</Label>
                <div className="space-y-2 rounded-lg border p-3">
                  {plants.map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.plantIds.includes(p.id)}
                        onChange={() => togglePlant(p.id)}
                        className="h-4 w-4 rounded border-input"
                      />
                      {p.name}
                    </label>
                  ))}
                  {plants.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay plantas creadas.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? "Guardar cambios" : "Crear usuario"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteUser(deleteId)
                setDeleteId(null)
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
