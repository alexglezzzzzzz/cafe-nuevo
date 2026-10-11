import { useDatos } from '../../lib/useDatos'
import { Apartado, MarcoTexto } from './MarcoTexto'

export function AvisoLegal() {
  const { negocio } = useDatos()

  return (
    <MarcoTexto
      titulo="Aviso legal"
      entradilla="Quiénes somos y en qué condiciones se usa esta web."
    >
      <Apartado titulo="Titular">
        <p>
          {negocio.nombre}, con domicilio en {negocio.direccion.calle},{' '}
          {negocio.direccion.codigoPostal} {negocio.direccion.ciudad}, barrio de{' '}
          {negocio.direccion.barrio}.
        </p>
        <p>
          Teléfono {negocio.telefono}. Correo electrónico {negocio.email}.
        </p>
      </Apartado>

      <Apartado titulo="Uso de la web">
        <p>
          Esta web ofrece información sobre la cafetería: la carta, los
          horarios, la ubicación y las novedades del local, además de un
          formulario para ponerse en contacto, reservar mesa o hacer un
          encargo.
        </p>
        <p>
          Una reserva solicitada por el formulario no queda confirmada hasta
          que la confirmamos nosotros. Lo mismo vale para los encargos, cuyo
          precio final se acuerda antes de prepararlos.
        </p>
      </Apartado>

      <Apartado titulo="Precios y disponibilidad">
        <p>
          Los precios de la carta incluyen impuestos y pueden cambiar. La
          disponibilidad de cada producto depende del día: lo que se acaba se
          marca como no disponible, pero puede haber diferencias entre lo que
          ves aquí y lo que queda en la barra.
        </p>
      </Apartado>

      <Apartado titulo="Propiedad intelectual">
        <p>
          Los textos y el diseño de esta web pertenecen a {negocio.nombre}. Las
          fotografías proceden de bancos de imágenes con licencia libre para
          uso comercial.
        </p>
      </Apartado>

      <Apartado titulo="Responsabilidad">
        <p>
          Procuramos que la información esté siempre al día, pero no podemos
          garantizar que no haya errores puntuales en horarios, precios o
          disponibilidad. Ante cualquier duda, llámanos y te lo confirmamos.
        </p>
      </Apartado>
    </MarcoTexto>
  )
}
