import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reiniciarDatos, soloEnMemoria, VERSION_DATOS } from '../../lib/almacen'
import { actualizarNegocio } from '../../lib/gestion'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  AreaTexto,
  Aviso,
  Boton,
  Entrada,
  Tarjeta,
} from '../../components/ui'
import {
  CabeceraPanel,
  ConfirmarBorrado,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'

export function Ajustes() {
  const usuario = useUsuario()
  const { negocio, mensajes, reservas, encargos, productos } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const navegar = useNavigate()
  const editable = usuario ? puedeEditar(usuario.rol, 'ajustes') : false
  const [reiniciando, setReiniciando] = useState(false)

  function cambiar(cambios: Parameters<typeof actualizarNegocio>[0]) {
    actualizarNegocio(cambios)
    avisar()
  }

  return (
    <div>
      <CabeceraPanel
        titulo="Ajustes"
        descripcion="Los datos del negocio y el estado de la información guardada."
      />
      {!editable && <SoloLectura />}

      <div className="mt-6 space-y-6">
        <Tarjeta>
          <div className="border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              El negocio
            </h2>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Entrada
              etiqueta="Nombre"
              disabled={!editable}
              value={negocio.nombre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
            />
            <Entrada
              etiqueta="Lema"
              disabled={!editable}
              value={negocio.lema}
              onChange={(e) => cambiar({ lema: e.target.value })}
            />
            <div className="sm:col-span-2">
              <AreaTexto
                etiqueta="Descripción corta"
                rows={2}
                disabled={!editable}
                ayuda="El párrafo que se lee bajo el titular de la web."
                value={negocio.descripcionCorta}
                onChange={(e) => cambiar({ descripcionCorta: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <AreaTexto
                etiqueta="Historia"
                rows={6}
                disabled={!editable}
                ayuda="Deja una línea en blanco para separar párrafos."
                value={negocio.historia.join('\n\n')}
                onChange={(e) =>
                  cambiar({
                    historia: e.target.value
                      .split('\n\n')
                      .map((p) => p.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </Tarjeta>

        <Tarjeta>
          <div className="border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">Contacto</h2>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Entrada
              etiqueta="Teléfono"
              disabled={!editable}
              value={negocio.telefono}
              onChange={(e) => cambiar({ telefono: e.target.value })}
            />
            <Entrada
              etiqueta="Correo"
              type="email"
              disabled={!editable}
              value={negocio.email}
              onChange={(e) => cambiar({ email: e.target.value })}
            />
            <Entrada
              etiqueta="Calle y número"
              disabled={!editable}
              value={negocio.direccion.calle}
              onChange={(e) =>
                cambiar({
                  direccion: { ...negocio.direccion, calle: e.target.value },
                })
              }
            />
            <Entrada
              etiqueta="Código postal"
              disabled={!editable}
              value={negocio.direccion.codigoPostal}
              onChange={(e) =>
                cambiar({
                  direccion: {
                    ...negocio.direccion,
                    codigoPostal: e.target.value,
                  },
                })
              }
            />
            <Entrada
              etiqueta="Ciudad"
              disabled={!editable}
              value={negocio.direccion.ciudad}
              onChange={(e) =>
                cambiar({
                  direccion: { ...negocio.direccion, ciudad: e.target.value },
                })
              }
            />
            <Entrada
              etiqueta="Barrio"
              disabled={!editable}
              value={negocio.direccion.barrio}
              onChange={(e) =>
                cambiar({
                  direccion: { ...negocio.direccion, barrio: e.target.value },
                })
              }
            />
            <Entrada
              etiqueta="Instagram"
              disabled={!editable}
              value={negocio.redes.instagram}
              onChange={(e) =>
                cambiar({
                  redes: { ...negocio.redes, instagram: e.target.value },
                })
              }
            />
            <Entrada
              etiqueta="Facebook"
              disabled={!editable}
              value={negocio.redes.facebook}
              onChange={(e) =>
                cambiar({
                  redes: { ...negocio.redes, facebook: e.target.value },
                })
              }
            />
            <div className="sm:col-span-2">
              <AreaTexto
                etiqueta="Cómo llegar"
                rows={4}
                disabled={!editable}
                ayuda="Una indicación por línea."
                value={negocio.comoLlegar.join('\n')}
                onChange={(e) =>
                  cambiar({
                    comoLlegar: e.target.value
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </Tarjeta>

        <Tarjeta>
          <div className="border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              La información guardada
            </h2>
          </div>
          <div className="space-y-5 p-5">
            <p className="text-[0.9375rem] leading-relaxed text-cafe-600">
              Café Nuevo guarda todo en el navegador que estés usando, sin
              servidor. Lo que se escribe aquí no viaja a ninguna parte y no se
              comparte con otros dispositivos ni con el resto del equipo.
            </p>

            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[12rem_1fr]">
              <dt className="text-cafe-500">Dónde</dt>
              <dd className="text-cafe-800">
                {soloEnMemoria()
                  ? 'Solo en memoria: este navegador no permite guardar y se perderá al cerrar'
                  : 'Almacenamiento local del navegador'}
              </dd>
              <dt className="text-cafe-500">Versión de los datos</dt>
              <dd className="text-cafe-800">{VERSION_DATOS}</dd>
              <dt className="text-cafe-500">Contenido</dt>
              <dd className="text-cafe-800">
                {productos.length} productos · {mensajes.length} mensajes ·{' '}
                {reservas.length} reservas · {encargos.length} encargos
              </dd>
            </dl>

            {soloEnMemoria() && (
              <Aviso tipo="atencion" titulo="No se está guardando nada">
                Este navegador tiene el almacenamiento bloqueado. Todo
                funcionará, pero los cambios se perderán al cerrar la pestaña.
              </Aviso>
            )}

            {editable && (
              <div className="border-t border-cafe-200/70 pt-5">
                <h3 className="font-medium text-cafe-800">
                  Volver al contenido original
                </h3>
                <p className="mt-1 text-sm text-cafe-600">
                  Devuelve la carta, los horarios, las novedades, los mensajes y
                  el equipo a como estaban al principio. Se perderá todo lo que
                  se haya cambiado y se cerrará la sesión.
                </p>
                <Boton
                  variante="peligro"
                  className="mt-4"
                  onClick={() => setReiniciando(true)}
                >
                  Reiniciar el contenido
                </Boton>
              </div>
            )}
          </div>
        </Tarjeta>
      </div>

      <ConfirmarBorrado
        abierto={reiniciando}
        titulo="Reiniciar el contenido"
        descripcion="Todo volverá a su estado inicial y se cerrará la sesión. No se puede deshacer."
        textoBoton="Reiniciar"
        onCancelar={() => setReiniciando(false)}
        onConfirmar={() => {
          // Reiniciar cierra la sesión, así que se sale a la pantalla de
          // acceso: es donde la ruta protegida dejaría a quien estuviera aquí.
          reiniciarDatos()
          navegar('/acceso', { replace: true })
        }}
      />

      {aviso}
    </div>
  )
}
