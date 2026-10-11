import { useDatos } from '../../lib/useDatos'
import {
  capitalizar,
  diaDeHoy,
  fechaLarga,
  HOY_ISO,
  nombreDia,
} from '../../lib/formato'

export function Visitanos() {
  const { negocio, horario } = useDatos()
  const hoy = diaDeHoy()
  const semana = [...horario.semana].sort((a, b) => a.dia - b.dia)

  const proximosEspeciales = horario.especiales
    .filter((e) => e.fecha >= HOY_ISO)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 3)

  return (
    <section
      id="visitanos"
      className="border-y border-cafe-200/60 bg-crema-200/40 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
            Visítanos
          </p>
          <h2 className="fuente-display mt-3 text-3xl text-cafe-900 sm:text-4xl">
            Dónde estamos y cuándo abrimos
          </h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Horarios */}
          <div className="rounded-2xl border border-cafe-200/70 bg-crema-50 p-6 sm:p-7">
            <h3 className="fuente-display text-xl text-cafe-800">Horario</h3>
            <dl className="mt-5">
              {semana.map((d) => {
                const esHoy = d.dia === hoy
                return (
                  <div
                    key={d.dia}
                    className={`flex items-baseline justify-between gap-4 rounded-lg px-3 py-2 ${
                      esHoy ? 'bg-crema-200' : ''
                    }`}
                  >
                    <dt
                      className={
                        esHoy
                          ? 'font-semibold text-cafe-800'
                          : 'text-cafe-600'
                      }
                    >
                      {nombreDia[d.dia]}
                      {esHoy && (
                        <span className="ml-2 text-xs font-normal text-cafe-500">
                          hoy
                        </span>
                      )}
                    </dt>
                    <dd
                      className={`tabular-nums ${
                        esHoy
                          ? 'font-semibold text-cafe-800'
                          : 'text-cafe-600'
                      }`}
                    >
                      {d.cerrado ? 'Cerrado' : `${d.apertura} – ${d.cierre}`}
                    </dd>
                  </div>
                )
              })}
            </dl>

            <p className="mt-4 border-t border-cafe-200/70 pt-4 text-sm text-cafe-500">
              {horario.nota}
            </p>

            {proximosEspeciales.length > 0 && (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-cafe-700">
                  Días especiales
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {proximosEspeciales.map((e) => (
                    <li key={e.id} className="text-sm text-cafe-600">
                      <span className="font-medium">
                        {capitalizar(fechaLarga(e.fecha))}
                      </span>
                      {' · '}
                      {e.motivo}
                      {' · '}
                      <span className="text-cafe-500">
                        {e.cerrado
                          ? 'cerrado'
                          : `de ${e.apertura} a ${e.cierre}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ubicación */}
          <div className="rounded-2xl border border-cafe-200/70 bg-crema-50 p-6 sm:p-7">
            <h3 className="fuente-display text-xl text-cafe-800">Dónde</h3>

            <address className="mt-5 text-lg leading-relaxed text-cafe-700 not-italic">
              {negocio.direccion.calle}
              <br />
              {negocio.direccion.codigoPostal} {negocio.direccion.ciudad}
              <br />
              <span className="text-cafe-500">
                Barrio de {negocio.direccion.barrio}
              </span>
            </address>

            <div
              className="mt-6 overflow-hidden rounded-xl border border-cafe-200"
              role="img"
              aria-label={`Plano esquemático de la zona de ${negocio.direccion.calle}`}
            >
              <PlanoEsquematico calle={negocio.direccion.calle} />
            </div>

            <h4 className="mt-6 text-sm font-semibold text-cafe-700">
              Cómo llegar
            </h4>
            <ul className="mt-2 space-y-1.5">
              {negocio.comoLlegar.map((linea, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-cafe-600"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cafe-300" />
                  {linea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Plano dibujado a mano: no es un mapa real ni pretende serlo. */
function PlanoEsquematico({ calle }: { calle: string }) {
  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full bg-crema-100">
      <rect width="400" height="200" fill="#faf5ec" />
      {/* Manzanas */}
      <g fill="#f3e9d8" stroke="#e9dac2" strokeWidth="1.5">
        <rect x="18" y="18" width="120" height="62" rx="4" />
        <rect x="18" y="122" width="120" height="60" rx="4" />
        <rect x="262" y="18" width="120" height="62" rx="4" />
        <rect x="262" y="122" width="120" height="60" rx="4" />
      </g>
      {/* Calles */}
      <g stroke="#e9dac2" strokeWidth="18" strokeLinecap="round">
        <line x1="10" y1="101" x2="390" y2="101" />
        <line x1="200" y1="10" x2="200" y2="190" />
      </g>
      <g stroke="#faf5ec" strokeWidth="1.5" strokeDasharray="7 7">
        <line x1="10" y1="101" x2="390" y2="101" />
        <line x1="200" y1="10" x2="200" y2="190" />
      </g>
      {/* Marca del local */}
      <circle cx="200" cy="101" r="15" fill="#c06b4f" opacity="0.18" />
      <circle cx="200" cy="101" r="7" fill="#c06b4f" />
      <circle cx="200" cy="101" r="2.5" fill="#faf5ec" />
      {/* Fondo bajo la etiqueta para que no se confunda con las manzanas. */}
      <rect
        x="118"
        y="128"
        width="164"
        height="22"
        rx="11"
        fill="#faf5ec"
        opacity="0.95"
      />
      <text
        x="200"
        y="143"
        textAnchor="middle"
        fontSize="12"
        fontFamily="DM Sans, sans-serif"
        fill="#7a5a3a"
      >
        {calle}
      </text>
    </svg>
  )
}
