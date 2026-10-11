import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { marcarOnboardingHecho } from '../../lib/sesion'
import { descripcionRol, nombreRol } from '../../lib/permisos'
import { useUsuario } from '../../lib/useDatos'
import { Boton } from '../../components/ui'

const pasos = [
  {
    titulo: 'Esto es el panel de Café Nuevo',
    cuerpo:
      'Desde aquí se gestiona el día a día del local: lo que llega por la web, las reservas, los encargos y lo que se publica de cara al público.',
  },
  {
    titulo: 'Todo lo que llega, en un sitio',
    cuerpo:
      'Cada mensaje del formulario entra en la bandeja. Si alguien pide mesa o encarga algo, además se crea su reserva o su encargo, con su propio estado, para que no se pierda nada por el camino.',
  },
  {
    titulo: 'Lo que cambias aquí se ve fuera',
    cuerpo:
      'La carta, los horarios y las novedades que gestiones en el panel son exactamente los que ve quien entra en la web. No hay dos sitios donde tocar lo mismo.',
  },
]

export function Bienvenida() {
  const usuario = useUsuario()
  const navegar = useNavigate()
  const [paso, setPaso] = useState(0)

  if (!usuario) return null

  const actual = pasos[paso]
  const ultimo = paso === pasos.length - 1

  function siguiente() {
    if (ultimo) {
      marcarOnboardingHecho(usuario!.id)
      navegar('/panel', { replace: true })
      return
    }
    setPaso((p) => p + 1)
  }

  function saltar() {
    marcarOnboardingHecho(usuario!.id)
    navegar('/panel', { replace: true })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-crema-100 px-5 py-10">
      <div className="w-full max-w-lg">
        <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
          Hola, {usuario.nombre.split(' ')[0]}
        </p>

        <div className="mt-4 rounded-2xl border border-cafe-200/70 bg-crema-50 p-7 sm:p-8">
          <h1 className="fuente-display text-2xl text-cafe-900 sm:text-3xl">
            {actual.titulo}
          </h1>
          <p className="mt-4 leading-relaxed text-cafe-600">{actual.cuerpo}</p>

          {ultimo && (
            <div className="mt-6 rounded-xl border border-cafe-200 bg-crema-100 p-4">
              <p className="text-sm font-semibold text-cafe-700">
                Tu acceso: {nombreRol[usuario.rol]}
              </p>
              <p className="mt-1 text-sm text-cafe-600">
                {descripcionRol[usuario.rol]}
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-1.5" aria-hidden="true">
              {pasos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === paso ? 'w-6 bg-cafe-700' : 'w-1.5 bg-cafe-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {!ultimo && (
                <Boton variante="sutil" onClick={saltar}>
                  Saltar
                </Boton>
              )}
              <Boton onClick={siguiente}>
                {ultimo ? 'Empezar' : 'Siguiente'}
              </Boton>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-cafe-500">
          Paso {paso + 1} de {pasos.length}
        </p>
      </div>
    </div>
  )
}
