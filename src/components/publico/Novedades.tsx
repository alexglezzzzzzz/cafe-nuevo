import { useState } from 'react'
import { useDatos } from '../../lib/useDatos'
import { fechaLarga, capitalizar } from '../../lib/formato'
import { Etiqueta, Modal } from '../ui'
import type { Novedad } from '../../lib/tipos'

export function Novedades() {
  const { novedades, negocio } = useDatos()
  const [abierta, setAbierta] = useState<Novedad | null>(null)

  const publicadas = novedades
    .filter((n) => n.publicada)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  if (publicadas.length === 0) return null

  return (
    <section id="novedades" className="relative overflow-hidden">
      <img
        src={negocio.fotos.fondo.archivo}
        alt=""
        aria-hidden="true"
        width={1200}
        height={480}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-cafe-900/88" aria-hidden="true" />

      <div className="relative px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium tracking-[0.12em] text-crema-300 uppercase">
            Novedades
          </p>
          <h2 className="fuente-display mt-3 text-3xl text-crema-50 sm:text-4xl">
            Lo que se cuece
          </h2>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {publicadas.map((n) => (
              <li key={n.id}>
                <article className="flex h-full flex-col rounded-xl border border-crema-50/15 bg-crema-50/8 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Etiqueta tono="aviso">{n.etiqueta}</Etiqueta>
                    <time
                      dateTime={n.fecha}
                      className="text-xs text-crema-300"
                    >
                      {capitalizar(fechaLarga(n.fecha))}
                    </time>
                  </div>
                  <h3 className="fuente-display mt-3 text-xl text-crema-50">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-crema-200/90">
                    {n.resumen}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAbierta(n)}
                    className="mt-3 -mb-1 self-start py-1 text-sm font-medium text-terracota-300 underline underline-offset-4 transition-colors hover:text-terracota-100"
                  >
                    Seguir leyendo
                  </button>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {abierta && (
        <Modal
          abierto
          onCerrar={() => setAbierta(null)}
          titulo={abierta.titulo}
          descripcion={capitalizar(fechaLarga(abierta.fecha))}
        >
          <div className="space-y-3 text-[0.9375rem] leading-relaxed text-cafe-600">
            {abierta.cuerpo.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </Modal>
      )}
    </section>
  )
}
