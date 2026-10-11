import type { ReactNode } from 'react'

export function Tarjeta({
  children,
  className = '',
  comoSeccion = false,
}: {
  children: ReactNode
  className?: string
  comoSeccion?: boolean
}) {
  const clases = `rounded-xl border border-cafe-200/70 bg-crema-50 ${className}`
  if (comoSeccion) return <section className={clases}>{children}</section>
  return <div className={clases}>{children}</div>
}

export function CabeceraTarjeta({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string
  descripcion?: string
  acciones?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cafe-200/70 px-5 py-4">
      <div>
        <h2 className="fuente-display text-lg text-cafe-800">{titulo}</h2>
        {descripcion && (
          <p className="mt-0.5 text-sm text-cafe-500">{descripcion}</p>
        )}
      </div>
      {acciones && <div className="flex gap-2">{acciones}</div>}
    </div>
  )
}

export function CuerpoTarjeta({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}
