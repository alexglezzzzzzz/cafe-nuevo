import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { useId } from 'react'

const baseControl =
  'w-full rounded-lg border bg-crema-50 px-3.5 py-2.5 text-[0.9375rem] text-cafe-800 ' +
  'placeholder:text-cafe-400 transition-colors ' +
  'disabled:bg-crema-200 disabled:text-cafe-500 disabled:cursor-not-allowed'

function bordes(error?: string): string {
  return error
    ? 'border-terracota-500 focus:border-terracota-600'
    : 'border-cafe-200 hover:border-cafe-300 focus:border-cafe-500'
}

interface EnvoltorioProps {
  etiqueta: string
  id: string
  error?: string
  ayuda?: string
  obligatorio?: boolean
  children: ReactNode
}

function Envoltorio({
  etiqueta,
  id,
  error,
  ayuda,
  obligatorio,
  children,
}: EnvoltorioProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-cafe-700"
      >
        {etiqueta}
        {obligatorio && (
          <span className="ml-1 text-terracota-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {ayuda && !error && (
        <p id={`${id}-ayuda`} className="mt-1.5 text-sm text-cafe-500">
          {ayuda}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-terracota-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}

type CamposComunes = {
  etiqueta: string
  error?: string
  ayuda?: string
}

export function Entrada({
  etiqueta,
  error,
  ayuda,
  className = '',
  ...resto
}: CamposComunes & InputHTMLAttributes<HTMLInputElement>) {
  const generado = useId()
  const id = resto.id ?? generado
  return (
    <Envoltorio
      etiqueta={etiqueta}
      id={id}
      error={error}
      ayuda={ayuda}
      obligatorio={resto.required}
    >
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
        }
        className={`${baseControl} ${bordes(error)} ${className}`}
        {...resto}
      />
    </Envoltorio>
  )
}

export function AreaTexto({
  etiqueta,
  error,
  ayuda,
  className = '',
  rows = 4,
  ...resto
}: CamposComunes & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generado = useId()
  const id = resto.id ?? generado
  return (
    <Envoltorio
      etiqueta={etiqueta}
      id={id}
      error={error}
      ayuda={ayuda}
      obligatorio={resto.required}
    >
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
        }
        className={`${baseControl} resize-y ${bordes(error)} ${className}`}
        {...resto}
      />
    </Envoltorio>
  )
}

export function Seleccion({
  etiqueta,
  error,
  ayuda,
  className = '',
  children,
  ...resto
}: CamposComunes & SelectHTMLAttributes<HTMLSelectElement>) {
  const generado = useId()
  const id = resto.id ?? generado
  return (
    <Envoltorio
      etiqueta={etiqueta}
      id={id}
      error={error}
      ayuda={ayuda}
      obligatorio={resto.required}
    >
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
        }
        className={`${baseControl} ${bordes(error)} cursor-pointer pr-9 ${className}`}
        {...resto}
      >
        {children}
      </select>
    </Envoltorio>
  )
}

export function Casilla({
  etiqueta,
  descripcion,
  ...resto
}: { etiqueta: string; descripcion?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generado = useId()
  const id = resto.id ?? generado
  return (
    <div className="flex gap-2.5">
      {/* La casilla mide 20 px, pero su etiqueta también la activa: entre las
          dos el objetivo que se puede tocar supera de sobra los 24 px. */}
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-cafe-300 text-cafe-700 accent-cafe-700"
        {...resto}
      />
      <div>
        <label
          htmlFor={id}
          className="cursor-pointer text-[0.9375rem] text-cafe-800"
        >
          {etiqueta}
        </label>
        {descripcion && (
          <p className="text-sm text-cafe-500">{descripcion}</p>
        )}
      </div>
    </div>
  )
}
