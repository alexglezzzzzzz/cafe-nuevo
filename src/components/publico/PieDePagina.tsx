import { Link } from 'react-router-dom'
import { useDatos } from '../../lib/useDatos'
import { ANIO_ACTUAL, diaDeHoy, nombreDiaCorto } from '../../lib/formato'

export function PieDePagina() {
  const { negocio, horario } = useDatos()
  const hoy = horario.semana.find((d) => d.dia === diaDeHoy())

  return (
    <footer className="border-t border-cafe-200/70 bg-cafe-900 px-5 py-14 text-crema-200 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="fuente-display text-2xl text-crema-50">
              {negocio.nombre}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-crema-200/70">
              {negocio.lema}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-crema-50">Dónde</h3>
            <address className="mt-3 text-sm leading-relaxed text-crema-200/70 not-italic">
              {negocio.direccion.calle}
              <br />
              {negocio.direccion.codigoPostal} {negocio.direccion.ciudad}
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-crema-50">Contacto</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-crema-200/70">
              <li>{negocio.telefono}</li>
              <li>{negocio.email}</li>
              <li>{negocio.redes.instagram}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-crema-50">Hoy</h3>
            <p className="mt-3 text-sm text-crema-200/70">
              {hoy
                ? hoy.cerrado
                  ? `${nombreDiaCorto[hoy.dia]} · cerrado`
                  : `${nombreDiaCorto[hoy.dia]} · ${hoy.apertura} – ${hoy.cierre}`
                : ''}
            </p>
            <a
              href="#visitanos"
              className="mt-1 inline-block py-1 text-sm text-terracota-300 underline underline-offset-4 transition-colors hover:text-terracota-100"
            >
              Ver la semana entera
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-crema-50/10 pt-6 text-sm text-crema-200/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ANIO_ACTUAL} {negocio.nombre}
          </p>
          <nav aria-label="Enlaces legales" className="-my-1 flex flex-wrap gap-x-5">
            <Link
              to="/aviso-legal"
              className="py-1 transition-colors hover:text-crema-100"
            >
              Aviso legal
            </Link>
            <Link
              to="/privacidad"
              className="py-1 transition-colors hover:text-crema-100"
            >
              Privacidad
            </Link>
            <Link
              to="/acceso"
              className="py-1 transition-colors hover:text-crema-100"
            >
              Acceso del equipo
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
