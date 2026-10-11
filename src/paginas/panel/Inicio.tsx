import { Link } from 'react-router-dom'
import { useDatos, useUsuario } from '../../lib/useDatos'
import { puedeVer } from '../../lib/permisos'
import { capitalizar, fechaCorta, hace, HOY_ISO } from '../../lib/formato'
import { Etiqueta, SinContenido, Tarjeta } from '../../components/ui'
import { textoMensaje, tonoMensaje } from '../../lib/estados'

function saludo(): string {
  const h = new Date().getHours()
  if (h < 13) return 'Buenos días'
  if (h < 21) return 'Buenas tardes'
  return 'Buenas noches'
}

export function Inicio() {
  const usuario = useUsuario()
  const { mensajes, reservas, encargos } = useDatos()
  if (!usuario) return null

  const sinLeer = mensajes.filter((m) => m.estado === 'nuevo')
  const reservasHoy = reservas.filter(
    (r) => r.fecha === HOY_ISO && r.estado !== 'cancelada',
  )
  const reservasPendientes = reservas.filter((r) => r.estado === 'pendiente')
  const encargosActivos = encargos.filter(
    (e) => e.estado === 'pendiente' || e.estado === 'aceptado',
  )
  const paraHoy = encargos.filter(
    (e) =>
      e.fechaRecogida === HOY_ISO &&
      e.estado !== 'cancelado' &&
      e.estado !== 'entregado',
  )

  const ultimos = [...mensajes]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .slice(0, 5)

  return (
    <div>
      <header>
        <h1 className="fuente-display text-3xl text-cafe-900">
          {saludo()}, {usuario.nombre.split(' ')[0]}
        </h1>
        <p className="mt-1 text-cafe-600">
          Esto es lo que hay sobre la mesa ahora mismo.
        </p>
      </header>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Cifra
          valor={sinLeer.length}
          etiqueta="mensajes sin leer"
          a="/panel/mensajes"
          destacado={sinLeer.length > 0}
        />
        <Cifra
          valor={reservasHoy.length}
          etiqueta="reservas para hoy"
          a={puedeVer(usuario.rol, 'reservas') ? '/panel/reservas' : undefined}
        />
        <Cifra
          valor={reservasPendientes.length}
          etiqueta="reservas por confirmar"
          a={puedeVer(usuario.rol, 'reservas') ? '/panel/reservas' : undefined}
        />
        <Cifra
          valor={paraHoy.length > 0 ? paraHoy.length : encargosActivos.length}
          etiqueta={
            paraHoy.length > 0 ? 'encargos para hoy' : 'encargos en marcha'
          }
          a={puedeVer(usuario.rol, 'encargos') ? '/panel/encargos' : undefined}
        />
      </div>

      <div className="mt-8">
        <Tarjeta>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              Lo último que ha llegado
            </h2>
            <Link
              to="/panel/mensajes"
              className="text-sm font-medium text-terracota-600 underline underline-offset-4"
            >
              Ver la bandeja
            </Link>
          </div>

          {ultimos.length === 0 ? (
            <SinContenido
              titulo="Todavía no hay mensajes"
              descripcion="Cuando alguien escriba desde la web, aparecerá aquí."
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {ultimos.map((m) => (
                <li key={m.id}>
                  <Link
                    to={`/panel/mensajes?abierto=${m.id}`}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 py-3.5 transition-colors hover:bg-crema-100"
                  >
                    <Etiqueta tono={tonoMensaje[m.estado]}>
                      {textoMensaje[m.estado]}
                    </Etiqueta>
                    <span className="font-medium text-cafe-800">
                      {m.nombre}
                    </span>
                    <span className="text-sm text-cafe-500">
                      {capitalizar(m.motivo)}
                    </span>
                    <span className="ml-auto text-sm text-cafe-500">
                      {hace(m.creadoEn)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      {puedeVer(usuario.rol, 'reservas') && reservasHoy.length > 0 && (
        <div className="mt-6">
          <Tarjeta>
            <div className="border-b border-cafe-200/70 px-5 py-4">
              <h2 className="fuente-display text-lg text-cafe-800">
                Reservas de hoy
              </h2>
            </div>
            <ul className="divide-y divide-cafe-200/60">
              {reservasHoy
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3.5"
                  >
                    <span className="font-medium tabular-nums text-cafe-800">
                      {r.hora}
                    </span>
                    <span className="text-cafe-700">{r.nombre}</span>
                    <span className="text-sm text-cafe-500">
                      {r.personas}{' '}
                      {r.personas === 1 ? 'persona' : 'personas'}
                    </span>
                    <span className="ml-auto text-sm text-cafe-500">
                      {fechaCorta(r.fecha)}
                    </span>
                  </li>
                ))}
            </ul>
          </Tarjeta>
        </div>
      )}
    </div>
  )
}

function Cifra({
  valor,
  etiqueta,
  a,
  destacado = false,
}: {
  valor: number
  etiqueta: string
  a?: string
  destacado?: boolean
}) {
  const contenido = (
    <>
      <p
        className={`fuente-display text-4xl ${
          destacado ? 'text-terracota-600' : 'text-cafe-800'
        }`}
      >
        {valor}
      </p>
      <p className="mt-1 text-sm text-cafe-500">{etiqueta}</p>
    </>
  )

  const clases = `rounded-xl border bg-crema-50 px-5 py-4 ${
    destacado ? 'border-terracota-300' : 'border-cafe-200/70'
  }`

  if (!a) return <div className={clases}>{contenido}</div>
  return (
    <Link to={a} className={`${clases} block transition-colors hover:bg-crema-200/50`}>
      {contenido}
    </Link>
  )
}
