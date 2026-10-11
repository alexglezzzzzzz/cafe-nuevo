import { cambiarActivo, cambiarRol } from '../../lib/gestion'
import { descripcionRol, nombreRol, puedeEditar } from '../../lib/permisos'
import { fechaYHora, hace } from '../../lib/formato'
import { useDatos, useUsuario } from '../../lib/useDatos'
import { Boton, Etiqueta, Seleccion, Tarjeta } from '../../components/ui'
import {
  CabeceraPanel,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'
import type { Rol } from '../../lib/tipos'

const roles: Rol[] = ['propietaria', 'encargado', 'sala']

export function Equipo() {
  const usuario = useUsuario()
  const { usuarios } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const editable = usuario ? puedeEditar(usuario.rol, 'equipo') : false

  const propietarias = usuarios.filter(
    (u) => u.rol === 'propietaria' && u.activo,
  )

  const ordenados = [...usuarios].sort((a, b) => {
    const orden = { propietaria: 0, encargado: 1, sala: 2 }
    return orden[a.rol] - orden[b.rol] || a.nombre.localeCompare(b.nombre)
  })

  return (
    <div>
      <CabeceraPanel
        titulo="Equipo"
        descripcion="Quién entra al panel y hasta dónde llega."
      />
      {!editable && <SoloLectura />}

      <div className="mt-6">
        <Tarjeta>
          <ul className="divide-y divide-cafe-200/60">
            {ordenados.map((u) => {
              const soyYo = u.id === usuario?.id
              // No se deja al negocio sin ninguna propietaria activa.
              const ultimaPropietaria =
                u.rol === 'propietaria' &&
                u.activo &&
                propietarias.length === 1

              return (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-cafe-800">
                        {u.nombre}
                      </span>
                      {soyYo && <Etiqueta tono="neutro">Tú</Etiqueta>}
                      {!u.activo && (
                        <Etiqueta tono="apagado">Desactivada</Etiqueta>
                      )}
                    </div>
                    <p className="truncate text-sm text-cafe-500">{u.email}</p>
                    <p className="mt-0.5 text-xs text-cafe-500">
                      {u.ultimoAcceso
                        ? `Última entrada ${hace(u.ultimoAcceso)} · ${fechaYHora(u.ultimoAcceso)}`
                        : 'Todavía no ha entrado'}
                      {!u.onboardingCompletado && ' · sin completar la bienvenida'}
                    </p>
                  </div>

                  {editable ? (
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-44">
                        <Seleccion
                          etiqueta="Acceso"
                          value={u.rol}
                          disabled={ultimaPropietaria}
                          onChange={(e) => {
                            cambiarRol(u.id, e.target.value as Rol)
                            avisar()
                          }}
                        >
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {nombreRol[r]}
                            </option>
                          ))}
                        </Seleccion>
                      </div>
                      <Boton
                        variante={u.activo ? 'peligro' : 'contorno'}
                        tamano="sm"
                        disabled={soyYo || ultimaPropietaria}
                        onClick={() => {
                          cambiarActivo(u.id, !u.activo)
                          avisar()
                        }}
                      >
                        {u.activo ? 'Desactivar' : 'Reactivar'}
                      </Boton>
                    </div>
                  ) : (
                    <Etiqueta tono="neutro">{nombreRol[u.rol]}</Etiqueta>
                  )}
                </li>
              )
            })}
          </ul>
        </Tarjeta>
      </div>

      <div className="mt-6">
        <Tarjeta>
          <div className="border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              Qué puede hacer cada acceso
            </h2>
          </div>
          <dl className="divide-y divide-cafe-200/60">
            {roles.map((r) => (
              <div key={r} className="px-5 py-3.5">
                <dt className="font-medium text-cafe-800">{nombreRol[r]}</dt>
                <dd className="mt-0.5 text-sm text-cafe-600">
                  {descripcionRol[r]}
                </dd>
              </div>
            ))}
          </dl>
        </Tarjeta>
      </div>

      {aviso}
    </div>
  )
}
