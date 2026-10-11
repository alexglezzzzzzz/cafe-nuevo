import { useDatos } from '../../lib/useDatos'
import { Aviso } from '../../components/ui'
import { Apartado, MarcoTexto } from './MarcoTexto'

export function Privacidad() {
  const { negocio } = useDatos()

  return (
    <MarcoTexto
      titulo="Política de privacidad"
      entradilla="Qué pasa con los datos que nos dejas en el formulario."
    >
      <Aviso tipo="informacion" titulo="Cómo funciona esta web">
        Esta web no tiene servidor. Lo que escribes en el formulario se guarda
        en el almacenamiento local de tu propio navegador y no se envía a
        ningún sitio: ni a nosotros, ni a terceros. Si borras los datos de
        navegación, desaparece.
      </Aviso>

      <Apartado titulo="Quién trata los datos">
        <p>
          {negocio.nombre}, con domicilio en {negocio.direccion.calle},{' '}
          {negocio.direccion.codigoPostal} {negocio.direccion.ciudad}. Puedes
          escribirnos a {negocio.email} o llamarnos al {negocio.telefono}.
        </p>
      </Apartado>

      <Apartado titulo="Qué recogemos y para qué">
        <p>
          El formulario pide nombre, correo electrónico y, según el motivo,
          teléfono, fecha, hora y número de personas. Sirven únicamente para
          responderte y para organizar la reserva o el encargo que nos pidas.
        </p>
        <p>
          No usamos esos datos para enviarte publicidad, no los cedemos a nadie
          y no hacemos perfiles con ellos.
        </p>
      </Apartado>

      <Apartado titulo="Cuánto tiempo se conservan">
        <p>
          Mientras hagan falta para atenderte y, después, el tiempo que exijan
          las obligaciones legales del negocio. En la práctica, al funcionar
          sobre el almacenamiento del navegador, se conservan hasta que se
          borran los datos de navegación o se reinicia el contenido desde el
          panel.
        </p>
      </Apartado>

      <Apartado titulo="Cookies y seguimiento">
        <p>
          No usamos cookies de publicidad ni de analítica, y no hay ningún
          servicio de medición de terceros. El único almacenamiento que se
          utiliza es el técnico, necesario para que la web funcione.
        </p>
      </Apartado>

      <Apartado titulo="Tus derechos">
        <p>
          Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, limitar
          su uso u oponerte a él escribiendo a {negocio.email}. También puedes
          reclamar ante la Agencia Española de Protección de Datos si crees que
          no lo hemos hecho bien.
        </p>
      </Apartado>
    </MarcoTexto>
  )
}
