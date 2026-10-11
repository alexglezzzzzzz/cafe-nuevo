import { useState } from 'react'
import {
  actualizarDiaEspecial,
  actualizarNotaHorario,
  actualizarTramo,
  borrarDiaEspecial,
  crearDiaEspecial,
} from '../../lib/gestion'
import { capitalizar, fechaLarga, HOY_ISO, nombreDia } from '../../lib/formato'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  AreaTexto,
  Boton,
  Casilla,
  Entrada,
  Etiqueta,
  SinContenido,
  Tarjeta,
} from '../../components/ui'
import {
  CabeceraPanel,
  ConfirmarBorrado,
  SoloLectura,
} from '../../components/panel/PiezasPanel'
import { useAvisoGuardado } from '../../components/panel/useAvisoGuardado'

export function Horarios() {
  const usuario = useUsuario()
  const { horario } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const editable = usuario ? puedeEditar(usuario.rol, 'horarios') : false
  const [borrando, setBorrando] = useState<string | null>(null)

  const semana = [...horario.semana].sort((a, b) => a.dia - b.dia)
  const especiales = [...horario.especiales].sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  )

  return (
    <div>
      <CabeceraPanel
        titulo="Horarios"
        descripcion="La semana habitual y los días que se salen de lo normal."
      />
      {!editable && <SoloLectura />}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Tarjeta>
          <div className="border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              La semana
            </h2>
          </div>
          <ul className="divide-y divide-cafe-200/60">
            {semana.map((t) => (
              <li
                key={t.dia}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3.5"
              >
                <span className="w-24 shrink-0 font-medium text-cafe-800">
                  {nombreDia[t.dia]}
                </span>

                {editable ? (
                  <>
                    <label className="flex items-center gap-2 text-sm text-cafe-600">
                      <input
                        type="checkbox"
                        checked={!t.cerrado}
                        onChange={(e) => {
                          actualizarTramo(t.dia, { cerrado: !e.target.checked })
                          avisar()
                        }}
                        className="h-4 w-4 cursor-pointer rounded accent-cafe-700"
                      />
                      Abierto
                    </label>

                    {!t.cerrado && (
                      <div className="ml-auto flex items-center gap-2">
                        <input
                          type="time"
                          aria-label={`Hora de apertura del ${nombreDia[t.dia].toLowerCase()}`}
                          value={t.apertura}
                          onChange={(e) => {
                            actualizarTramo(t.dia, { apertura: e.target.value })
                            avisar()
                          }}
                          className="rounded-lg border border-cafe-200 bg-crema-50 px-2.5 py-1.5 text-sm tabular-nums text-cafe-800 hover:border-cafe-300 focus:border-cafe-500"
                        />
                        <span className="text-cafe-500">–</span>
                        <input
                          type="time"
                          aria-label={`Hora de cierre del ${nombreDia[t.dia].toLowerCase()}`}
                          value={t.cierre}
                          onChange={(e) => {
                            actualizarTramo(t.dia, { cierre: e.target.value })
                            avisar()
                          }}
                          className="rounded-lg border border-cafe-200 bg-crema-50 px-2.5 py-1.5 text-sm tabular-nums text-cafe-800 hover:border-cafe-300 focus:border-cafe-500"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="ml-auto tabular-nums text-cafe-600">
                    {t.cerrado ? 'Cerrado' : `${t.apertura} – ${t.cierre}`}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-cafe-200/70 px-5 py-4">
            {editable ? (
              <AreaTexto
                etiqueta="Nota bajo el horario"
                rows={2}
                value={horario.nota}
                onChange={(e) => {
                  actualizarNotaHorario(e.target.value)
                  avisar()
                }}
              />
            ) : (
              <p className="text-sm text-cafe-600">{horario.nota}</p>
            )}
          </div>
        </Tarjeta>

        <Tarjeta>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              Días especiales
            </h2>
            {editable && (
              <Boton
                tamano="sm"
                onClick={() => {
                  crearDiaEspecial(HOY_ISO)
                  avisar()
                }}
              >
                Añadir un día
              </Boton>
            )}
          </div>

          {especiales.length === 0 ? (
            <SinContenido
              titulo="Ningún día especial"
              descripcion="Aquí van las fiestas, los cierres por vacaciones y los horarios distintos."
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {especiales.map((e) => {
                const pasado = e.fecha < HOY_ISO
                return (
                  <li key={e.id} className="px-5 py-4">
                    {editable ? (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                          <Entrada
                            etiqueta="Fecha"
                            type="date"
                            value={e.fecha}
                            onChange={(ev) => {
                              actualizarDiaEspecial(e.id, {
                                fecha: ev.target.value,
                              })
                              avisar()
                            }}
                          />
                          <Entrada
                            etiqueta="Motivo"
                            placeholder="Navidad, vacaciones, una cata…"
                            value={e.motivo}
                            onChange={(ev) => {
                              actualizarDiaEspecial(e.id, {
                                motivo: ev.target.value,
                              })
                              avisar()
                            }}
                          />
                        </div>

                        <div className="flex flex-wrap items-end gap-4">
                          <Casilla
                            etiqueta="Cerrado todo el día"
                            checked={e.cerrado}
                            onChange={(ev) => {
                              actualizarDiaEspecial(e.id, {
                                cerrado: ev.target.checked,
                              })
                              avisar()
                            }}
                          />
                          {!e.cerrado && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                aria-label="Apertura del día especial"
                                value={e.apertura ?? '09:00'}
                                onChange={(ev) => {
                                  actualizarDiaEspecial(e.id, {
                                    apertura: ev.target.value,
                                  })
                                  avisar()
                                }}
                                className="rounded-lg border border-cafe-200 bg-crema-50 px-2.5 py-1.5 text-sm tabular-nums text-cafe-800"
                              />
                              <span className="text-cafe-500">–</span>
                              <input
                                type="time"
                                aria-label="Cierre del día especial"
                                value={e.cierre ?? '20:00'}
                                onChange={(ev) => {
                                  actualizarDiaEspecial(e.id, {
                                    cierre: ev.target.value,
                                  })
                                  avisar()
                                }}
                                className="rounded-lg border border-cafe-200 bg-crema-50 px-2.5 py-1.5 text-sm tabular-nums text-cafe-800"
                              />
                            </div>
                          )}
                          <Boton
                            variante="peligro"
                            tamano="sm"
                            className="ml-auto"
                            onClick={() => setBorrando(e.id)}
                          >
                            Quitar
                          </Boton>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-cafe-800">
                          {capitalizar(fechaLarga(e.fecha))}
                        </span>
                        <span className="text-cafe-600">{e.motivo}</span>
                        <span className="ml-auto text-sm text-cafe-500">
                          {e.cerrado
                            ? 'Cerrado'
                            : `${e.apertura} – ${e.cierre}`}
                        </span>
                      </div>
                    )}
                    {pasado && (
                      <p className="mt-2">
                        <Etiqueta tono="apagado">Ya ha pasado</Etiqueta>
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Tarjeta>
      </div>

      <ConfirmarBorrado
        abierto={borrando !== null}
        titulo="Quitar el día especial"
        descripcion="Ese día volverá a regirse por el horario normal de la semana."
        textoBoton="Quitar"
        onCancelar={() => setBorrando(null)}
        onConfirmar={() => {
          if (borrando) borrarDiaEspecial(borrando)
          setBorrando(null)
          avisar()
        }}
      />

      {aviso}
    </div>
  )
}
