import { useMemo, useState } from 'react'
import {
  actualizarEncargo,
  cambiarEstadoEncargo,
  crearEncargo,
} from '../../lib/gestion'
import { capitalizar, fechaLarga, HOY_ISO, precio } from '../../lib/formato'
import { textoEncargo, tonoEncargo } from '../../lib/estados'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  validarFechaFutura,
  validarNombre,
  validarTelefono,
} from '../../lib/validacion'
import {
  AreaTexto,
  Aviso,
  Boton,
  Entrada,
  Etiqueta,
  Modal,
  Seleccion,
  SinContenido,
  Tarjeta,
} from '../../components/ui'
import {
  CabeceraPanel,
  Filtros,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'
import type { Encargo, EstadoEncargo, TipoEncargo } from '../../lib/tipos'

const tipos: TipoEncargo[] = [
  'tarta',
  'bandeja salada',
  'café en grano',
  'catering',
  'otro',
]

type Filtro = 'activos' | 'pendiente' | 'listo' | 'cerrados' | 'todos'

export function Encargos() {
  const usuario = useUsuario()
  const { encargos } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const [filtro, setFiltro] = useState<Filtro>('activos')
  const [abierto, setAbierto] = useState<Encargo | null>(null)
  const [creando, setCreando] = useState(false)

  const editable = usuario ? puedeEditar(usuario.rol, 'encargos') : false

  const grupos = useMemo(() => {
    const vivo = (e: Encargo) =>
      e.estado !== 'entregado' && e.estado !== 'cancelado'
    return {
      activos: encargos.filter(vivo),
      pendiente: encargos.filter((e) => e.estado === 'pendiente'),
      listo: encargos.filter((e) => e.estado === 'listo'),
      cerrados: encargos.filter((e) => !vivo(e)),
      todos: encargos,
    }
  }, [encargos])

  const visibles = useMemo(
    () =>
      [...grupos[filtro]].sort((a, b) =>
        a.fechaRecogida.localeCompare(b.fechaRecogida),
      ),
    [grupos, filtro],
  )

  function cambiarEstado(id: string, estado: EstadoEncargo) {
    cambiarEstadoEncargo(id, estado)
    avisar()
    setAbierto((e) => (e && e.id === id ? { ...e, estado } : e))
  }

  return (
    <div>
      <CabeceraPanel
        titulo="Encargos"
        descripcion="Tartas, bandejas, café en grano y caterings."
        acciones={
          editable ? (
            <Boton onClick={() => setCreando(true)}>Apuntar un encargo</Boton>
          ) : undefined
        }
      />
      {!editable && <SoloLectura />}

      <div className="mt-6">
        <Filtros
          etiqueta="Filtrar encargos"
          activo={filtro}
          onCambiar={setFiltro}
          opciones={[
            { valor: 'activos', texto: 'En marcha', cuenta: grupos.activos.length },
            { valor: 'pendiente', texto: 'Sin aceptar', cuenta: grupos.pendiente.length },
            { valor: 'listo', texto: 'Listos', cuenta: grupos.listo.length },
            { valor: 'cerrados', texto: 'Cerrados', cuenta: grupos.cerrados.length },
            { valor: 'todos', texto: 'Todos', cuenta: grupos.todos.length },
          ]}
        />
      </div>

      <div className="mt-5">
        <Tarjeta>
          {visibles.length === 0 ? (
            <SinContenido
              titulo="No hay encargos aquí"
              descripcion="Cuando alguien encargue algo desde la web, aparecerá en esta lista."
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {visibles.map((e) => {
                const esHoy = e.fechaRecogida === HOY_ISO
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setAbierto(e)}
                      className="w-full px-5 py-4 text-left transition-colors hover:bg-crema-100"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <Etiqueta tono={tonoEncargo[e.estado]}>
                          {textoEncargo[e.estado]}
                        </Etiqueta>
                        <span className="font-medium text-cafe-800">
                          {e.nombre}
                        </span>
                        <Etiqueta tono="apagado">{capitalizar(e.tipo)}</Etiqueta>
                        <span className="ml-auto shrink-0 text-sm text-cafe-600">
                          {esHoy ? (
                            <strong className="text-terracota-600">
                              Se recoge hoy
                            </strong>
                          ) : (
                            capitalizar(fechaLarga(e.fechaRecogida))
                          )}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-1 text-sm text-cafe-500">
                        {e.descripcion}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Tarjeta>
      </div>

      {abierto && (
        <DetalleEncargo
          encargo={abierto}
          editable={editable}
          onCerrar={() => setAbierto(null)}
          onEstado={cambiarEstado}
          onImporte={(id, importe) => {
            actualizarEncargo(id, { importe })
            avisar()
            setAbierto((e) => (e && e.id === id ? { ...e, importe } : e))
          }}
        />
      )}

      {creando && (
        <NuevoEncargo
          onCerrar={() => setCreando(false)}
          onCreado={() => {
            setCreando(false)
            avisar()
          }}
        />
      )}

      {aviso}
    </div>
  )
}

const siguiente: Partial<Record<EstadoEncargo, { estado: EstadoEncargo; texto: string }>> = {
  pendiente: { estado: 'aceptado', texto: 'Aceptar el encargo' },
  aceptado: { estado: 'listo', texto: 'Marcar como listo' },
  listo: { estado: 'entregado', texto: 'Marcar como entregado' },
}

function DetalleEncargo({
  encargo,
  editable,
  onCerrar,
  onEstado,
  onImporte,
}: {
  encargo: Encargo
  editable: boolean
  onCerrar: () => void
  onEstado: (id: string, estado: EstadoEncargo) => void
  onImporte: (id: string, importe: number | null) => void
}) {
  const [importe, setImporte] = useState(
    encargo.importe === null ? '' : String(encargo.importe),
  )
  const paso = siguiente[encargo.estado]

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo={encargo.nombre}
      descripcion={`${capitalizar(encargo.tipo)} · se recoge el ${fechaLarga(encargo.fechaRecogida)}`}
      pie={
        editable ? (
          <>
            {encargo.estado !== 'cancelado' &&
              encargo.estado !== 'entregado' && (
                <Boton
                  variante="peligro"
                  onClick={() => {
                    onEstado(encargo.id, 'cancelado')
                    onCerrar()
                  }}
                >
                  Cancelar
                </Boton>
              )}
            {paso && (
              <Boton onClick={() => onEstado(encargo.id, paso.estado)}>
                {paso.texto}
              </Boton>
            )}
            {(encargo.estado === 'cancelado' ||
              encargo.estado === 'entregado') && (
              <Boton
                variante="contorno"
                onClick={() => onEstado(encargo.id, 'aceptado')}
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
            <Etiqueta tono={tonoEncargo[encargo.estado]}>
              {textoEncargo[encargo.estado]}
            </Etiqueta>
          </dd>
          <dt className="text-cafe-500">Teléfono</dt>
          <dd className="text-cafe-800">{encargo.telefono || '—'}</dd>
          {encargo.email && (
            <>
              <dt className="text-cafe-500">Correo</dt>
              <dd className="break-all text-cafe-800">{encargo.email}</dd>
            </>
          )}
          <dt className="text-cafe-500">Importe</dt>
          <dd className="text-cafe-800">
            {encargo.importe === null ? 'Sin cerrar' : precio(encargo.importe)}
          </dd>
        </dl>

        <div className="rounded-xl border border-cafe-200/70 bg-crema-100/60 p-4">
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-cafe-700">
            {encargo.descripcion}
          </p>
        </div>

        {editable && (
          <div className="flex items-end gap-3">
            <div className="w-40">
              <Entrada
                etiqueta="Importe acordado"
                type="number"
                min={0}
                step="0.5"
                placeholder="0"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
              />
            </div>
            <Boton
              variante="contorno"
              onClick={() =>
                onImporte(encargo.id, importe === '' ? null : Number(importe))
              }
            >
              Guardar
            </Boton>
          </div>
        )}
      </div>
    </Modal>
  )
}

function NuevoEncargo({
  onCerrar,
  onCreado,
}: {
  onCerrar: () => void
  onCreado: () => void
}) {
  const [campos, setCampos] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipo: 'tarta' as TipoEncargo,
    descripcion: '',
    fechaRecogida: '',
    importe: '',
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
    const fecha = validarFechaFutura(campos.fechaRecogida, 'el día de recogida')
    if (fecha) e.fechaRecogida = fecha
    if (!campos.descripcion.trim()) {
      e.descripcion = 'Apunta en qué consiste el encargo.'
    }

    setErrores(e)
    if (Object.keys(e).length > 0) return

    crearEncargo({
      nombre: campos.nombre.trim(),
      telefono: campos.telefono.trim(),
      email: campos.email.trim(),
      tipo: campos.tipo,
      descripcion: campos.descripcion.trim(),
      fechaRecogida: campos.fechaRecogida,
      importe: campos.importe === '' ? null : Number(campos.importe),
    })
    onCreado()
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo="Apuntar un encargo"
      descripcion="Para los que se piden por teléfono o en la barra."
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
          <Seleccion
            etiqueta="Tipo"
            required
            value={campos.tipo}
            onChange={(e) => cambiar('tipo', e.target.value)}
          >
            {tipos.map((t) => (
              <option key={t} value={t}>
                {capitalizar(t)}
              </option>
            ))}
          </Seleccion>
          <Entrada
            etiqueta="Recogida"
            type="date"
            required
            value={campos.fechaRecogida}
            onChange={(e) => cambiar('fechaRecogida', e.target.value)}
            error={errores.fechaRecogida || undefined}
          />
          <Entrada
            etiqueta="Importe"
            type="number"
            min={0}
            step="0.5"
            placeholder="Opcional"
            value={campos.importe}
            onChange={(e) => cambiar('importe', e.target.value)}
          />
        </div>
        <AreaTexto
          etiqueta="En qué consiste"
          required
          rows={3}
          placeholder="Cantidad, sabores, si lleva algo escrito, alergias…"
          value={campos.descripcion}
          onChange={(e) => cambiar('descripcion', e.target.value)}
          error={errores.descripcion || undefined}
        />
      </div>
    </Modal>
  )
}
