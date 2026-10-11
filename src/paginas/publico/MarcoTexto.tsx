import type { ReactNode } from 'react'
import { Navegacion } from '../../components/publico/Navegacion'
import { PieDePagina } from '../../components/publico/PieDePagina'

/** Armazón de las páginas de texto largo, como las legales. */
export function MarcoTexto({
  titulo,
  entradilla,
  children,
}: {
  titulo: string
  entradilla: string
  children: ReactNode
}) {
  return (
    <>
      <Navegacion />
      <main className="px-5 py-14 sm:px-8 sm:py-20">
        <article className="mx-auto max-w-2xl">
          <h1 className="fuente-display text-4xl text-cafe-900">{titulo}</h1>
          <p className="mt-3 text-lg text-cafe-600">{entradilla}</p>
          <div className="mt-10 space-y-8">{children}</div>
        </article>
      </main>
      <PieDePagina />
    </>
  )
}

export function Apartado({
  titulo,
  children,
}: {
  titulo: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="fuente-display text-xl text-cafe-800">{titulo}</h2>
      <div className="mt-2.5 space-y-3 leading-relaxed text-cafe-600">
        {children}
      </div>
    </section>
  )
}
