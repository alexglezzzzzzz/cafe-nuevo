import { useDatos } from '../../lib/useDatos'
import { FormularioContacto } from './FormularioContacto'

export function Contacto() {
  const { negocio } = useDatos()

  return (
    <section id="contacto" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium tracking-[0.12em] text-cafe-500 uppercase">
            Hablamos
          </p>
          <h2 className="fuente-display mt-3 text-3xl text-cafe-900 sm:text-4xl">
            Escríbenos
          </h2>
          <p className="mt-4 leading-relaxed text-cafe-600">
            Para reservar mesa, encargar una tarta o preguntar cualquier cosa.
            Contestamos el mismo día, salvo los domingos por la tarde.
          </p>

          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-sm text-cafe-500">Teléfono</dt>
              <dd className="text-lg text-cafe-800">{negocio.telefono}</dd>
            </div>
            <div>
              <dt className="text-sm text-cafe-500">Correo</dt>
              <dd className="text-lg text-cafe-800">{negocio.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-cafe-500">Redes</dt>
              <dd className="text-lg text-cafe-800">
                {negocio.redes.instagram}
              </dd>
            </div>
          </dl>
        </div>

        <FormularioContacto />
      </div>
    </section>
  )
}
