// Cómo se presentan los estados de cada entidad: texto y tono de la etiqueta.
// Vive fuera de los componentes para que lo compartan el inicio del panel,
// la bandeja y las pantallas de reservas y encargos.

import type { TonoEtiqueta } from '../components/ui'
import type {
  EstadoEncargo,
  EstadoMensaje,
  EstadoReserva,
  MotivoMensaje,
} from './tipos'

export const tonoMensaje: Record<EstadoMensaje, TonoEtiqueta> = {
  nuevo: 'cafe',
  leido: 'neutro',
  atendido: 'correcto',
}

export const textoMensaje: Record<EstadoMensaje, string> = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  atendido: 'Atendido',
}

export const textoMotivo: Record<MotivoMensaje, string> = {
  consulta: 'Consulta',
  reserva: 'Reserva',
  encargo: 'Encargo',
}

export const tonoReserva: Record<EstadoReserva, TonoEtiqueta> = {
  pendiente: 'aviso',
  confirmada: 'correcto',
  cancelada: 'apagado',
  completada: 'neutro',
}

export const textoReserva: Record<EstadoReserva, string> = {
  pendiente: 'Por confirmar',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  completada: 'Completada',
}

export const tonoEncargo: Record<EstadoEncargo, TonoEtiqueta> = {
  pendiente: 'aviso',
  aceptado: 'cafe',
  listo: 'correcto',
  entregado: 'neutro',
  cancelado: 'apagado',
}

export const textoEncargo: Record<EstadoEncargo, string> = {
  pendiente: 'Pendiente',
  aceptado: 'Aceptado',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}
