import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { cambiarEstadoMensaje, guardarNotaInterna } from '../../lib/gestion'
import { capitalizar, fechaLarga, fechaYHora, hace } from '../../lib/formato'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  AreaTexto,
  Boton,
  Etiqueta,
  Modal,
  SinContenido,
  Tarjeta,
} from '../../components/ui'
import type { EstadoMensaje } from '../../lib/tipos'
import {
  textoMensaje,
  textoMotivo,
  tonoMensaje,
} from '../../lib/estados'

const filtros: { valor: 'todos' | EstadoMensaje; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'nuevo', texto: 'Nuevos' },
  { valor: 'leido', texto: 'Leídos' },
  { valor: 'atendido', texto: 'Atendidos' },
]

export function Mensajes() {
  const usuario = useUsuario()
  const { mensajes, reservas, encargos } = useDatos()
  const [parametros, setParametros] = useSearchParams()
  const [filtro, setFiltro] = useState<'todos' | EstadoMensaje>('todos')
  const [busqueda, setBusqueda] = useState('')

  const abiertoId = parametros.get('abierto')
  const abierto = mensajes.find((m) => m.id === abiertoId) ?? null
  const editable = usuario ? puedeEditar(usuario.rol, 'mensajes') : false

  // Abrir un mensaje nuevo lo marca como leído.
  useEffect(() => {
    if (abierto && abierto.estado === 'nuevo' && editable) {
      cambiarEstadoMensaje(abierto.id, 'leido')
    }
  }, [abierto, editable])

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return mensajes
      .filter((m) => filtro === 'todos' || m.estado === filtro)
      .filter(
        (m) =>
          !texto ||
          m.nombre.toLowerCase().includes(texto) ||
          m.email.toLowerCase().includes(texto) ||
          m.mensaje.toLowerCase().includes(texto),
      )
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
  }, [mensajes, filtro, busqueda])

  const cuentas = useMemo(
    () => ({
      todos: mensajes.length,
      nuevo: mensajes.filter((m) => m.estado === 'nuevo').length,
      leido: mensajes.filter((m) => m.estado === 'leido').length,
      atendido: mensajes.filter((m) => m.estado === 'atendido').length,
    }),
    [mensajes],
  )

  function abrir(id: string) {
    setParametros({ abierto: id })
  }
  function cerrar() {
    setParametros({})
  }

  const derivado = abierto?.derivadoEn
    ? (reservas.find((r) => r.id === abierto.derivadoEn) ??
      encargos.find((e) => e.id === abierto.derivadoEn))
    : undefined

  return (
    <div>
      <header>
        <h1 className="fuente-display text-3xl text-cafe-900">Mensajes</h1>
        <p className="mt-1 text-cafe-600">
          Todo lo que llega por el formulario de la web.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          aria-label="Filtrar por estado"
          className="flex flex-wrap gap-2"
        >
          {filtros.map((f) => {
            const activo = f.valor === filtro
            return (
              <button
                key={f.valor}
                role="tab"
                aria-selected={activo}
                onClick={() => setFiltro(f.valor)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  activo
                    ? 'border-cafe-700 bg-cafe-700 text-crema-50'
                    : 'border-cafe-200 bg-crema-50 text-cafe-600 hover:bg-crema-200'
                }`}
              >
                {f.texto}
                <span className={activo ? 'ml-1.5 opacity-70' : 'ml-1.5 text-cafe-500'}>
                  {cuentas[f.valor]}
                </span>
              </button>
            )
          })}
        </div>

        <label className="ml-auto w-full sm:w-64">
          <span className="sr-only">Buscar en los mensajes</span>
          <input
            type="search"
            placeholder="Buscar por nombre o texto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-cafe-200 bg-crema-50 px-3.5 py-2 text-[0.9375rem] text-cafe-800 placeholder:text-cafe-400 hover:border-cafe-300 focus:border-cafe-500"
          />
        </label>
      </div>

      <div className="mt-5">
        <Tarjeta>
          {visibles.length === 0 ? (
            <SinContenido
              titulo={
                mensajes.length === 0
                  ? 'Todavía no hay mensajes'
                  : 'No hay nada que encaje'
              }
              descripcion={
                mensajes.length === 0
                  ? 'Cuando alguien escriba desde la web, aparecerá aquí.'
                  : 'Prueba a cambiar el filtro o a buscar otra cosa.'
              }
              accion={
                mensajes.length === 0 ? (
                  <Link
                    to="/#contacto"
                    className="rounded-lg border border-cafe-300 px-4 py-2 text-sm text-cafe-700 hover:bg-crema-200"
                  >
                    Ir al formulario de la web
                  </Link>
                ) : (
                  <Boton
                    variante="contorno"
                    onClick={() => {
                      setFiltro('todos')
                      setBusqueda('')
                    }}
                  >
                    Quitar los filtros
                  </Boton>
                )
              }
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {visibles.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => abrir(m.id)}
                    className="w-full px-5 py-4 text-left transition-colors hover:bg-crema-100"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Etiqueta tono={tonoMensaje[m.estado]}>
                        {textoMensaje[m.estado]}
                      </Etiqueta>
                      <span className="font-medium text-cafe-800">
                        {m.nombre}
                      </span>
                      <Etiqueta tono="apagado">
                        {textoMotivo[m.motivo]}
                      </Etiqueta>
                      <span className="ml-auto shrink-0 text-sm text-cafe-500">
                        {hace(m.creadoEn)}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-cafe-600">
                      {m.mensaje}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      {abierto && (
        <DetalleMensaje
          key={abierto.id}
          mensaje={abierto}
          editable={editable}
          derivado={
            derivado
              ? 'personas' in derivado
                ? {
                    tipo: 'Reserva',
                    lineas: [
                      capitalizar(fechaLarga(derivado.fecha)),
                      `${derivado.hora} · ${derivado.personas} ${
                        derivado.personas === 1 ? 'persona' : 'personas'
                      }`,
                      `Estado: ${derivado.estado}`,
                    ],
                  }
                : {
                    tipo: 'Encargo',
                    lineas: [
                      capitalizar(derivado.tipo),
                      `Recogida: ${fechaLarga(derivado.fechaRecogida)}`,
                      `Estado: ${derivado.estado}`,
                    ],
                  }
              : undefined
          }
          onCerrar={cerrar}
        />
      )}
    </div>
  )
}

function DetalleMensaje({
  mensaje,
  editable,
  derivado,
  onCerrar,
}: {
  mensaje: import('../../lib/tipos').Mensaje
  editable: boolean
  derivado?: { tipo: string; lineas: string[] }
  onCerrar: () => void
}) {
  const [nota, setNota] = useState(mensaje.notaInterna)
  const [guardada, setGuardada] = useState(false)

  function guardar() {
    guardarNotaInterna(mensaje.id, nota.trim())
    setGuardada(true)
    window.setTimeout(() => setGuardada(false), 2000)
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo={mensaje.nombre}
      descripcion={`${textoMotivo[mensaje.motivo]} · ${fechaYHora(mensaje.creadoEn)}`}
      pie={
        editable ? (
          <>
            <span className="mr-auto self-center text-sm text-oliva-600">
              {guardada ? 'Nota guardada' : ''}
            </span>
            {mensaje.estado !== 'atendido' ? (
              <Boton
                onClick={() => {
                  cambiarEstadoMensaje(mensaje.id, 'atendido')
                  onCerrar()
                }}
              >
                Marcar como atendido
              </Boton>
            ) : (
              <Boton
                variante="contorno"
                onClick={() => cambiarEstadoMensaje(mensaje.id, 'leido')}
              >
                Reabrir
              </Boton>
            )}
          </>
        ) : (
          <Boton variante="contorno" onClick={onCerrar}>
            Cerrar
          </Boton>
        )
      }
    >
      <div className="space-y-5">
        <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[6rem_1fr]">
          <dt className="text-cafe-500">Correo</dt>
          <dd className="break-all text-cafe-800">{mensaje.email}</dd>
          {mensaje.telefono && (
            <>
              <dt className="text-cafe-500">Teléfono</dt>
              <dd className="text-cafe-800">{mensaje.telefono}</dd>
            </>
          )}
          <dt className="text-cafe-500">Estado</dt>
          <dd>
            <Etiqueta tono={tonoMensaje[mensaje.estado]}>
              {textoMensaje[mensaje.estado]}
            </Etiqueta>
          </dd>
        </dl>

        <div className="rounded-xl border border-cafe-200/70 bg-crema-100/60 p-4">
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-cafe-700">
            {mensaje.mensaje}
          </p>
        </div>

        {derivado && (
          <div className="rounded-xl border border-terracota-300 bg-terracota-100/40 p-4">
            <p className="text-sm font-semibold text-cafe-700">
              {derivado.tipo} generada desde este mensaje
            </p>
            <ul className="mt-1.5 space-y-0.5 text-sm text-cafe-600">
              {derivado.lineas.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        {editable ? (
          <div>
            <AreaTexto
              etiqueta="Nota interna"
              rows={3}
              placeholder="Para el resto del equipo. No lo ve quien escribió."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            <Boton
              variante="contorno"
              tamano="sm"
              className="mt-2"
              onClick={guardar}
              disabled={nota.trim() === mensaje.notaInterna}
            >
              Guardar la nota
            </Boton>
          </div>
        ) : (
          mensaje.notaInterna && (
            <div>
              <p className="text-sm font-medium text-cafe-700">Nota interna</p>
              <p className="mt-1 text-sm text-cafe-600">
                {mensaje.notaInterna}
              </p>
            </div>
          )
        )}
      </div>
    </Modal>
  )
}
