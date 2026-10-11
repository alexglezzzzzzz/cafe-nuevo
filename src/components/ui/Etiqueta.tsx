import type { ReactNode } from 'react'

export type TonoEtiqueta =
  | 'neutro'
  | 'cafe'
  | 'aviso'
  | 'correcto'
  | 'apagado'

const tonos: Record<TonoEtiqueta, string> = {
  neutro: 'bg-crema-200 text-cafe-700 border-cafe-200',
  cafe: 'bg-cafe-700 text-crema-50 border-cafe-700',
  aviso: 'bg-terracota-100 text-terracota-600 border-terracota-300',
  correcto: 'bg-oliva-100 text-oliva-600 border-oliva-400/40',
  apagado: 'bg-transparent text-cafe-500 border-cafe-200',
}

export function Etiqueta({
  children,
  tono = 'neutro',
  className = '',
}: {
  children: ReactNode
  tono?: TonoEtiqueta
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tonos[tono]} ${className}`}
    >
      {children}
    </span>
  )
}
