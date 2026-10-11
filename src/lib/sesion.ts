// Acceso del equipo.
//
// Toda la autenticación es simulada y vive en el navegador. Las contraseñas
// se guardan tal cual, sin cifrar: sin servidor no hay forma de hacerlo bien,
// y fingir un cifrado sería peor que decirlo claramente.

import {
  actualizarDatos,
  cerrarSesion as borrarSesion,
  guardarSesion,
  leerDatos,
  nuevoId,
} from './almacen'
import type { Recuperacion, Rol, Usuario } from './tipos'

/** Minutos que vale un vale de recuperación. */
const MINUTOS_VALE = 30

export type Resultado<T> =
  | { ok: true; valor: T }
  | { ok: false; error: string }

function normalizar(correo: string): string {
  return correo.trim().toLowerCase()
}

function buscarPorCorreo(correo: string): Usuario | undefined {
  const buscado = normalizar(correo)
  return leerDatos().usuarios.find((u) => normalizar(u.email) === buscado)
}

// --------------------------------------------------------------- Entrar

export function iniciarSesion(
  correo: string,
  clave: string,
): Resultado<Usuario> {
  const usuario = buscarPorCorreo(correo)

  // El mismo mensaje para correo inexistente y contraseña incorrecta: así no
  // se puede averiguar quién tiene cuenta probando correos.
  if (!usuario || usuario.clave !== clave) {
    return { ok: false, error: 'El correo o la contraseña no son correctos.' }
  }

  if (!usuario.activo) {
    return {
      ok: false,
      error: 'Esta cuenta está desactivada. Habla con la propietaria.',
    }
  }

  const ahora = new Date().toISOString()
  actualizarDatos((datos) => ({
    ...datos,
    usuarios: datos.usuarios.map((u) =>
      u.id === usuario.id ? { ...u, ultimoAcceso: ahora } : u,
    ),
  }))
  guardarSesion({ usuarioId: usuario.id, iniciadaEn: ahora })

  return { ok: true, valor: { ...usuario, ultimoAcceso: ahora } }
}

export function salir(): void {
  borrarSesion()
}

// ------------------------------------------------------------ Registrarse

export function registrar(
  nombre: string,
  correo: string,
  clave: string,
): Resultado<Usuario> {
  if (buscarPorCorreo(correo)) {
    return { ok: false, error: 'Ya hay una cuenta con ese correo.' }
  }

  const ahora = new Date().toISOString()
  const usuario: Usuario = {
    id: nuevoId('usr'),
    nombre: nombre.trim(),
    email: normalizar(correo),
    clave,
    // Quien se registra entra con los permisos mínimos. La propietaria
    // puede cambiarle el rol desde Equipo.
    rol: 'sala' as Rol,
    activo: true,
    creadoEn: ahora,
    ultimoAcceso: ahora,
    onboardingCompletado: false,
  }

  actualizarDatos((datos) => ({
    ...datos,
    usuarios: [...datos.usuarios, usuario],
  }))
  guardarSesion({ usuarioId: usuario.id, iniciadaEn: ahora })

  return { ok: true, valor: usuario }
}

// -------------------------------------------------------- Recuperar clave

/**
 * Crea un vale de cambio de contraseña.
 *
 * Devuelve siempre ok para no revelar qué correos existen; el vale solo se
 * crea de verdad si la cuenta existe.
 */
export function pedirRecuperacion(correo: string): Resultado<string | null> {
  const usuario = buscarPorCorreo(correo)
  if (!usuario) return { ok: true, valor: null }

  const ahora = new Date()
  const caduca = new Date(ahora.getTime() + MINUTOS_VALE * 60_000)
  const vale: Recuperacion = {
    token: nuevoId('vale'),
    usuarioId: usuario.id,
    creadaEn: ahora.toISOString(),
    caducaEn: caduca.toISOString(),
    usada: false,
  }

  actualizarDatos((datos) => ({
    ...datos,
    // Se descartan los vales anteriores de esa misma persona.
    recuperaciones: [
      ...datos.recuperaciones.filter((r) => r.usuarioId !== usuario.id),
      vale,
    ],
  }))

  return { ok: true, valor: vale.token }
}

export function comprobarVale(token: string): Resultado<Usuario> {
  const datos = leerDatos()
  const vale = datos.recuperaciones.find((r) => r.token === token)

  if (!vale) return { ok: false, error: 'Este enlace no es válido.' }
  if (vale.usada) return { ok: false, error: 'Este enlace ya se ha usado.' }
  if (new Date(vale.caducaEn) < new Date()) {
    return { ok: false, error: 'Este enlace ha caducado. Pide uno nuevo.' }
  }

  const usuario = datos.usuarios.find((u) => u.id === vale.usuarioId)
  if (!usuario) return { ok: false, error: 'Este enlace no es válido.' }

  return { ok: true, valor: usuario }
}

export function cambiarClave(
  token: string,
  claveNueva: string,
): Resultado<Usuario> {
  const comprobacion = comprobarVale(token)
  if (!comprobacion.ok) return comprobacion

  const usuario = comprobacion.valor
  actualizarDatos((datos) => ({
    ...datos,
    usuarios: datos.usuarios.map((u) =>
      u.id === usuario.id ? { ...u, clave: claveNueva } : u,
    ),
    recuperaciones: datos.recuperaciones.map((r) =>
      r.token === token ? { ...r, usada: true } : r,
    ),
  }))

  return { ok: true, valor: { ...usuario, clave: claveNueva } }
}

// ------------------------------------------------------------ Onboarding

export function marcarOnboardingHecho(usuarioId: string): void {
  actualizarDatos((datos) => ({
    ...datos,
    usuarios: datos.usuarios.map((u) =>
      u.id === usuarioId ? { ...u, onboardingCompletado: true } : u,
    ),
  }))
}
