import type { ReactNode } from 'react'

/** Estado vacío: lo que se ve cuando una lista todavía no tiene nada. */
export function SinContenido({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string
  descripcion: string
  accion?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-crema-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-cafe-400"
          aria-hidden="true"
        >
          <path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
          <path d="M16 10h2.5a2.5 2.5 0 0 1 0 5H16" />
          <path d="M7 5c0-1 1-1.3 1-2.2M11 5c0-1 1-1.3 1-2.2" />
        </svg>
      </div>
      <h3 className="fuente-display text-lg text-cafe-800">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-cafe-500">{descripcion}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  )
}
