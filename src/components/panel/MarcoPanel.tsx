import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { salir } from '../../lib/sesion'
import { nombreRol, puedeVer, type Seccion } from '../../lib/permisos'
import { useDatos, useUsuario } from '../../lib/useDatos'

interface Apartado {
  seccion: Seccion
  ruta: string
  texto: string
  icono: React.ReactNode
}

const trazo = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const apartados: Apartado[] = [
  {
    seccion: 'inicio',
    ruta: '/panel',
    texto: 'Inicio',
    icono: <path {...trazo} d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />,
  },
  {
    seccion: 'mensajes',
    ruta: '/panel/mensajes',
    texto: 'Mensajes',
    icono: <path {...trazo} d="M4 6h16v12H4V6Zm0 .5 8 6 8-6" />,
  },
  {
    seccion: 'reservas',
    ruta: '/panel/reservas',
    texto: 'Reservas',
    icono: (
      <path
        {...trazo}
        d="M5 6h14v14H5V6Zm3-3v4m8-4v4M5 11h14"
      />
    ),
  },
  {
    seccion: 'encargos',
    ruta: '/panel/encargos',
    texto: 'Encargos',
    icono: <path {...trazo} d="M4 8h16l-1 12H5L4 8Zm4 0a4 4 0 0 1 8 0" />,
  },
  {
    seccion: 'carta',
    ruta: '/panel/carta',
    texto: 'Carta',
    icono: <path {...trazo} d="M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5" />,
  },
  {
    seccion: 'horarios',
    ruta: '/panel/horarios',
    texto: 'Horarios',
    icono: <path {...trazo} d="M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />,
  },
  {
    seccion: 'novedades',
    ruta: '/panel/novedades',
    texto: 'Novedades',
    icono: <path {...trazo} d="M4 5h16v14H4V5Zm3 4h6M7 13h10M7 16h10" />,
  },
  {
    seccion: 'equipo',
    ruta: '/panel/equipo',
    texto: 'Equipo',
    icono: (
      <path
        {...trazo}
        d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 8v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1m14-9a3 3 0 1 0 0-6m5 15v-1a4 4 0 0 0-3-3.9"
      />
    ),
  },
  {
    seccion: 'ajustes',
    ruta: '/panel/ajustes',
    texto: 'Ajustes',
    icono: (
      <path
        {...trazo}
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3-2-.6a6 6 0 0 0-.6-1.5l1-1.8-1.5-1.5-1.8 1a6 6 0 0 0-1.5-.6L13 5h-2l-.6 2a6 6 0 0 0-1.5.6l-1.8-1L5.6 8.1l1 1.8a6 6 0 0 0-.6 1.5L4 12v2l2 .6a6 6 0 0 0 .6 1.5l-1 1.8 1.5 1.5 1.8-1a6 6 0 0 0 1.5.6l.6 2h2l.6-2a6 6 0 0 0 1.5-.6l1.8 1 1.5-1.5-1-1.8a6 6 0 0 0 .6-1.5l2-.6v-2Z"
      />
    ),
  },
]

export function MarcoPanel() {
  const usuario = useUsuario()
  const { mensajes } = useDatos()
  const navegar = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  if (!usuario) return null

  const visibles = apartados.filter((a) => puedeVer(usuario.rol, a.seccion))
  const sinLeer = mensajes.filter((m) => m.estado === 'nuevo').length

  function cerrar() {
    salir()
    navegar('/', { replace: true })
  }

  const navegacion = (
    <nav aria-label="Secciones del panel" className="space-y-0.5">
      {visibles.map((a) => (
        <NavLink
          key={a.ruta}
          to={a.ruta}
          end={a.ruta === '/panel'}
          onClick={() => setMenuAbierto(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors ${
              isActive
                ? 'bg-cafe-700 text-crema-50'
                : 'text-cafe-600 hover:bg-crema-200 hover:text-cafe-800'
            }`
          }
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
            {a.icono}
          </svg>
          <span className="flex-1">{a.texto}</span>
          {a.seccion === 'mensajes' && sinLeer > 0 && (
            <span className="rounded-full bg-terracota-500 px-2 py-0.5 text-xs font-semibold text-white">
              {sinLeer}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )

  const fichaUsuario = (
    <div className="border-t border-cafe-200/70 pt-4">
      <p className="truncate font-medium text-cafe-800">{usuario.nombre}</p>
      <p className="text-sm text-cafe-500">{nombreRol[usuario.rol]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to="/panel/ayuda"
          onClick={() => setMenuAbierto(false)}
          className="rounded-lg border border-cafe-200 px-3 py-1.5 text-sm text-cafe-600 transition-colors hover:bg-crema-200"
        >
          Ayuda
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-cafe-200 px-3 py-1.5 text-sm text-cafe-600 transition-colors hover:bg-crema-200"
        >
          Ver la web
        </Link>
        <button
          type="button"
          onClick={cerrar}
          className="rounded-lg border border-cafe-200 px-3 py-1.5 text-sm text-cafe-600 transition-colors hover:bg-crema-200"
        >
          Salir
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh bg-crema-100">
      {/* Barra superior, solo en móvil */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-cafe-200/70 bg-crema-100/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/panel" className="fuente-display text-lg text-cafe-800">
          Café Nuevo
        </Link>
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-controls="menu-panel"
          aria-label={menuAbierto ? 'Cerrar el menú' : 'Abrir el menú'}
          className="-mr-1 rounded-lg p-2 text-cafe-700 transition-colors hover:bg-crema-200"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            {menuAbierto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </header>

      {menuAbierto && (
        <div
          id="menu-panel"
          className="border-b border-cafe-200/70 bg-crema-50 px-4 py-4 lg:hidden"
        >
          {navegacion}
          <div className="mt-4">{fichaUsuario}</div>
        </div>
      )}

      <div className="mx-auto flex max-w-[90rem] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Barra lateral, solo en escritorio */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-6">
            <Link
              to="/panel"
              className="fuente-display block px-3 text-xl text-cafe-800"
            >
              Café Nuevo
            </Link>
            <p className="mb-5 px-3 text-sm text-cafe-500">Panel del equipo</p>
            {navegacion}
            <div className="mt-6">{fichaUsuario}</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
