import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Aviso breve de que algo se ha guardado.
 *
 * Los cambios del panel se escriben al momento: en vez de un botón de
 * guardar en cada campo, aparece esta confirmación y se va sola.
 */
export function useAvisoGuardado() {
  const [visible, setVisible] = useState(false)
  const temporizador = useRef<number | undefined>(undefined)

  const avisar = useCallback(() => {
    setVisible(true)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setVisible(false), 1800)
  }, [])

  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  const aviso = (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      {visible && (
        <p className="rounded-full border border-oliva-400/40 bg-oliva-100 px-4 py-2 text-sm font-medium text-oliva-600 shadow-sm">
          Guardado
        </p>
      )}
    </div>
  )

  return { avisar, aviso }
}
