import { useMemo, useState } from 'react'
import {
  actualizarReserva,
  cambiarEstadoReserva,
  crearReserva,
} from '../../lib/gestion'
import { capitalizar, fechaLarga, HOY_ISO } from '../../lib/formato'
import { textoReserva, tonoReserva } from '../../lib/estados'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  validarFechaFutura,
  validarHora,
  validarNombre,
  validarPersonas,
  validarTelefono,
} from '../../lib/validacion'
import {
  AreaTexto,
  Aviso,
  Boton,
  Entrada,
  Etiqueta,
  Modal,
  SinContenido,
  Tarjeta,
} from '../../components/ui'
import {
  CabeceraPanel,
  Filtros,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'
import type { EstadoReserva, Reserva } from '../../lib/tipos'

type Filtro = 'proximas' | 'pendiente' | 'confirmada' | 'pasadas' | 'todas'

export function Reservas() {
  const usuario = useUsuario()
  const { reservas, horario } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const [filtro, setFiltro] = useState<Filtro>('proximas')
  const [abierta, setAbierta] = useState<Reserva | null>(null)
  const [creando, setCreando] = useState(false)

  const editable = usuario ? puedeEditar(usuario.rol, 'reservas') : false

  const grupos = useMemo(() => {
    const vivas = (r: Reserva) =>
      r.estado !== 'cancelada' && r.estado !== 'completada'
    return {
      proximas: reservas.filter((r) => r.fecha >= HOY_ISO && vivas(r)),
      pendiente: reservas.filter((r) => r.estado === 'pendiente'),
      confirmada: reservas.filter((r) => r.estado === 'confirmada'),
      pasadas: reservas.filter((r) => r.fecha < HOY_ISO || !vivas(r)),
      todas: reservas,
    }
  }, [reservas])

  const visibles = useMemo(
    () =>
      [...grupos[filtro]].sort((a, b) => {
        const porFecha = a.fecha.localeCompare(b.fecha)
        return filtro === 'pasadas'
          ? -porFecha || b.hora.localeCompare(a.hora)
          : porFecha || a.hora.localeCompare(b.hora)
      }),
    [grupos, filtro],
  )

  function cambiarEstado(id: string, estado: EstadoReserva) {
    cambiarEstadoReserva(id, estado)
    avisar()
    setAbierta((a) => (a && a.id === id ? { ...a, estado } : a))
  }

  return (
    <div>
      <CabeceraPanel
        titulo="Reservas"
        descripcion="Las que llegan por la web y las que se apuntan en barra."
        acciones={
          editable ? (
            <Boton onClick={() => setCreando(true)}>Apuntar una reserva</Boton>
          ) : undefined
        }
      />
      {!editable && <SoloLectura />}

      <div className="mt-6">
        <Filtros
          etiqueta="Filtrar reservas"
          activo={filtro}
          onCambiar={setFiltro}
          opciones={[
            { valor: 'proximas', texto: 'Próximas', cuenta: grupos.proximas.length },
            { valor: 'pendiente', texto: 'Por confirmar', cuenta: grupos.pendiente.length },
            { valor: 'confirmada', texto: 'Confirmadas', cuenta: grupos.confirmada.length },
            { valor: 'pasadas', texto: 'Pasadas', cuenta: grupos.pasadas.length },
            { valor: 'todas', texto: 'Todas', cuenta: grupos.todas.length },
          ]}
        />
      </div>

      <div className="mt-5">
        <Tarjeta>
          {visibles.length === 0 ? (
            <SinContenido
              titulo="No hay reservas aquí"
              descripcion={
                filtro === 'proximas'
                  ? 'Cuando alguien pida mesa desde la web, aparecerá en esta lista.'
                  : 'Prueba con otro filtro.'
              }
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {visibles.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setAbierta(r)}
                    className="w-full px-5 py-4 text-left transition-colors hover:bg-crema-100"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Etiqueta tono={tonoReserva[r.estado]}>
                        {textoReserva[r.estado]}
                      </Etiqueta>
                      <span className="font-medium text-cafe-800">
                        {r.nombre}
                      </span>
                      <span className="text-sm text-cafe-500">
                        {r.personas} {r.personas === 1 ? 'persona' : 'personas'}
                      </span>
                      <span className="ml-auto shrink-0 text-sm text-cafe-600">
                        {capitalizar(fechaLarga(r.fecha))} · {r.hora}
                      </span>
                    </div>
                    {r.notas && (
                      <p className="mt-1.5 line-clamp-1 text-sm text-cafe-500">
                        {r.notas}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      {abierta && (
        <DetalleReserva
          reserva={abierta}
          editable={editable}
          onCerrar={() => setAbierta(null)}
          onEstado={cambiarEstado}
          onNotas={(id, notas) => {
            actualizarReserva(id, { notas })
            avisar()
          }}
        />
      )}

      {creando && (
        <NuevaReserva
          horario={horario}
          onCerrar={() => setCreando(false)}
          onCreada={() => {
            setCreando(false)
            avisar()
          }}
        />
      )}

      {aviso}
    </div>
  )
}

function DetalleReserva({
  reserva,
  editable,
  onCerrar,
  onEstado,
  onNotas,
}: {
  reserva: Reserva
  editable: boolean
  onCerrar: () => void
  onEstado: (id: string, estado: EstadoReserva) => void
  onNotas: (id: string, notas: string) => void
}) {
  const [notas, setNotas] = useState(reserva.notas)

  const origen = {
    web: 'Pedida desde la web',
    telefono: 'Apuntada por teléfono',
    local: 'Apuntada en el local',
  }[reserva.origen]

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo={reserva.nombre}
      descripcion={`${capitalizar(fechaLarga(reserva.fecha))} a las ${reserva.hora} · ${origen}`}
      pie={
        editable ? (
          <>
            {reserva.estado !== 'cancelada' && (
              <Boton
                variante="peligro"
                onClick={() => {
                  onEstado(reserva.id, 'cancelada')
                  onCerrar()
                }}
              >
                Cancelar la reserva
              </Boton>
            )}
            {reserva.estado === 'pendiente' && (
              <Boton onClick={() => onEstado(reserva.id, 'confirmada')}>
                Confirmar
              </Boton>
            )}
            {reserva.estado === 'confirmada' && (
              <Boton onClick={() => onEstado(reserva.id, 'completada')}>
                Marcar como cumplida
              </Boton>
            )}
            {(reserva.estado === 'cancelada' ||
              reserva.estado === 'completada') && (
              <Boton
                variante="contorno"
                onClick={() => onEstado(reserva.id, 'pendiente')}
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
          <dt className="text-cafe-500">Estado</dt>
          <dd>
            <Etiqueta tono={tonoReserva[reserva.estado]}>
              {textoReserva[reserva.estado]}
            </Etiqueta>
          </dd>
          <dt className="text-cafe-500">Personas</dt>
          <dd className="text-cafe-800">{reserva.personas}</dd>
          <dt className="text-cafe-500">Teléfono</dt>
          <dd className="text-cafe-800">{reserva.telefono || '—'}</dd>
          {reserva.email && (
            <>
              <dt className="text-cafe-500">Correo</dt>
              <dd className="break-all text-cafe-800">{reserva.email}</dd>
            </>
          )}
        </dl>

        {editable ? (
          <div>
            <AreaTexto
              etiqueta="Notas"
              rows={3}
              placeholder="Mesa del fondo, carrito, alergias…"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
            <Boton
              variante="contorno"
              tamano="sm"
              className="mt-2"
              disabled={notas.trim() === reserva.notas}
              onClick={() => onNotas(reserva.id, notas.trim())}
            >
              Guardar las notas
            </Boton>
          </div>
        ) : (
          reserva.notas && (
            <div>
              <p className="text-sm font-medium text-cafe-700">Notas</p>
              <p className="mt-1 text-sm text-cafe-600">{reserva.notas}</p>
            </div>
          )
        )}
      </div>
    </Modal>
  )
}

function NuevaReserva({
  horario,
  onCerrar,
  onCreada,
}: {
  horario: import('../../lib/tipos').Horario
  onCerrar: () => void
  onCreada: () => void
}) {
  const [campos, setCampos] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha: HOY_ISO,
    hora: '',
    personas: '2',
    notas: '',
  })
  const [errores, setErrores] = useState<Record<string, string>>({})

  function cambiar(campo: keyof typeof campos, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }))
    setErrores((e) => ({ ...e, [campo]: '' }))
  }

  function guardar() {
    const e: Record<string, string> = {}
    const nombre = validarNombre(campos.nombre)
    if (nombre) e.nombre = nombre
    const telefono = validarTelefono(campos.telefono, true)
    if (telefono) e.telefono = telefono
    const fecha = validarFechaFutura(campos.fecha, 'el día')
    if (fecha) e.fecha = fecha
    const hora = validarHora(campos.hora, campos.fecha, horario)
    if (hora) e.hora = hora
    const personas = validarPersonas(campos.personas)
    if (personas) e.personas = personas

    setErrores(e)
    if (Object.keys(e).length > 0) return

    crearReserva({
      nombre: campos.nombre.trim(),
      telefono: campos.telefono.trim(),
      email: campos.email.trim(),
      fecha: campos.fecha,
      hora: campos.hora,
      personas: Number(campos.personas),
      notas: campos.notas.trim(),
    })
    onCreada()
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo="Apuntar una reserva"
      descripcion="Para las que llegan por teléfono o en la barra."
      pie={
        <>
          <Boton variante="contorno" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton onClick={guardar}>Apuntar</Boton>
        </>
      }
    >
      <div className="space-y-5">
        {Object.keys(errores).some((k) => errores[k]) && (
          <Aviso tipo="atencion">Revisa los campos marcados.</Aviso>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Entrada
            etiqueta="Nombre"
            required
            autoFocus
            value={campos.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            error={errores.nombre || undefined}
          />
          <Entrada
            etiqueta="Teléfono"
            type="tel"
            required
            placeholder="+34 600 000 000"
            value={campos.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            error={errores.telefono || undefined}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Entrada
            etiqueta="Día"
            type="date"
            required
            value={campos.fecha}
            onChange={(e) => cambiar('fecha', e.target.value)}
            error={errores.fecha || undefined}
          />
          <Entrada
            etiqueta="Hora"
            type="time"
            required
            value={campos.hora}
            onChange={(e) => cambiar('hora', e.target.value)}
            error={errores.hora || undefined}
          />
          <Entrada
            etiqueta="Personas"
            type="number"
            min={1}
            max={20}
            required
            value={campos.personas}
            onChange={(e) => cambiar('personas', e.target.value)}
            error={errores.personas || undefined}
          />
        </div>
        <Entrada
          etiqueta="Correo"
          type="email"
          placeholder="Opcional"
          value={campos.email}
          onChange={(e) => cambiar('email', e.target.value)}
        />
        <AreaTexto
          etiqueta="Notas"
          rows={2}
          placeholder="Lo que convenga recordar"
          value={campos.notas}
          onChange={(e) => cambiar('notas', e.target.value)}
        />
      </div>
    </Modal>
  )
}
