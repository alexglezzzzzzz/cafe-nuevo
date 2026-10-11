import { Link } from 'react-router-dom'
import { VERSION_DATOS } from '../../lib/almacen'
import { descripcionRol, nombreRol } from '../../lib/permisos'
import { Tarjeta } from '../../components/ui'
import { CabeceraPanel } from '../../components/panel/PiezasPanel'
import type { Rol } from '../../lib/tipos'

const roles: Rol[] = ['propietaria', 'encargado', 'sala']

function Seccion({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <Tarjeta>
      <div className="border-b border-cafe-200/70 px-5 py-4">
        <h2 className="fuente-display text-lg text-cafe-800">{titulo}</h2>
      </div>
      <div className="space-y-4 px-5 py-5 text-[0.9375rem] leading-relaxed text-cafe-600">
        {children}
      </div>
    </Tarjeta>
  )
}

export function Ayuda() {
  return (
    <div>
      <CabeceraPanel
        titulo="Ayuda"
        descripcion="Cómo funciona el panel y qué conviene saber de él."
      />

      <div className="mt-6 space-y-6">
        <Seccion titulo="Cómo circula la información">
          <p>
            Cuando alguien rellena el formulario de la web, su mensaje entra en{' '}
            <strong className="text-cafe-800">Mensajes</strong>. Si además
            pedía mesa o encargaba algo, se crea automáticamente la{' '}
            <strong className="text-cafe-800">reserva</strong> o el{' '}
            <strong className="text-cafe-800">encargo</strong>, con su propio
            ciclo de estados, y queda enlazado con el mensaje que lo originó.
          </p>
          <p>
            La carta, los horarios y las novedades que gestionas aquí son
            exactamente los que ve quien entra en la web. No hay dos sitios
            donde tocar lo mismo: cambias el precio de un café y está cambiado
            de cara al público.
          </p>
        </Seccion>

        <Seccion titulo="Los estados">
          <div className="space-y-3">
            <p>
              <strong className="text-cafe-800">Mensajes.</strong> Entran como{' '}
              <em>nuevos</em>, pasan a <em>leídos</em> en cuanto los abres, y se
              marcan como <em>atendidos</em> cuando ya has respondido.
            </p>
            <p>
              <strong className="text-cafe-800">Reservas.</strong> Las de la web
              llegan <em>por confirmar</em>; las que apuntas tú entran ya{' '}
              <em>confirmadas</em>. Después pasan a <em>cumplidas</em> o se{' '}
              <em>cancelan</em>.
            </p>
            <p>
              <strong className="text-cafe-800">Encargos.</strong> Siguen el
              recorrido <em>pendiente</em> → <em>aceptado</em> → <em>listo</em> →{' '}
              <em>entregado</em>, y se pueden cancelar en cualquier punto.
            </p>
          </div>
        </Seccion>

        <Seccion titulo="Los niveles de acceso">
          <dl className="space-y-3">
            {roles.map((r) => (
              <div key={r}>
                <dt className="font-medium text-cafe-800">{nombreRol[r]}</dt>
                <dd>{descripcionRol[r]}</dd>
              </div>
            ))}
          </dl>
          <p>
            Quien crea una cuenta nueva entra como sala. La propietaria puede
            ampliarle el acceso desde{' '}
            <Link
              to="/panel/equipo"
              className="text-terracota-600 underline underline-offset-4"
            >
              Equipo
            </Link>
            .
          </p>
        </Seccion>

        <Seccion titulo="Dónde se guarda todo, y sus límites">
          <p>
            Café Nuevo funciona <strong className="text-cafe-800">sin
            servidor</strong>. Toda la información vive en el almacenamiento
            local del navegador que estés usando (versión {VERSION_DATOS} de
            los datos). Eso tiene tres consecuencias que conviene tener claras:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-cafe-800">
                No se comparte entre dispositivos.
              </strong>{' '}
              Lo que gestionas en el ordenador del local no aparece en tu móvil,
              ni al revés. Cada navegador tiene su propia copia.
            </li>
            <li>
              <strong className="text-cafe-800">
                Los mensajes no salen de aquí.
              </strong>{' '}
              No se envía ningún correo ni ninguna notificación: lo que llega
              por el formulario se guarda y se lee en este panel.
            </li>
            <li>
              <strong className="text-cafe-800">
                El acceso es local.
              </strong>{' '}
              Las contraseñas se guardan en el propio navegador sin cifrar, y la
              recuperación de contraseña entrega el enlace en pantalla en lugar
              de enviarlo por correo, porque no hay servidor que pueda hacerlo.
            </li>
          </ul>
          <p>
            Si borras los datos de navegación del navegador, se pierde todo y la
            aplicación vuelve a empezar con el contenido inicial.
          </p>
        </Seccion>

        <Seccion titulo="Volver a empezar">
          <p>
            En{' '}
            <Link
              to="/panel/ajustes"
              className="text-terracota-600 underline underline-offset-4"
            >
              Ajustes
            </Link>{' '}
            hay un botón para devolver todo el contenido a su estado original:
            la carta, los horarios, las novedades, los mensajes, las reservas,
            los encargos y el equipo. Va bien para dejarlo limpio después de
            probar cosas.
          </p>
        </Seccion>
      </div>
    </div>
  )
}
