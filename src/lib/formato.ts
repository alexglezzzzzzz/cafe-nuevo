// Formateo de precios, fechas y horas en español de España.

import type { DiaSemana } from './tipos'

/**
 * El momento en que se carga la aplicación, congelado.
 *
 * Los componentes lo usan en lugar de llamar a new Date() durante el render:
 * así son puros y no producen resultados distintos en cada repintado.
 */
const AHORA = new Date()

export const ANIO_ACTUAL = AHORA.getFullYear()

/** Hoy en formato "2026-10-11", para comparar con fechas guardadas. */
export const HOY_ISO = [
  AHORA.getFullYear(),
  String(AHORA.getMonth() + 1).padStart(2, '0'),
  String(AHORA.getDate()).padStart(2, '0'),
].join('-')

const euros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function precio(valor: number): string {
  return euros.format(valor)
}

export const nombreDia: Record<DiaSemana, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

export const nombreDiaCorto: Record<DiaSemana, string> = {
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
  7: 'Dom',
}

/** Día de la semana de hoy en formato ISO (1 = lunes … 7 = domingo). */
export function diaDeHoy(): DiaSemana {
  const js = AHORA.getDay() // 0 = domingo
  return (js === 0 ? 7 : js) as DiaSemana
}

/** "2026-10-18" → "domingo, 18 de octubre" */
export function fechaLarga(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** "2026-10-18" → "18 oct" */
export function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/** Instante ISO → "hace 3 horas", "ayer", "hace 4 días" */
export function hace(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const minutos = Math.round((Date.now() - d.getTime()) / 60000)
  if (minutos < 1) return 'ahora mismo'
  if (minutos < 60) return `hace ${minutos} min`

  const horas = Math.round(minutos / 60)
  if (horas < 24) return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`

  const dias = Math.round(horas / 24)
  if (dias === 1) return 'ayer'
  if (dias < 30) return `hace ${dias} días`

  const meses = Math.round(dias / 30)
  return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`
}

/** Instante ISO → "11 oct, 14:32" */
export function fechaYHora(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Primera letra en mayúscula. */
export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
