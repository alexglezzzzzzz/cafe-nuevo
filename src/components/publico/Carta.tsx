import { useMemo, useState } from 'react'
import { useDatos } from '../../lib/useDatos'
import { precio } from '../../lib/formato'
import { Etiqueta } from '../ui'

export function Carta() {
  const { categorias, productos, negocio } = useDatos()
  const ordenadas = useMemo(
    () => [...categorias].sort((a, b) => a.orden - b.orden),
    [categorias],
  )
  const [activa, setActiva] = useState(ordenadas[0]?.id ?? '')

  const categoria = ordenadas.find((c) => c.id === activa) ?? ordenadas[0]
  const items = useMemo(
    () =>
      productos
        .filter((p) => p.categoriaId === categoria?.id)
        .sort((a, b) => a.orden - b.orden),
    [productos, categoria],
  )

  if (!categoria) return null

  return (
    <section id="carta" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
            La carta
          </p>
          <h2 className="fuente-display mt-3 text-3xl text-cafe-900 sm:text-4xl">
            Qué vas a encontrar
          </h2>
          <p className="mt-4 text-cafe-600">
            Los precios incluyen impuestos. Si tienes alguna alergia, dínoslo y
            lo miramos contigo en la barra.
          </p>
        </div>

        {/* Selector de categoría: pestañas en escritorio, desplazable en móvil */}
        <div
          role="tablist"
          aria-label="Categorías de la carta"
          className="mt-8 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {ordenadas.map((c) => {
            const seleccionada = c.id === categoria.id
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={seleccionada}
                aria-controls={`panel-${c.id}`}
                id={`pestana-${c.id}`}
                onClick={() => setActiva(c.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.9375rem] transition-colors ${
                  seleccionada
                    ? 'border-cafe-700 bg-cafe-700 text-crema-50'
                    : 'border-cafe-200 bg-crema-50 text-cafe-600 hover:border-cafe-300 hover:bg-crema-200'
                }`}
              >
                {c.nombre}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div
            role="tabpanel"
            id={`panel-${categoria.id}`}
            aria-labelledby={`pestana-${categoria.id}`}
          >
            <p className="text-cafe-500 italic">{categoria.descripcion}</p>

            <ul className="mt-6 divide-y divide-cafe-200/60">
              {items.map((p) => (
                <li key={p.id} className="flex gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3
                        className={`font-medium ${
                          p.disponible ? 'text-cafe-800' : 'text-cafe-500'
                        }`}
                      >
                        {p.nombre}
                      </h3>
                      {p.destacado && p.disponible && (
                        <Etiqueta tono="aviso">Nuestra recomendación</Etiqueta>
                      )}
                      {!p.disponible && (
                        <Etiqueta tono="apagado">Hoy no tenemos</Etiqueta>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-cafe-500">
                      {p.descripcion}
                    </p>
                    {p.alergenos.length > 0 && (
                      <p className="mt-1.5 text-xs text-cafe-500">
                        Contiene: {p.alergenos.join(', ')}
                      </p>
                    )}
                  </div>
                  <p
                    className={`shrink-0 font-medium tabular-nums ${
                      p.disponible ? 'text-cafe-700' : 'text-cafe-500'
                    }`}
                  >
                    {precio(p.precio)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 lg:pt-2">
            <img
              src={negocio.fotos.cafe.archivo}
              alt={negocio.fotos.cafe.alt}
              width={960}
              height={640}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <img
              src={negocio.fotos.reposteria.archivo}
              alt={negocio.fotos.reposteria.alt}
              width={960}
              height={640}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
