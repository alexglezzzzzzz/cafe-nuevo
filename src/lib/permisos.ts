// Roles y permisos del panel.
//
// Cada rol ve un conjunto distinto de secciones y, dentro de ellas, puede
// mirar o puede editar. Esto se define una sola vez aquí y lo consume tanto
// el menú del panel como cada pantalla.

import type { Rol } from './tipos'

export type Seccion =
  | 'inicio'
  | 'mensajes'
  | 'reservas'
  | 'encargos'
  | 'carta'
  | 'horarios'
  | 'novedades'
  | 'equipo'
  | 'ajustes'

export type Nivel = 'ninguno' | 'lectura' | 'edicion'

const matriz: Record<Rol, Record<Seccion, Nivel>> = {
  propietaria: {
    inicio: 'lectura',
    mensajes: 'edicion',
    reservas: 'edicion',
    encargos: 'edicion',
    carta: 'edicion',
    horarios: 'edicion',
    novedades: 'edicion',
    equipo: 'edicion',
    ajustes: 'edicion',
  },
  encargado: {
    inicio: 'lectura',
    mensajes: 'edicion',
    reservas: 'edicion',
    encargos: 'edicion',
    carta: 'edicion',
    horarios: 'edicion',
    novedades: 'edicion',
    equipo: 'lectura',
    ajustes: 'ninguno',
  },
  sala: {
    inicio: 'lectura',
    mensajes: 'edicion',
    reservas: 'edicion',
    encargos: 'edicion',
    carta: 'lectura',
    horarios: 'lectura',
    novedades: 'lectura',
    equipo: 'ninguno',
    ajustes: 'ninguno',
  },
}

export function nivelDe(rol: Rol, seccion: Seccion): Nivel {
  return matriz[rol][seccion]
}

export function puedeVer(rol: Rol, seccion: Seccion): boolean {
  return nivelDe(rol, seccion) !== 'ninguno'
}

export function puedeEditar(rol: Rol, seccion: Seccion): boolean {
  return nivelDe(rol, seccion) === 'edicion'
}

export const nombreRol: Record<Rol, string> = {
  propietaria: 'Propietaria',
  encargado: 'Encargado',
  sala: 'Sala',
}

export const descripcionRol: Record<Rol, string> = {
  propietaria: 'Acceso completo, incluidos equipo y ajustes del negocio.',
  encargado: 'Gestiona el día a día y el contenido de la web. No toca el equipo.',
  sala: 'Atiende mensajes, reservas y encargos. Consulta la carta.',
}
