import type { ReactNode } from 'react'
import { Boton, Modal } from '../ui'

/** Encabezado común de cada pantalla del panel. */
export function CabeceraPanel({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string
  descripcion: string
  acciones?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="fuente-display text-3xl text-cafe-900">{titulo}</h1>
        <p className="mt-1 text-cafe-600">{descripcion}</p>
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </header>
  )
}

/** Confirmación antes de borrar algo que no se puede recuperar. */
export function ConfirmarBorrado({
  abierto,
  titulo,
  descripcion,
  textoBoton = 'Borrar',
  onConfirmar,
  onCancelar,
}: {
  abierto: boolean
  titulo: string
  descripcion: string
  textoBoton?: string
  onConfirmar: () => void
  onCancelar: () => void
}) {
  if (!abierto) return null
  return (
    <Modal
      abierto
      onCerrar={onCancelar}
      ancho="sm"
      titulo={titulo}
      pie={
        <>
          <Boton variante="contorno" onClick={onCancelar}>
            Cancelar
          </Boton>
          <Boton variante="peligro" onClick={onConfirmar}>
            {textoBoton}
          </Boton>
        </>
      }
    >
      <p className="text-[0.9375rem] text-cafe-600">{descripcion}</p>
    </Modal>
  )
}

/** Fila de filtros con recuento, igual en todas las pantallas. */
export function Filtros<T extends string>({
  opciones,
  activo,
  onCambiar,
  etiqueta,
}: {
  opciones: { valor: T; texto: string; cuenta: number }[]
  activo: T
  onCambiar: (valor: T) => void
  etiqueta: string
}) {
  return (
    <div role="tablist" aria-label={etiqueta} className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const seleccionado = o.valor === activo
        return (
          <button
            key={o.valor}
            role="tab"
            aria-selected={seleccionado}
            onClick={() => onCambiar(o.valor)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              seleccionado
                ? 'border-cafe-700 bg-cafe-700 text-crema-50'
                : 'border-cafe-200 bg-crema-50 text-cafe-600 hover:bg-crema-200'
            }`}
          >
            {o.texto}
            <span
              className={seleccionado ? 'ml-1.5 opacity-70' : 'ml-1.5 text-cafe-500'}
            >
              {o.cuenta}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Aviso de que esta pantalla es de solo lectura para quien la mira. */
export function SoloLectura() {
  return (
    <p className="mt-4 rounded-lg border border-cafe-200 bg-crema-200/50 px-4 py-2.5 text-sm text-cafe-600">
      Puedes consultar esta sección, pero no modificarla con tu nivel de acceso.
    </p>
  )
}
