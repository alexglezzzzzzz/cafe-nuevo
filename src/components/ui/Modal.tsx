import { useEffect, useId, useRef, type ReactNode } from 'react'

/**
 * Diálogo modal construido sobre <dialog>, que ya trae de serie el atrapado
 * de foco, el cierre con Escape y el fondo inerte.
 */
export function Modal({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  children,
  pie,
  ancho = 'md',
}: {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  descripcion?: string
  children?: ReactNode
  pie?: ReactNode
  ancho?: 'sm' | 'md' | 'lg'
}) {
  const ref = useRef<HTMLDialogElement>(null)
  // Id propio de cada instancia: en el panel puede haber varios modales.
  const idTitulo = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierto && !dialogo.open) dialogo.showModal()
    if (!abierto && dialogo.open) dialogo.close()
  }, [abierto])

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    // Escape dispara "cancel": se avisa al padre para que cierre de verdad.
    const alCancelar = (e: Event) => {
      e.preventDefault()
      onCerrar()
    }
    dialogo.addEventListener('cancel', alCancelar)
    return () => dialogo.removeEventListener('cancel', alCancelar)
  }, [onCerrar])

  const anchos = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      className={`m-auto w-[calc(100%-2rem)] ${anchos[ancho]} rounded-xl border border-cafe-200 bg-crema-50 p-0 text-cafe-800 shadow-xl backdrop:bg-cafe-900/40`}
      onClick={(e) => {
        // Clic en el fondo, fuera del contenido.
        if (e.target === ref.current) onCerrar()
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-cafe-200/70 px-5 py-4">
        <div>
          <h2 id={idTitulo} className="fuente-display text-lg">
            {titulo}
          </h2>
          {descripcion && (
            <p className="mt-0.5 text-sm text-cafe-500">{descripcion}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-cafe-500 transition-colors hover:bg-crema-200 hover:text-cafe-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {children && <div className="px-5 py-4">{children}</div>}

      {pie && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-cafe-200/70 bg-crema-100/60 px-5 py-4">
          {pie}
        </div>
      )}
    </dialog>
  )
}
