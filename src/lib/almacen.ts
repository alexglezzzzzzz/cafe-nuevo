// Capa de persistencia.
//
// Toda la aplicación lee y escribe aquí. No hay servidor: los datos viven en
// el localStorage del navegador, bajo el prefijo "cafenuevo:".
//
// - La primera vez que se abre la aplicación se siembran los datos iniciales.
// - Si la versión guardada no coincide con VERSION_DATOS, se vuelven a sembrar.
// - Si el navegador no permite localStorage (ventana privada, cookies
//   bloqueadas), se trabaja en memoria para que la aplicación siga funcionando.

import { construirSemilla } from '../data/semilla'
import type { DatosCafe, Sesion } from './tipos'

const PREFIJO = 'cafenuevo:'
const CLAVE_DATOS = `${PREFIJO}datos`
const CLAVE_VERSION = `${PREFIJO}version`
const CLAVE_SESION = `${PREFIJO}sesion`

/** Subir este número fuerza una nueva siembra en los navegadores existentes. */
export const VERSION_DATOS = '3'

// ------------------------------------------------- Acceso de bajo nivel

let memoria = new Map<string, string>()
let hayLocalStorage: boolean | null = null

function disponible(): boolean {
  if (hayLocalStorage !== null) return hayLocalStorage
  try {
    const prueba = `${PREFIJO}__prueba`
    window.localStorage.setItem(prueba, '1')
    window.localStorage.removeItem(prueba)
    hayLocalStorage = true
  } catch {
    hayLocalStorage = false
  }
  return hayLocalStorage
}

/** true si los datos se están guardando solo en memoria (se perderán al salir). */
export function soloEnMemoria(): boolean {
  return !disponible()
}

function leerCrudo(clave: string): string | null {
  if (!disponible()) return memoria.get(clave) ?? null
  try {
    return window.localStorage.getItem(clave)
  } catch {
    return null
  }
}

function escribirCrudo(clave: string, valor: string): void {
  if (!disponible()) {
    memoria.set(clave, valor)
    return
  }
  try {
    window.localStorage.setItem(clave, valor)
  } catch {
    // Cuota agotada: se cae a memoria para no romper la sesión en curso.
    hayLocalStorage = false
    memoria.set(clave, valor)
  }
}

function borrarCrudo(clave: string): void {
  if (!disponible()) {
    memoria.delete(clave)
    return
  }
  try {
    window.localStorage.removeItem(clave)
  } catch {
    memoria.delete(clave)
  }
}

// ------------------------------------------------------- Avisos de cambio

type Oyente = () => void
const oyentes = new Set<Oyente>()

/** Registra una función que se ejecuta cada vez que cambian los datos. */
export function suscribir(oyente: Oyente): () => void {
  oyentes.add(oyente)
  return () => oyentes.delete(oyente)
}

function avisar(): void {
  oyentes.forEach((o) => o())
}

// ------------------------------------------------------------ Datos

let cache: DatosCafe | null = null

function sembrar(): DatosCafe {
  const datos = construirSemilla()
  escribirCrudo(CLAVE_DATOS, JSON.stringify(datos))
  escribirCrudo(CLAVE_VERSION, VERSION_DATOS)
  cache = datos
  return datos
}

/**
 * Prepara los datos. Se llama una vez al arrancar la aplicación.
 * Devuelve true si ha tenido que sembrar.
 */
export function iniciarDatos(): boolean {
  const version = leerCrudo(CLAVE_VERSION)
  const guardados = leerCrudo(CLAVE_DATOS)

  if (!guardados || version !== VERSION_DATOS) {
    sembrar()
    return true
  }

  try {
    cache = JSON.parse(guardados) as DatosCafe
    return false
  } catch {
    // El contenido guardado no es válido: se siembra de nuevo.
    sembrar()
    return true
  }
}

/** Lectura de todos los datos. */
export function leerDatos(): DatosCafe {
  if (!cache) iniciarDatos()
  // iniciarDatos() siempre deja la caché lista; sembrar() es la red de
  // seguridad para que el tipo de retorno nunca sea nulo.
  return cache ?? sembrar()
}

/** Escritura de todos los datos. */
export function escribirDatos(datos: DatosCafe): void {
  cache = datos
  escribirCrudo(CLAVE_DATOS, JSON.stringify(datos))
  avisar()
}

/**
 * Modifica los datos aplicando una función al estado actual.
 * Es la forma recomendada de escribir desde el resto de la aplicación.
 */
export function actualizarDatos(
  cambio: (datos: DatosCafe) => DatosCafe,
): DatosCafe {
  const siguiente = cambio(leerDatos())
  escribirDatos(siguiente)
  return siguiente
}

/** Vuelve a escribir los datos iniciales y cierra la sesión abierta. */
export function reiniciarDatos(): DatosCafe {
  cerrarSesion()
  const datos = sembrar()
  avisar()
  return datos
}

/** Borra por completo el rastro de la aplicación en este navegador. */
export function borrarTodo(): void {
  borrarCrudo(CLAVE_DATOS)
  borrarCrudo(CLAVE_VERSION)
  borrarCrudo(CLAVE_SESION)
  cache = null
  cacheSesion = null
  sesionLeida = true
  memoria = new Map()
  avisar()
}

// ----------------------------------------------------------- Sesión

/**
 * La sesión se guarda en memoria además de en localStorage.
 *
 * No es una optimización: useSyncExternalStore compara por referencia y entra
 * en un bucle infinito si cada lectura devuelve un objeto nuevo, que es lo
 * que ocurriría al hacer JSON.parse cada vez.
 */
let cacheSesion: Sesion | null = null
let sesionLeida = false

export function leerSesion(): Sesion | null {
  if (sesionLeida) return cacheSesion

  const crudo = leerCrudo(CLAVE_SESION)
  cacheSesion = null
  if (crudo) {
    try {
      cacheSesion = JSON.parse(crudo) as Sesion
    } catch {
      cacheSesion = null
    }
  }
  sesionLeida = true
  return cacheSesion
}

export function guardarSesion(sesion: Sesion): void {
  escribirCrudo(CLAVE_SESION, JSON.stringify(sesion))
  cacheSesion = sesion
  sesionLeida = true
  avisar()
}

export function cerrarSesion(): void {
  borrarCrudo(CLAVE_SESION)
  cacheSesion = null
  sesionLeida = true
  avisar()
}

// -------------------------------------------------------------- Varios

/** Identificador único para entidades nuevas. */
export function nuevoId(prefijo: string): string {
  const azar = Math.random().toString(36).slice(2, 8)
  return `${prefijo}-${Date.now().toString(36)}${azar}`
}
