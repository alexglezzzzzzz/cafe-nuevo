import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../../lib/sesion'
import { validarCorreo } from '../../lib/validacion'
import { Aviso, Boton, Entrada } from '../../components/ui'
import { MarcoAcceso } from './MarcoAcceso'

export function Entrar() {
  const navegar = useNavigate()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [fallo, setFallo] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setFallo(null)

    const fallos: Record<string, string> = {}
    const errorCorreo = validarCorreo(correo)
    if (errorCorreo) fallos.email = errorCorreo
    if (!clave) fallos.clave = 'Escribe tu contraseña.'
    setErrores(fallos)
    if (Object.keys(fallos).length > 0) return

    setEntrando(true)
    await new Promise((r) => setTimeout(r, 500))
    const resultado = iniciarSesion(correo, clave)
    setEntrando(false)

    if (!resultado.ok) {
      setFallo(resultado.error)
      return
    }

    navegar(
      resultado.valor.onboardingCompletado ? '/panel' : '/panel/bienvenida',
      { replace: true },
    )
  }

  return (
    <MarcoAcceso
      titulo="Acceso del equipo"
      descripcion="Entra para gestionar los mensajes, la carta y las reservas."
      pie={
        <span className="text-cafe-600">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/acceso/registro"
            className="font-medium text-terracota-600 underline underline-offset-4"
          >
            Créala aquí
          </Link>
        </span>
      }
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        {fallo && <Aviso tipo="atencion">{fallo}</Aviso>}

        <Entrada
          etiqueta="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          placeholder="tu@cafenuevo.es"
          value={correo}
          onChange={(e) => {
            setCorreo(e.target.value)
            setErrores((x) => ({ ...x, email: '' }))
          }}
          error={errores.email || undefined}
        />

        <div>
          <Entrada
            etiqueta="Contraseña"
            name="clave"
            type="password"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(e) => {
              setClave(e.target.value)
              setErrores((x) => ({ ...x, clave: '' }))
            }}
            error={errores.clave || undefined}
          />
          <Link
            to="/acceso/recuperar"
            className="mt-1.5 inline-block py-1 text-sm text-cafe-500 underline underline-offset-4 hover:text-cafe-700"
          >
            No me acuerdo de la contraseña
          </Link>
        </div>

        <Boton type="submit" tamano="lg" anchoCompleto disabled={entrando}>
          {entrando ? 'Entrando…' : 'Entrar'}
        </Boton>
      </form>
    </MarcoAcceso>
  )
}
