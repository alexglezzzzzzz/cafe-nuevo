// Escrituras del panel.
//
// Todas siguen el mismo patrón: reciben lo mínimo, tocan solo lo que cambia
// y dejan el resto de los datos intacto.

import { actualizarDatos, nuevoId } from './almacen'
import type {
  CategoriaCarta,
  DiaEspecial,
  Encargo,
  EstadoEncargo,
  EstadoMensaje,
  EstadoReserva,
  Negocio,
  Novedad,
  ProductoCarta,
  Reserva,
  Rol,
  TramoDia,
} from './tipos'

// ------------------------------------------------------------- Mensajes

export function cambiarEstadoMensaje(id: string, estado: EstadoMensaje): void {
  actualizarDatos((d) => ({
    ...d,
    mensajes: d.mensajes.map((m) => (m.id === id ? { ...m, estado } : m)),
  }))
}

export function guardarNotaInterna(id: string, nota: string): void {
  actualizarDatos((d) => ({
    ...d,
    mensajes: d.mensajes.map((m) =>
      m.id === id ? { ...m, notaInterna: nota } : m,
    ),
  }))
}

// ------------------------------------------------------------- Reservas

export function cambiarEstadoReserva(id: string, estado: EstadoReserva): void {
  actualizarDatos((d) => ({
    ...d,
    reservas: d.reservas.map((r) => (r.id === id ? { ...r, estado } : r)),
  }))
}

export function crearReserva(
  datos: Omit<Reserva, 'id' | 'creadoEn' | 'estado' | 'origen'>,
): Reserva {
  const reserva: Reserva = {
    ...datos,
    id: nuevoId('res'),
    estado: 'confirmada',
    origen: 'telefono',
    creadoEn: new Date().toISOString(),
  }
  actualizarDatos((d) => ({ ...d, reservas: [reserva, ...d.reservas] }))
  return reserva
}

export function actualizarReserva(id: string, cambios: Partial<Reserva>): void {
  actualizarDatos((d) => ({
    ...d,
    reservas: d.reservas.map((r) => (r.id === id ? { ...r, ...cambios } : r)),
  }))
}

// ------------------------------------------------------------- Encargos

export function cambiarEstadoEncargo(id: string, estado: EstadoEncargo): void {
  actualizarDatos((d) => ({
    ...d,
    encargos: d.encargos.map((e) => (e.id === id ? { ...e, estado } : e)),
  }))
}

export function crearEncargo(
  datos: Omit<Encargo, 'id' | 'creadoEn' | 'estado' | 'origen'>,
): Encargo {
  const encargo: Encargo = {
    ...datos,
    id: nuevoId('enc'),
    estado: 'aceptado',
    origen: 'telefono',
    creadoEn: new Date().toISOString(),
  }
  actualizarDatos((d) => ({ ...d, encargos: [encargo, ...d.encargos] }))
  return encargo
}

export function actualizarEncargo(id: string, cambios: Partial<Encargo>): void {
  actualizarDatos((d) => ({
    ...d,
    encargos: d.encargos.map((e) => (e.id === id ? { ...e, ...cambios } : e)),
  }))
}

// ---------------------------------------------------------------- Carta

export function crearProducto(categoriaId: string): ProductoCarta {
  let creado!: ProductoCarta
  actualizarDatos((d) => {
    const deLaCategoria = d.productos.filter(
      (p) => p.categoriaId === categoriaId,
    )
    creado = {
      id: nuevoId('p'),
      categoriaId,
      nombre: '',
      descripcion: '',
      precio: 0,
      disponible: true,
      destacado: false,
      alergenos: [],
      orden: deLaCategoria.length + 1,
    }
    return { ...d, productos: [...d.productos, creado] }
  })
  return creado
}

export function actualizarProducto(
  id: string,
  cambios: Partial<ProductoCarta>,
): void {
  actualizarDatos((d) => ({
    ...d,
    productos: d.productos.map((p) => (p.id === id ? { ...p, ...cambios } : p)),
  }))
}

export function borrarProducto(id: string): void {
  actualizarDatos((d) => ({
    ...d,
    productos: d.productos.filter((p) => p.id !== id),
  }))
}

export function moverProducto(id: string, direccion: -1 | 1): void {
  actualizarDatos((d) => {
    const producto = d.productos.find((p) => p.id === id)
    if (!producto) return d

    const hermanos = d.productos
      .filter((p) => p.categoriaId === producto.categoriaId)
      .sort((a, b) => a.orden - b.orden)

    const i = hermanos.findIndex((p) => p.id === id)
    const j = i + direccion
    if (j < 0 || j >= hermanos.length) return d

    const ordenA = hermanos[i].orden
    const ordenB = hermanos[j].orden
    return {
      ...d,
      productos: d.productos.map((p) => {
        if (p.id === hermanos[i].id) return { ...p, orden: ordenB }
        if (p.id === hermanos[j].id) return { ...p, orden: ordenA }
        return p
      }),
    }
  })
}

export function crearCategoria(): CategoriaCarta {
  let creada!: CategoriaCarta
  actualizarDatos((d) => {
    creada = {
      id: nuevoId('cat'),
      nombre: 'Categoría nueva',
      descripcion: '',
      orden: d.categorias.length + 1,
    }
    return { ...d, categorias: [...d.categorias, creada] }
  })
  return creada
}

export function actualizarCategoria(
  id: string,
  cambios: Partial<CategoriaCarta>,
): void {
  actualizarDatos((d) => ({
    ...d,
    categorias: d.categorias.map((c) =>
      c.id === id ? { ...c, ...cambios } : c,
    ),
  }))
}

/** Borra la categoría y, con ella, todo lo que contenía. */
export function borrarCategoria(id: string): void {
  actualizarDatos((d) => ({
    ...d,
    categorias: d.categorias.filter((c) => c.id !== id),
    productos: d.productos.filter((p) => p.categoriaId !== id),
  }))
}

// ------------------------------------------------------------- Horarios

export function actualizarTramo(dia: number, cambios: Partial<TramoDia>): void {
  actualizarDatos((d) => ({
    ...d,
    horario: {
      ...d.horario,
      semana: d.horario.semana.map((t) =>
        t.dia === dia ? { ...t, ...cambios } : t,
      ),
    },
  }))
}

export function actualizarNotaHorario(nota: string): void {
  actualizarDatos((d) => ({ ...d, horario: { ...d.horario, nota } }))
}

export function crearDiaEspecial(fecha: string): DiaEspecial {
  const dia: DiaEspecial = {
    id: nuevoId('esp'),
    fecha,
    motivo: '',
    cerrado: false,
    apertura: '09:00',
    cierre: '20:00',
  }
  actualizarDatos((d) => ({
    ...d,
    horario: { ...d.horario, especiales: [...d.horario.especiales, dia] },
  }))
  return dia
}

export function actualizarDiaEspecial(
  id: string,
  cambios: Partial<DiaEspecial>,
): void {
  actualizarDatos((d) => ({
    ...d,
    horario: {
      ...d.horario,
      especiales: d.horario.especiales.map((e) =>
        e.id === id ? { ...e, ...cambios } : e,
      ),
    },
  }))
}

export function borrarDiaEspecial(id: string): void {
  actualizarDatos((d) => ({
    ...d,
    horario: {
      ...d.horario,
      especiales: d.horario.especiales.filter((e) => e.id !== id),
    },
  }))
}

// ------------------------------------------------------------ Novedades

export function crearNovedad(fecha: string): Novedad {
  const novedad: Novedad = {
    id: nuevoId('nov'),
    titulo: '',
    resumen: '',
    cuerpo: '',
    fecha,
    publicada: false,
    etiqueta: 'La casa',
  }
  actualizarDatos((d) => ({ ...d, novedades: [novedad, ...d.novedades] }))
  return novedad
}

export function actualizarNovedad(
  id: string,
  cambios: Partial<Novedad>,
): void {
  actualizarDatos((d) => ({
    ...d,
    novedades: d.novedades.map((n) => (n.id === id ? { ...n, ...cambios } : n)),
  }))
}

export function borrarNovedad(id: string): void {
  actualizarDatos((d) => ({
    ...d,
    novedades: d.novedades.filter((n) => n.id !== id),
  }))
}

// --------------------------------------------------------------- Equipo

export function cambiarRol(usuarioId: string, rol: Rol): void {
  actualizarDatos((d) => ({
    ...d,
    usuarios: d.usuarios.map((u) => (u.id === usuarioId ? { ...u, rol } : u)),
  }))
}

export function cambiarActivo(usuarioId: string, activo: boolean): void {
  actualizarDatos((d) => ({
    ...d,
    usuarios: d.usuarios.map((u) =>
      u.id === usuarioId ? { ...u, activo } : u,
    ),
  }))
}

// -------------------------------------------------------------- Negocio

export function actualizarNegocio(cambios: Partial<Negocio>): void {
  actualizarDatos((d) => ({ ...d, negocio: { ...d.negocio, ...cambios } }))
}
