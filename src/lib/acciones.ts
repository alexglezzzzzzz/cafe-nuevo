// Escrituras que hace la parte pública de la web.
//
// Un mensaje de contacto siempre entra en la bandeja. Además, si pide mesa o
// encarga algo, se crea la reserva o el encargo correspondiente para que el
// equipo lo gestione con su propio ciclo de estados.

import { actualizarDatos, nuevoId } from './almacen'
import type {
  Encargo,
  Mensaje,
  MotivoMensaje,
  Reserva,
  TipoEncargo,
} from './tipos'

export interface EntradaContacto {
  motivo: MotivoMensaje
  nombre: string
  email: string
  telefono: string
  mensaje: string
  /** Solo cuando el motivo es "reserva". */
  reserva?: {
    fecha: string
    hora: string
    personas: number
  }
  /** Solo cuando el motivo es "encargo". */
  encargo?: {
    tipo: TipoEncargo
    fechaRecogida: string
  }
}

export interface ResultadoContacto {
  mensaje: Mensaje
  reserva?: Reserva
  encargo?: Encargo
}

export function registrarContacto(
  entrada: EntradaContacto,
): ResultadoContacto {
  const ahora = new Date().toISOString()
  const idMensaje = nuevoId('msg')

  let reserva: Reserva | undefined
  let encargo: Encargo | undefined

  if (entrada.motivo === 'reserva' && entrada.reserva) {
    reserva = {
      id: nuevoId('res'),
      mensajeId: idMensaje,
      nombre: entrada.nombre,
      telefono: entrada.telefono,
      email: entrada.email,
      fecha: entrada.reserva.fecha,
      hora: entrada.reserva.hora,
      personas: entrada.reserva.personas,
      notas: entrada.mensaje,
      estado: 'pendiente',
      origen: 'web',
      creadoEn: ahora,
    }
  }

  if (entrada.motivo === 'encargo' && entrada.encargo) {
    encargo = {
      id: nuevoId('enc'),
      mensajeId: idMensaje,
      nombre: entrada.nombre,
      telefono: entrada.telefono,
      email: entrada.email,
      tipo: entrada.encargo.tipo,
      descripcion: entrada.mensaje,
      fechaRecogida: entrada.encargo.fechaRecogida,
      importe: null,
      estado: 'pendiente',
      origen: 'web',
      creadoEn: ahora,
    }
  }

  const mensaje: Mensaje = {
    id: idMensaje,
    motivo: entrada.motivo,
    nombre: entrada.nombre,
    email: entrada.email,
    telefono: entrada.telefono,
    mensaje: entrada.mensaje,
    creadoEn: ahora,
    estado: 'nuevo',
    notaInterna: '',
    derivadoEn: reserva?.id ?? encargo?.id,
  }

  actualizarDatos((datos) => ({
    ...datos,
    mensajes: [mensaje, ...datos.mensajes],
    reservas: reserva ? [reserva, ...datos.reservas] : datos.reservas,
    encargos: encargo ? [encargo, ...datos.encargos] : datos.encargos,
  }))

  return { mensaje, reserva, encargo }
}
