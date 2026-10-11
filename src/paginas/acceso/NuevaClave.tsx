import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cambiarClave, comprobarVale, iniciarSesion } from '../../lib/sesion'
import { Aviso, Boton, Entrada } from '../../components/ui'
import { MarcoAcceso } from './MarcoAcceso'

const MINIMO_CLAVE = 8

export function NuevaClave() {
  const { token = '' } = useParams()
  const navegar = useNavigate()
  const [clave, setClave] = useState('')
  const [repetida, setRepetida] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)

  const comprobacion = comprobarVale(token)

  if (!comprobacion.ok) {
    return (
      <MarcoAcceso
        titulo="Este enlace no vale"
        descripcion="Puede que haya caducado o que ya lo hayas usado."
        pie={
          <Link
            to="/acceso"
            className="text-cafe-600 underline underline-offset-4"
          >
            Volver a la pantalla de acceso
          </Link>
        }
      >
        <div className="space-y-5">
          <Aviso tipo="atencion">{comprobacion.error}</Aviso>
          <Boton
            variante="contorno"
            anchoCompleto
            onClick={() => navegar('/acceso/recuperar')}
          >
            Pedir un enlace nuevo
          </Boton>
        </div>
      </MarcoAcceso>
    )
  }

  const usuario = comprobacion.valor

  async function enviar(e: FormEvent) {
    e.preventDefault()

    const fallos: Record<string, string> = {}
    if (clave.length < MINIMO_CLAVE) {
      fallos.clave = `La contraseña necesita al menos ${MINIMO_CLAVE} caracteres.`
    }
    if (repetida !== clave) fallos.repetida = 'Las dos contraseñas no coinciden.'
    setErrores(fallos)
    if (Object.keys(fallos).length > 0) return

    setGuardando(true)
    await new Promise((r) => setTimeout(r, 500))
    const resultado = cambiarClave(token, clave)

    if (!resultado.ok) {
      setGuardando(false)
      setErrores({ clave: resultado.error })
      return
    }

    // Se entra directamente con la contraseña recién puesta.
    const entrada = iniciarSesion(resultado.valor.email, clave)
    setGuardando(false)
    if (entrada.ok) {
      navegar(
        entrada.valor.onboardingCompletado ? '/panel' : '/panel/bienvenida',
        { replace: true },
      )
    } else {
      navegar('/acceso', { replace: true })
    }
  }

  return (
    <MarcoAcceso
      titulo="Nueva contraseña"
      descripcion={`Estás cambiando la contraseña de ${usuario.nombre}.`}
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
        <Entrada
          etiqueta="Contraseña nueva"
          name="clave"
          type="password"
          autoComplete="new-password"
          required
          autoFocus
          value={clave}
          onChange={(e) => {
            setClave(e.target.value)
            setErrores((x) => ({ ...x, clave: '' }))
          }}
          error={errores.clave || undefined}
          ayuda={`Mínimo ${MINIMO_CLAVE} caracteres.`}
        />
        <Entrada
          etiqueta="Repítela"
          name="repetida"
          type="password"
          autoComplete="new-password"
          required
          value={repetida}
          onChange={(e) => {
            setRepetida(e.target.value)
            setErrores((x) => ({ ...x, repetida: '' }))
          }}
          error={errores.repetida || undefined}
        />
        <Boton type="submit" tamano="lg" anchoCompleto disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar y entrar'}
        </Boton>
      </form>
    </MarcoAcceso>
  )
}
