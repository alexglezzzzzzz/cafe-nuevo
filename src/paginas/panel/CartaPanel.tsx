import { useMemo, useState } from 'react'
import {
  actualizarCategoria,
  actualizarProducto,
  borrarCategoria,
  borrarProducto,
  crearCategoria,
  crearProducto,
  moverProducto,
} from '../../lib/gestion'
import { precio } from '../../lib/formato'
import { puedeEditar } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'
import {
  AreaTexto,
  Boton,
  Casilla,
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
import type { Alergeno, ProductoCarta } from '../../lib/tipos'

const alergenosPosibles: Alergeno[] = [
  'gluten',
  'lactosa',
  'huevo',
  'frutos secos',
  'soja',
  'pescado',
]

export function CartaPanel() {
  const usuario = useUsuario()
  const { categorias, productos } = useDatos()
  const { avisar, aviso } = useAvisoGuardado()
  const editable = usuario ? puedeEditar(usuario.rol, 'carta') : false

  const ordenadas = useMemo(
    () => [...categorias].sort((a, b) => a.orden - b.orden),
    [categorias],
  )
  const [activaId, setActivaId] = useState(ordenadas[0]?.id ?? '')
  const activa = ordenadas.find((c) => c.id === activaId) ?? ordenadas[0]

  const [editando, setEditando] = useState<ProductoCarta | null>(null)
  const [borrandoProducto, setBorrandoProducto] =
    useState<ProductoCarta | null>(null)
  const [borrandoCategoria, setBorrandoCategoria] = useState(false)

  const items = useMemo(
    () =>
      productos
        .filter((p) => p.categoriaId === activa?.id)
        .sort((a, b) => a.orden - b.orden),
    [productos, activa],
  )

  if (!activa) {
    return (
      <div>
        <CabeceraPanel
          titulo="Carta"
          descripcion="Lo que se ve en la web."
          acciones={
            editable ? (
              <Boton
                onClick={() => {
                  const c = crearCategoria()
                  setActivaId(c.id)
                  avisar()
                }}
              >
                Crear la primera categoría
              </Boton>
            ) : undefined
          }
        />
        <div className="mt-6">
          <Tarjeta>
            <SinContenido
              titulo="La carta está vacía"
              descripcion="Crea una categoría para empezar a añadir productos."
            />
          </Tarjeta>
        </div>
        {aviso}
      </div>
    )
  }

  return (
    <div>
      <CabeceraPanel
        titulo="Carta"
        descripcion="Lo que cambies aquí se ve en la web al momento."
        acciones={
          editable ? (
            <Boton
              variante="contorno"
              onClick={() => {
                const c = crearCategoria()
                setActivaId(c.id)
                avisar()
              }}
            >
              Nueva categoría
            </Boton>
          ) : undefined
        }
      />
      {!editable && <SoloLectura />}

      <div className="mt-6 flex flex-wrap gap-2">
        {ordenadas.map((c) => {
          const seleccionada = c.id === activa.id
          const cuantos = productos.filter((p) => p.categoriaId === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => setActivaId(c.id)}
              aria-current={seleccionada ? 'true' : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                seleccionada
                  ? 'border-cafe-700 bg-cafe-700 text-crema-50'
                  : 'border-cafe-200 bg-crema-50 text-cafe-600 hover:bg-crema-200'
              }`}
            >
              {c.nombre || 'Sin nombre'}
              <span
                className={seleccionada ? 'ml-1.5 opacity-70' : 'ml-1.5 text-cafe-500'}
              >
                {cuantos}
              </span>
            </button>
          )
        })}
      </div>

      {editable && (
        <div className="mt-5">
          <Tarjeta>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Entrada
                etiqueta="Nombre de la categoría"
                value={activa.nombre}
                onChange={(e) => {
                  actualizarCategoria(activa.id, { nombre: e.target.value })
                  avisar()
                }}
              />
              <Entrada
                etiqueta="Descripción"
                placeholder="La frase que aparece bajo el nombre en la web"
                value={activa.descripcion}
                onChange={(e) => {
                  actualizarCategoria(activa.id, {
                    descripcion: e.target.value,
                  })
                  avisar()
                }}
              />
            </div>
            <div className="flex justify-end border-t border-cafe-200/70 px-5 py-3">
              <Boton
                variante="peligro"
                tamano="sm"
                onClick={() => setBorrandoCategoria(true)}
              >
                Borrar la categoría
              </Boton>
            </div>
          </Tarjeta>
        </div>
      )}

      <div className="mt-5">
        <Tarjeta>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cafe-200/70 px-5 py-4">
            <h2 className="fuente-display text-lg text-cafe-800">
              Productos de {activa.nombre || 'la categoría'}
            </h2>
            {editable && (
              <Boton
                tamano="sm"
                onClick={() => {
                  const p = crearProducto(activa.id)
                  setEditando(p)
                }}
              >
                Añadir producto
              </Boton>
            )}
          </div>

          {items.length === 0 ? (
            <SinContenido
              titulo="Esta categoría está vacía"
              descripcion="Añade el primer producto y aparecerá en la carta de la web."
            />
          ) : (
            <ul className="divide-y divide-cafe-200/60">
              {items.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-crema-100"
                >
                  {editable && (
                    <div className="-my-1 flex shrink-0 flex-col">
                      <BotonOrden
                        direccion={-1}
                        desactivado={i === 0}
                        onClick={() => {
                          moverProducto(p.id, -1)
                          avisar()
                        }}
                      />
                      <BotonOrden
                        direccion={1}
                        desactivado={i === items.length - 1}
                        onClick={() => {
                          moverProducto(p.id, 1)
                          avisar()
                        }}
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`font-medium ${
                          p.nombre ? 'text-cafe-800' : 'text-cafe-500 italic'
                        }`}
                      >
                        {p.nombre || 'Producto sin nombre'}
                      </span>
                      {p.destacado && (
                        <Etiqueta tono="aviso">Recomendado</Etiqueta>
                      )}
                      {!p.disponible && (
                        <Etiqueta tono="apagado">No disponible</Etiqueta>
                      )}
                    </div>
                    {p.descripcion && (
                      <p className="mt-0.5 line-clamp-1 text-sm text-cafe-500">
                        {p.descripcion}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 font-medium tabular-nums text-cafe-700">
                    {precio(p.precio)}
                  </span>

                  {editable && (
                    <Boton
                      variante="contorno"
                      tamano="sm"
                      onClick={() => setEditando(p)}
                    >
                      Editar
                    </Boton>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      {editando && (
        <EditorProducto
          producto={
            productos.find((p) => p.id === editando.id) ?? editando
          }
          onCambio={(cambios) => {
            actualizarProducto(editando.id, cambios)
            avisar()
          }}
          onBorrar={() => {
            setBorrandoProducto(editando)
            setEditando(null)
          }}
          onCerrar={() => setEditando(null)}
        />
      )}

      <ConfirmarBorrado
        abierto={borrandoProducto !== null}
        titulo="Borrar el producto"
        descripcion={`Se quitará "${borrandoProducto?.nombre || 'este producto'}" de la carta. Si solo se ha acabado hoy, es mejor marcarlo como no disponible.`}
        onCancelar={() => setBorrandoProducto(null)}
        onConfirmar={() => {
          if (borrandoProducto) borrarProducto(borrandoProducto.id)
          setBorrandoProducto(null)
          avisar()
        }}
      />

      <ConfirmarBorrado
        abierto={borrandoCategoria}
        titulo="Borrar la categoría"
        descripcion={`Se borrará "${activa.nombre}" y los ${items.length} productos que contiene. No se puede deshacer.`}
        textoBoton="Borrar todo"
        onCancelar={() => setBorrandoCategoria(false)}
        onConfirmar={() => {
          borrarCategoria(activa.id)
          setBorrandoCategoria(false)
          setActivaId(ordenadas.find((c) => c.id !== activa.id)?.id ?? '')
          avisar()
        }}
      />

      {aviso}
    </div>
  )
}

function BotonOrden({
  direccion,
  desactivado,
  onClick,
}: {
  direccion: -1 | 1
  desactivado: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactivado}
      aria-label={direccion === -1 ? 'Subir' : 'Bajar'}
      className="flex h-8 w-8 items-center justify-center rounded text-cafe-500 transition-colors hover:bg-crema-200 hover:text-cafe-800 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {direccion === -1 ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
      </svg>
    </button>
  )
}

function EditorProducto({
  producto,
  onCambio,
  onBorrar,
  onCerrar,
}: {
  producto: ProductoCarta
  onCambio: (cambios: Partial<ProductoCarta>) => void
  onBorrar: () => void
  onCerrar: () => void
}) {
  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      ancho="lg"
      titulo={producto.nombre || 'Producto nuevo'}
      descripcion="Los cambios se guardan según los escribes."
      pie={
        <>
          <Boton variante="peligro" onClick={onBorrar}>
            Borrar
          </Boton>
          <Boton onClick={onCerrar}>Hecho</Boton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
          <Entrada
            etiqueta="Nombre"
            autoFocus
            placeholder="Cómo se llama en la carta"
            value={producto.nombre}
            onChange={(e) => onCambio({ nombre: e.target.value })}
          />
          <Entrada
            etiqueta="Precio"
            type="number"
            min={0}
            step="0.1"
            value={producto.precio}
            onChange={(e) => onCambio({ precio: Number(e.target.value) })}
          />
        </div>

        <AreaTexto
          etiqueta="Descripción"
          rows={2}
          placeholder="Una línea que dé ganas"
          value={producto.descripcion}
          onChange={(e) => onCambio({ descripcion: e.target.value })}
        />

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-cafe-700">
            Alérgenos
          </legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {alergenosPosibles.map((a) => (
              <Casilla
                key={a}
                etiqueta={a}
                checked={producto.alergenos.includes(a)}
                onChange={(e) =>
                  onCambio({
                    alergenos: e.target.checked
                      ? [...producto.alergenos, a]
                      : producto.alergenos.filter((x) => x !== a),
                  })
                }
              />
            ))}
          </div>
        </fieldset>

        <div className="space-y-3 border-t border-cafe-200/70 pt-5">
          <Casilla
            etiqueta="Disponible"
            descripcion="Si se ha acabado, quítalo de aquí en vez de borrarlo."
            checked={producto.disponible}
            onChange={(e) => onCambio({ disponible: e.target.checked })}
          />
          <Casilla
            etiqueta="Recomendado"
            descripcion="Se destaca en la carta de la web."
            checked={producto.destacado}
            onChange={(e) => onCambio({ destacado: e.target.checked })}
          />
        </div>
      </div>
    </Modal>
  )
}
