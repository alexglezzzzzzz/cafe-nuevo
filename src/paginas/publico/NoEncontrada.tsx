import { Link } from 'react-router-dom'
import { Navegacion } from '../../components/publico/Navegacion'
import { PieDePagina } from '../../components/publico/PieDePagina'

export function NoEncontrada() {
  return (
    <>
      <Navegacion />
      <main className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-lg text-center">
          <p className="fuente-display text-6xl text-cafe-300">404</p>
          <h1 className="fuente-display mt-4 text-3xl text-cafe-900">
            Aquí no hay nada
          </h1>
          <p className="mt-3 leading-relaxed text-cafe-600">
            La página que buscabas no existe o ha cambiado de sitio. Puedes
            volver al principio o echar un vistazo a la carta.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg bg-cafe-700 px-6 py-3 font-medium text-crema-50 transition-colors hover:bg-cafe-800"
            >
              Volver al inicio
            </Link>
            <Link
              to="/#carta"
              className="rounded-lg border border-cafe-300 px-6 py-3 font-medium text-cafe-700 transition-colors hover:bg-crema-200"
            >
              Ver la carta
            </Link>
          </div>
        </div>
      </main>
      <PieDePagina />
    </>
  )
}
