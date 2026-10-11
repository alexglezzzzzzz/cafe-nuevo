// Validación del formulario de contacto.
//
// Las reglas viven aquí y no dentro del componente, para poder razonar sobre
// ellas de un vistazo y reutilizarlas cuando el panel permita dar de alta
// reservas a mano.

import type { DiaSemana, Horario } from './tipos'
import { HOY_ISO, nombreDia } from './formato'

export type Errores = Record<string, string>

const CORREO = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function validarNombre(valor: string): string | null {
  const limpio = valor.trim()
  if (!limpio) return 'Dinos cómo te llamas.'
  if (limpio.length < 2) return 'El nombre parece demasiado corto.'
  return null
}

export function validarCorreo(valor: string): string | null {
  const limpio = valor.trim()
  if (!limpio) return 'Necesitamos un correo para responderte.'
  if (!CORREO.test(limpio)) return 'Ese correo no parece válido.'
  return null
}

export function validarTelefono(
  valor: string,
  obligatorio: boolean,
): string | null {
  const limpio = valor.trim()
  if (!limpio) {
    return obligatorio ? 'Para esto necesitamos un teléfono.' : null
  }
  const digitos = limpio.replace(/\D/g, '')
  if (digitos.length < 9) return 'Faltan dígitos en el teléfono.'
  if (digitos.length > 15) return 'Ese teléfono tiene demasiados dígitos.'
  return null
}

export function validarMensaje(valor: string): string | null {
  const limpio = valor.trim()
  if (!limpio) return 'Cuéntanos qué necesitas.'
  if (limpio.length < 10) return 'Escríbenos un poco más y te ayudamos mejor.'
  if (limpio.length > 1000) return 'El mensaje es demasiado largo.'
  return null
}

/** Día de la semana ISO (1 = lunes … 7 = domingo) de una fecha "2026-10-18". */
function diaDeFecha(iso: string): DiaSemana {
  const js = new Date(`${iso}T00:00:00`).getDay()
  return (js === 0 ? 7 : js) as DiaSemana
}

export function validarFechaFutura(
  valor: string,
  etiqueta: string,
): string | null {
  if (!valor) return `Elige ${etiqueta}.`
  if (valor < HOY_ISO) return 'Esa fecha ya ha pasado.'
  return null
}

/**
 * Comprueba que el día esté abierto, teniendo en cuenta los días especiales.
 * Devuelve el tramo horario aplicable, o un error si ese día no se abre.
 */
export function tramoDelDia(
  horario: Horario,
  fecha: string,
): { apertura: string; cierre: string } | { error: string } {
  const especial = horario.especiales.find((e) => e.fecha === fecha)
  if (especial) {
    if (especial.cerrado) {
      return { error: `Ese día cerramos por ${especial.motivo.toLowerCase()}.` }
    }
    if (especial.apertura && especial.cierre) {
      return { apertura: especial.apertura, cierre: especial.cierre }
    }
  }

  const dia = diaDeFecha(fecha)
  const tramo = horario.semana.find((d) => d.dia === dia)
  if (!tramo || tramo.cerrado) {
    return { error: `Los ${nombreDia[dia].toLowerCase()} cerramos.` }
  }
  return { apertura: tramo.apertura, cierre: tramo.cierre }
}

export function validarHora(
  hora: string,
  fecha: string,
  horario: Horario,
): string | null {
  if (!hora) return 'Elige una hora.'
  if (!fecha) return null // el error de la fecha ya lo cuenta

  const tramo = tramoDelDia(horario, fecha)
  if ('error' in tramo) return tramo.error

  if (hora < tramo.apertura || hora > tramo.cierre) {
    return `Ese día abrimos de ${tramo.apertura} a ${tramo.cierre}.`
  }
  return null
}

export function validarPersonas(valor: string): string | null {
  if (!valor) return 'Dinos cuántos sois.'
  const n = Number(valor)
  if (!Number.isInteger(n) || n < 1) return 'Tiene que ser al menos una persona.'
  if (n > 20) return 'Para más de veinte, llámanos y lo organizamos.'
  return null
}
