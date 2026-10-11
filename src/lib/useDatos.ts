// Puente entre el almacén y React.
//
// useDatos() devuelve los datos actuales y vuelve a renderizar el componente
// cada vez que alguien escribe, sin necesidad de pasar nada por props.

import { useSyncExternalStore } from 'react'
import { leerDatos, leerSesion, suscribir } from './almacen'
import type { DatosCafe, Sesion, Usuario } from './tipos'

export function useDatos(): DatosCafe {
  return useSyncExternalStore(suscribir, leerDatos, leerDatos)
}

export function useSesion(): Sesion | null {
  return useSyncExternalStore(suscribir, leerSesion, leerSesion)
}

/** Usuario con la sesión abierta, o null si no hay nadie dentro. */
export function useUsuario(): Usuario | null {
  const datos = useDatos()
  const sesion = useSesion()
  if (!sesion) return null
  return datos.usuarios.find((u) => u.id === sesion.usuarioId) ?? null
}
