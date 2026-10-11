import { useState } from 'react'
import {
  actualizarNovedad,
  borrarNovedad,
  crearNovedad,
} from '../../lib/gestion'
import { capitalizar, fechaLarga, HOY_ISO } from '../../lib/formato'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  AreaTexto,
  Boton,
  Entrada,
  Etiqueta,
  Modal,
  SinContenido,
  Tarjeta,
} from '../../components/ui'
import {
  CabeceraPanel,
  ConfirmarBorrado,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'
import type { Novedad } from '../../lib/tipos'

export function NovedadesPanel() {
  const usuario = useUsuario()
  const { novedades } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const editable = usuario ? puedeEditar(usuario.rol, 'novedades') : false

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [borrando, setBorrando] = useState<Novedad | null>(null)

  const ordenadas = [...novedades].sort((a, b) => b.fecha.localeCompare(a.fecha))
  const editando = novedades.find((n) => n.id === editandoId) ?? null

  return (
    <div>
      <CabeceraPanel
        titulo="Novedades"
        descripcion="Lo que se cuenta en la web. Solo se ve lo publicado."
        acciones={
          editable ? (
            <Boton
              onClick={() => {
                const n = crearNovedad(HOY_ISO)
                setEditandoId(n.id)
              }}
            >
              Escribir una novedad
            </Boton>
          ) : undefined
        }
      />
      {!editable && <SoloLectura />}

      <div className="mt-6">
        <Tarjeta>
          {ordenadas.length === 0 ? (
            <SinContenido
              titulo="Todavía no hay novedades"
              descripcion="Cuenta algo: un café nuevo, un horario especial, una cata."
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {ordenadas.map((n) => (
                <li
                  key={n.id}
                  className="flex flex-wrap items-start gap-x-4 gap-y-3 px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Etiqueta tono={n.publicada ? 'correcto' : 'apagado'}>
                        {n.publicada ? 'Publicada' : 'Sin publicar'}
                      </Etiqueta>
                      <Etiqueta tono="neutro">{n.etiqueta}</Etiqueta>
                      <span className="text-sm text-cafe-500">
                        {capitalizar(fechaLarga(n.fecha))}
                      </span>
                    </div>
                    <h3
                      className={`mt-1.5 font-medium ${
                        n.titulo ? 'text-cafe-800' : 'text-cafe-500 italic'
                      }`}
                    >
                      {n.titulo || 'Novedad sin título'}
                    </h3>
                    {n.resumen && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-cafe-500">
                        {n.resumen}
                      </p>
                    )}
                  </div>

                  {editable && (
                    <div className="flex gap-2">
                      <Boton
                        variante="contorno"
                        tamano="sm"
                        onClick={() => {
                          actualizarNovedad(n.id, { publicada: !n.publicada })
                          avisar()
                        }}
                      >
                        {n.publicada ? 'Ocultar' : 'Publicar'}
                      </Boton>
                      <Boton
                        variante="contorno"
                        tamano="sm"
                        onClick={() => setEditandoId(n.id)}
                      >
                        Editar
                      </Boton>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      {editando && (
        <Modal
          abierto
          onCerrar={() => setEditandoId(null)}
          ancho="lg"
          titulo={editando.titulo || 'Novedad nueva'}
          descripcion="Los cambios se guardan según los escribes."
          pie={
            <>
              <Boton
                variante="peligro"
                onClick={() => {
                  setBorrando(editando)
                  setEditandoId(null)
                }}
              >
                Borrar
              </Boton>
              <Boton
                variante="contorno"
                onClick={() => {
                  actualizarNovedad(editando.id, {
                    publicada: !editando.publicada,
                  })
                  avisar()
                }}
              >
                {editando.publicada ? 'Ocultar de la web' : 'Publicar en la web'}
              </Boton>
              <Boton onClick={() => setEditandoId(null)}>Hecho</Boton>
            </>
          }
        >
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
              <Entrada
                etiqueta="Título"
                autoFocus
                value={editando.titulo}
                onChange={(e) => {
                  actualizarNovedad(editando.id, { titulo: e.target.value })
                  avisar()
                }}
              />
              <Entrada
                etiqueta="Fecha"
                type="date"
                value={editando.fecha}
                onChange={(e) => {
                  actualizarNovedad(editando.id, { fecha: e.target.value })
                  avisar()
                }}
              />
            </div>
            <Entrada
              etiqueta="Etiqueta"
              placeholder="Café, Eventos, La casa…"
              value={editando.etiqueta}
              onChange={(e) => {
                actualizarNovedad(editando.id, { etiqueta: e.target.value })
                avisar()
              }}
            />
            <AreaTexto
              etiqueta="Resumen"
              rows={2}
              ayuda="Las dos líneas que se leen en la tarjeta de la web."
              value={editando.resumen}
              onChange={(e) => {
                actualizarNovedad(editando.id, { resumen: e.target.value })
                avisar()
              }}
            />
            <AreaTexto
              etiqueta="Texto completo"
              rows={6}
              ayuda="Deja una línea en blanco para separar párrafos."
              value={editando.cuerpo}
              onChange={(e) => {
                actualizarNovedad(editando.id, { cuerpo: e.target.value })
                avisar()
              }}
            />
          </div>
        </Modal>
      )}

      <ConfirmarBorrado
        abierto={borrando !== null}
        titulo="Borrar la novedad"
        descripcion={`Se borrará "${borrando?.titulo || 'esta novedad'}" para siempre.`}
        onCancelar={() => setBorrando(null)}
        onConfirmar={() => {
          if (borrando) borrarNovedad(borrando.id)
          setBorrando(null)
          avisar()
        }}
      />

      {aviso}
    </div>
  )
}
