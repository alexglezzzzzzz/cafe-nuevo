import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pedirRecuperacion } from '../../lib/sesion'
import { validarCorreo } from '../../lib/validacion'
import { Aviso, Boton, Entrada } from '../../components/ui'
import { MarcoAcceso } from './MarcoAcceso'

export function Recuperar() {
  const navegar = useNavigate()
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pidiendo, setPidiendo] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const fallo = validarCorreo(correo)
    setError(fallo)
    if (fallo) return

    setPidiendo(true)
    await new Promise((r) => setTimeout(r, 600))
    const resultado = pedirRecuperacion(correo)
    setPidiendo(false)

    if (resultado.ok) {
      setToken(resultado.valor)
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <MarcoAcceso
        titulo="Listo"
        descripcion="Hemos preparado un enlace para que cambies la contraseña."
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
          <p className="text-cafe-600">
            Si <strong className="text-cafe-800">{correo.trim()}</strong>{' '}
            corresponde a una cuenta del equipo, el enlace de cambio ya está
            disponible.
          </p>

          {token ? (
            <>
              <Aviso tipo="informacion" titulo="Cómo funciona esto aquí">
                Esta web no tiene servidor de correo detrás, así que el enlace
                se entrega en esta misma pantalla en lugar de llegarte al
                buzón. Vale durante treinta minutos y solo se puede usar una
                vez.
              </Aviso>
              <Boton
                variante="principal"
                tamano="lg"
                anchoCompleto
                onClick={() => navegar(`/acceso/recuperar/${token}`)}
              >
                Cambiar la contraseña
              </Boton>
            </>
          ) : (
            <Aviso tipo="informacion" titulo="Cómo funciona esto aquí">
              Esta web no tiene servidor de correo detrás. Si la cuenta
              existiera, aquí aparecería el enlace para cambiar la contraseña.
            </Aviso>
          )}
        </div>
      </MarcoAcceso>
    )
  }

  return (
    <MarcoAcceso
      titulo="Recuperar la contraseña"
      descripcion="Dinos con qué correo entras y te damos un enlace para cambiarla."
      pie={
        <Link
          to="/acceso"
          className="text-cafe-600 underline underline-offset-4"
        >
          Volver a la pantalla de acceso
        </Link>
      }
    >
      <form onSubmit={enviar} noValidate className="space-y-5">
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
            setError(null)
          }}
          error={error || undefined}
        />
        <Boton type="submit" tamano="lg" anchoCompleto disabled={pidiendo}>
          {pidiendo ? 'Preparando el enlace…' : 'Enviar enlace'}
        </Boton>
      </form>
    </MarcoAcceso>
  )
}
