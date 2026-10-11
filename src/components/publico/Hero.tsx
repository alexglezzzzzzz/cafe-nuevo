import { useDatos } from '../../lib/useDatos'
import { ANIO_ACTUAL, diaDeHoy } from '../../lib/formato'

export function Hero() {
  const { negocio, horario } = useDatos()
  const hoy = horario.semana.find((d) => d.dia === diaDeHoy())

  return (
    <section id="inicio" className="px-5 pt-10 pb-14 sm:px-8 sm:pt-16 sm:pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
            {negocio.direccion.barrio} · {negocio.direccion.ciudad}
          </p>
          <h1 className="fuente-display mt-4 text-[2.5rem] leading-[1.1] text-cafe-900 sm:text-6xl">
            {negocio.lema}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed whitespace-pre-line text-cafe-600">
            {negocio.descripcionCorta}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#carta"
              className="rounded-lg bg-cafe-700 px-6 py-3 font-medium text-crema-50 transition-colors hover:bg-cafe-800"
            >
              Ver la carta
            </a>
            <a
              href="#visitanos"
              className="rounded-lg border border-cafe-300 px-6 py-3 font-medium text-cafe-700 transition-colors hover:border-cafe-400 hover:bg-crema-200"
            >
              Cómo llegar
            </a>
          </div>

          {hoy && (
            <p className="mt-7 flex items-center gap-2 text-sm text-cafe-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  hoy.cerrado ? 'bg-cafe-300' : 'bg-oliva-500'
                }`}
                aria-hidden="true"
              />
              {hoy.cerrado
                ? 'Hoy cerramos. Nos vemos mañana.'
                : `Hoy abrimos de ${hoy.apertura} a ${hoy.cierre}.`}
            </p>
          )}
        </div>

        <div className="relative">
          <img
            src={negocio.fotos.portada.archivo}
            alt={negocio.fotos.portada.alt}
            width={960}
            height={640}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
          />
          <div className="absolute -bottom-5 -left-3 rounded-xl border border-cafe-200 bg-crema-50 px-4 py-3 shadow-sm sm:left-6">
            <p className="fuente-display text-2xl leading-none text-cafe-800">
              {ANIO_ACTUAL - negocio.fundadoEn}
            </p>
            <p className="mt-1 text-xs text-cafe-500">
              años en el barrio
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
