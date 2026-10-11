import type { ReactNode } from 'react'

type TipoAviso = 'informacion' | 'correcto' | 'atencion'

const estilos: Record<TipoAviso, { caja: string; icono: string }> = {
  informacion: {
    caja: 'border-cafe-200 bg-crema-200/60 text-cafe-700',
    icono: 'text-cafe-500',
  },
  correcto: {
    caja: 'border-oliva-400/40 bg-oliva-100/70 text-oliva-600',
    icono: 'text-oliva-500',
  },
  atencion: {
    caja: 'border-terracota-300 bg-terracota-100/70 text-terracota-600',
    icono: 'text-terracota-500',
  },
}

const iconos: Record<TipoAviso, ReactNode> = {
  informacion: (
    <path d="M12 16v-5m0-3.5v.01M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
  ),
  correcto: <path d="m7.5 12.5 3 3 6-7M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />,
  atencion: (
    <path d="M12 9v4m0 3.5v.01M10.3 3.9 2.6 17.2A1.9 1.9 0 0 0 4.3 20h15.4a1.9 1.9 0 0 0 1.7-2.8L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
  ),
}

export function Aviso({
  tipo = 'informacion',
  titulo,
  children,
}: {
  tipo?: TipoAviso
  titulo?: string
  children: ReactNode
}) {
  const estilo = estilos[tipo]
  return (
    <div
      className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${estilo.caja}`}
      role={tipo === 'atencion' ? 'alert' : undefined}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${estilo.icono}`}
        aria-hidden="true"
      >
        {iconos[tipo]}
      </svg>
      <div>
        {titulo && <p className="font-semibold">{titulo}</p>}
        <div className={titulo ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  )
}
