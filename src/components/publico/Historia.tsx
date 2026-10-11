import { useDatos } from '../../lib/useDatos'

export function Historia() {
  const { negocio } = useDatos()

  return (
    <section
      id="historia"
      className="border-y border-cafe-200/60 bg-crema-200/40 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <img
          src={negocio.fotos.historia.archivo}
          alt={negocio.fotos.historia.alt}
          width={1024}
          height={683}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />

        <div>
          <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
            La casa
          </p>
          <h2 className="fuente-display mt-3 text-3xl text-cafe-900 sm:text-4xl">
            Desde {negocio.fundadoEn}, en la misma esquina
          </h2>
          <div className="mt-5 space-y-4 text-cafe-600">
            {negocio.historia.map((parrafo, i) => (
              <p key={i} className="leading-relaxed">
                {parrafo}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
