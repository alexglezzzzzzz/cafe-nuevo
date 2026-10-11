import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatos } from '../../lib/useDatos'

const enlaces = [
  { href: '#carta', texto: 'Carta' },
  { href: '#historia', texto: 'La casa' },
  { href: '#novedades', texto: 'Novedades' },
  { href: '#visitanos', texto: 'Visítanos' },
]

export function Navegacion() {
  const { negocio } = useDatos()
  const [abierto, setAbierto] = useState(false)
  const [desplazada, setDesplazada] = useState(false)

  useEffect(() => {
    const alDesplazar = () => setDesplazada(window.scrollY > 16)
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  // Con el menú desplegado no se desplaza el fondo.
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        desplazada || abierto
          ? 'border-b border-cafe-200/70 bg-crema-100/95 backdrop-blur'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a
          href="#inicio"
          className="fuente-display text-xl leading-none text-cafe-800"
        >
          {negocio.nombre}
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="rounded-lg px-3 py-2 text-[0.9375rem] text-cafe-600 transition-colors hover:bg-crema-200 hover:text-cafe-800"
            >
              {e.texto}
            </a>
          ))}
          <a
            href="#contacto"
            className="ml-2 rounded-lg bg-cafe-700 px-4 py-2 text-[0.9375rem] font-medium text-crema-50 transition-colors hover:bg-cafe-800"
          >
            Escríbenos
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar el menú' : 'Abrir el menú'}
          className="-mr-2 rounded-lg p-2 text-cafe-700 transition-colors hover:bg-crema-200 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {abierto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="border-t border-cafe-200/70 bg-crema-100 px-5 py-3 md:hidden"
        >
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className="block rounded-lg px-3 py-3 text-cafe-700 transition-colors hover:bg-crema-200"
            >
              {e.texto}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setAbierto(false)}
            className="mt-2 block rounded-lg bg-cafe-700 px-3 py-3 text-center font-medium text-crema-50"
          >
            Escríbenos
          </a>
          <Link
            to="/acceso"
            className="mt-3 block px-3 py-2 text-center text-sm text-cafe-500 underline underline-offset-4"
          >
            Acceso del equipo
          </Link>
        </nav>
      )}
    </header>
  )
}
