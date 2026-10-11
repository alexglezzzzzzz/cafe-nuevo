import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrar } from '../../lib/sesion'
import { validarCorreo, validarNombre } from '../../lib/validacion'
import { Aviso, Boton, Entrada } from '../../components/ui'
import { MarcoAcceso } from './MarcoAcceso'

const MINIMO_CLAVE = 8

export function Registro() {
  const navegar = useNavigate()
  const [campos, setCampos] = useState({
    nombre: '',
    email: '',
    clave: '',
    repetida: '',
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [fallo, setFallo] = useState<string | null>(null)
  const [creando, setCreando] = useState(false)

  function cambiar(campo: keyof typeof campos, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: '' }))
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setFallo(null)

    const fallos: Record<string, string> = {}
    const errorNombre = validarNombre(campos.nombre)
    if (errorNombre) fallos.nombre = errorNombre
    const errorCorreo = validarCorreo(campos.email)
    if (errorCorreo) fallos.email = errorCorreo
    if (campos.clave.length < MINIMO_CLAVE) {
      fallos.clave = `La contraseña necesita al menos ${MINIMO_CLAVE} caracteres.`
    }
    if (campos.repetida !== campos.clave) {
      fallos.repetida = 'Las dos contraseñas no coinciden.'
    }
    setErrores(fallos)
    if (Object.keys(fallos).length > 0) return

    setCreando(true)
    await new Promise((r) => setTimeout(r, 500))
    const resultado = registrar(campos.nombre, campos.email, campos.clave)
    setCreando(false)

    if (!resultado.ok) {
      setFallo(resultado.error)
      return
    }
    navegar('/panel/bienvenida', { replace: true })
  }

  return (
    <MarcoAcceso
      titulo="Crear cuenta"
      descripcion="Para quien se incorpora al equipo de la cafetería."
      pie={
        <span className="text-cafe-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/acceso"
            className="font-medium text-terracota-600 underline underline-offset-4"
          >
            Entra por aquí
          </Link>
        </span>
      }
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        {fallo && <Aviso tipo="atencion">{fallo}</Aviso>}

        <Entrada
          etiqueta="Nombre y apellidos"
          name="nombre"
          autoComplete="name"
          required
          autoFocus
          placeholder="Tu nombre"
          value={campos.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          error={errores.nombre || undefined}
        />
        <Entrada
          etiqueta="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@cafenuevo.es"
          value={campos.email}
          onChange={(e) => cambiar('email', e.target.value)}
          error={errores.email || undefined}
        />
        <Entrada
          etiqueta="Contraseña"
          name="clave"
          type="password"
          autoComplete="new-password"
          required
          value={campos.clave}
          onChange={(e) => cambiar('clave', e.target.value)}
          error={errores.clave || undefined}
          ayuda={`Mínimo ${MINIMO_CLAVE} caracteres.`}
        />
        <Entrada
          etiqueta="Repite la contraseña"
          name="repetida"
          type="password"
          autoComplete="new-password"
          required
          value={campos.repetida}
          onChange={(e) => cambiar('repetida', e.target.value)}
          error={errores.repetida || undefined}
        />

        <Aviso tipo="informacion">
          Las cuentas nuevas entran con permisos de sala. La propietaria puede
          ampliarlos desde Equipo.
        </Aviso>

        <Boton type="submit" tamano="lg" anchoCompleto disabled={creando}>
          {creando ? 'Creando la cuenta…' : 'Crear cuenta'}
        </Boton>
      </form>
    </MarcoAcceso>
  )
}
