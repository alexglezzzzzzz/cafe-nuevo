import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variante = 'principal' | 'secundario' | 'contorno' | 'sutil' | 'peligro'
type Tamano = 'sm' | 'md' | 'lg'

const variantes: Record<Variante, string> = {
  principal:
    'bg-cafe-700 text-crema-50 hover:bg-cafe-800 active:bg-cafe-900 shadow-sm',
  secundario:
    'bg-terracota-500 text-white hover:bg-terracota-600 active:bg-terracota-600 shadow-sm',
  contorno:
    'border border-cafe-300 bg-transparent text-cafe-700 hover:bg-crema-200 hover:border-cafe-400',
  sutil: 'bg-transparent text-cafe-600 hover:bg-crema-200 hover:text-cafe-800',
  peligro:
    'border border-terracota-300 bg-transparent text-terracota-600 hover:bg-terracota-100',
}

const tamanos: Record<Tamano, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-[0.9375rem] px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
}

const base =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none'

interface Comunes {
  variante?: Variante
  tamano?: Tamano
  anchoCompleto?: boolean
  children: ReactNode
  className?: string
}

export function Boton({
  variante = 'principal',
  tamano = 'md',
  anchoCompleto = false,
  className = '',
  children,
  ...resto
}: Comunes & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variantes[variante]} ${tamanos[tamano]} ${
        anchoCompleto ? 'w-full' : ''
      } ${className}`}
      {...resto}
    >
      {children}
    </button>
  )
}

export function BotonEnlace({
  variante = 'principal',
  tamano = 'md',
  anchoCompleto = false,
  className = '',
  a,
  children,
}: Comunes & { a: string }) {
  const esExterno = a.startsWith('#') || a.startsWith('http')
  const clases = `${base} ${variantes[variante]} ${tamanos[tamano]} ${
    anchoCompleto ? 'w-full' : ''
  } ${className}`

  if (esExterno) {
    return (
      <a href={a} className={clases}>
        {children}
      </a>
    )
  }
  return (
    <Link to={a} className={clases}>
      {children}
    </Link>
  )
}
