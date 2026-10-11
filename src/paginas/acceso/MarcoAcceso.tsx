import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useDatos } from '../../lib/useDatos'

/** Armazón común de las pantallas de entrada, registro y recuperación. */
export function MarcoAcceso({
  titulo,
  descripcion,
  children,
  pie,
}: {
  titulo: string
  descripcion: string
  children: ReactNode
  pie?: ReactNode
}) {
  const { negocio } = useDatos()

  return (
    <div className="flex min-h-dvh flex-col bg-crema-100">
      <header className="px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="fuente-display text-xl text-cafe-800 transition-colors hover:text-cafe-600"
        >
          {negocio.nombre}
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="fuente-display text-3xl text-cafe-900">{titulo}</h1>
          <p className="mt-2 text-cafe-600">{descripcion}</p>

          <div className="mt-7 rounded-2xl border border-cafe-200/70 bg-crema-50 p-6 sm:p-7">
            {children}
          </div>

          {pie && <div className="mt-5 text-center text-sm">{pie}</div>}
        </div>
      </main>

      <footer className="px-5 py-6 text-center text-sm text-cafe-500 sm:px-8">
        <Link to="/" className="inline-block py-1 underline underline-offset-4 hover:text-cafe-700">
          Volver a la web
        </Link>
      </footer>
    </div>
  )
}
