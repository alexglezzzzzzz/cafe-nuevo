// Modelo de datos de Café Nuevo.
// Todo lo que vive en localStorage está descrito aquí.

// ---------------------------------------------------------------- Negocio

export interface Direccion {
  calle: string
  codigoPostal: string
  ciudad: string
  barrio: string
}

export interface Redes {
  instagram: string
  facebook: string
}

export interface Foto {
  /** Ruta dentro de /public. */
  archivo: string
  /** Texto alternativo, obligatorio: estas fotos comunican ambiente. */
  alt: string
}

export interface FotosNegocio {
  portada: Foto
  historia: Foto
  cafe: Foto
  reposteria: Foto
  tostador: Foto
}

export interface Negocio {
  nombre: string
  lema: string
  descripcionCorta: string
  historia: string[]
  fundadoEn: number
  direccion: Direccion
  telefono: string
  email: string
  redes: Redes
  comoLlegar: string[]
  fotos: FotosNegocio
}

// ---------------------------------------------------------------- Horarios

/** 1 = lunes … 7 = domingo (ISO 8601). */
export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface TramoDia {
  dia: DiaSemana
  cerrado: boolean
  apertura: string // "07:30"
  cierre: string // "20:00"
}

export interface DiaEspecial {
  id: string
  fecha: string // "2026-10-12"
  motivo: string
  cerrado: boolean
  apertura?: string
  cierre?: string
}

export interface Horario {
  semana: TramoDia[]
  especiales: DiaEspecial[]
  nota: string
}

// ---------------------------------------------------------------- Carta

export type Alergeno =
  | 'gluten'
  | 'lactosa'
  | 'huevo'
  | 'frutos secos'
  | 'soja'
  | 'pescado'

export interface CategoriaCarta {
  id: string
  nombre: string
  descripcion: string
  orden: number
}

export interface ProductoCarta {
  id: string
  categoriaId: string
  nombre: string
  descripcion: string
  /** En euros. 2.4 = 2,40 € */
  precio: number
  disponible: boolean
  destacado: boolean
  alergenos: Alergeno[]
  orden: number
}

// ---------------------------------------------------------------- Novedades

export interface Novedad {
  id: string
  titulo: string
  resumen: string
  cuerpo: string
  fecha: string // "2026-10-02"
  publicada: boolean
  etiqueta: string
}

// ---------------------------------------------------------------- Mensajes

export type MotivoMensaje = 'consulta' | 'reserva' | 'encargo'
export type EstadoMensaje = 'nuevo' | 'leido' | 'atendido'

export interface Mensaje {
  id: string
  motivo: MotivoMensaje
  nombre: string
  email: string
  telefono: string
  mensaje: string
  creadoEn: string // ISO completo
  estado: EstadoMensaje
  notaInterna: string
  /** Id de la reserva o encargo que generó este mensaje, si lo hubo. */
  derivadoEn?: string
}

// ---------------------------------------------------------------- Reservas

export type EstadoReserva =
  | 'pendiente'
  | 'confirmada'
  | 'cancelada'
  | 'completada'
export type OrigenEntrada = 'web' | 'telefono' | 'local'

export interface Reserva {
  id: string
  mensajeId?: string
  nombre: string
  telefono: string
  email: string
  fecha: string // "2026-10-18"
  hora: string // "11:30"
  personas: number
  notas: string
  estado: EstadoReserva
  origen: OrigenEntrada
  creadoEn: string
}

// ---------------------------------------------------------------- Encargos

export type TipoEncargo =
  | 'tarta'
  | 'bandeja salada'
  | 'café en grano'
  | 'catering'
  | 'otro'
export type EstadoEncargo =
  | 'pendiente'
  | 'aceptado'
  | 'listo'
  | 'entregado'
  | 'cancelado'

export interface Encargo {
  id: string
  mensajeId?: string
  nombre: string
  telefono: string
  email: string
  tipo: TipoEncargo
  descripcion: string
  fechaRecogida: string // "2026-10-20"
  importe: number | null
  estado: EstadoEncargo
  origen: OrigenEntrada
  creadoEn: string
}

// ---------------------------------------------------------------- Equipo

export type Rol = 'propietaria' | 'encargado' | 'sala'

export interface Usuario {
  id: string
  nombre: string
  email: string
  /** Acceso simulado: se guarda tal cual en localStorage, sin cifrar. */
  clave: string
  rol: Rol
  activo: boolean
  creadoEn: string
  ultimoAcceso: string | null
  onboardingCompletado: boolean
}

export interface Sesion {
  usuarioId: string
  iniciadaEn: string
}

/**
 * Petición de cambio de contraseña.
 *
 * Sin servidor no hay forma de enviar un correo, así que el enlace se
 * entrega en la propia pantalla. El vale caduca y solo sirve una vez.
 */
export interface Recuperacion {
  token: string
  usuarioId: string
  creadaEn: string
  /** Instante ISO a partir del cual deja de valer. */
  caducaEn: string
  usada: boolean
}

// ---------------------------------------------------------------- Conjunto

/** Forma completa de los datos persistidos. */
export interface DatosCafe {
  negocio: Negocio
  horario: Horario
  categorias: CategoriaCarta[]
  productos: ProductoCarta[]
  novedades: Novedad[]
  mensajes: Mensaje[]
  reservas: Reserva[]
  encargos: Encargo[]
  usuarios: Usuario[]
  recuperaciones: Recuperacion[]
}
