import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUsuario } from '../../lib/useDatos'
import { puedeVer, type Seccion } from '../../lib/permisos'

/** Deja pasar solo a quien ha entrado; si no, manda a la pantalla de acceso. */
export function RutaProtegida() {
  const usuario = useUsuario()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/acceso" replace state={{ desde: ubicacion.pathname }} />
  }

  // Quien no ha pasado por la bienvenida va allí antes que a ningún otro sitio.
  if (
    !usuario.onboardingCompletado &&
    ubicacion.pathname !== '/panel/bienvenida'
  ) {
    return <Navigate to="/panel/bienvenida" replace />
  }

  return <Outlet />
}

/** Protege una sección concreta según el rol de quien está dentro. */
export function RutaDeSeccion({ seccion }: { seccion: Seccion }) {
  const usuario = useUsuario()
  if (!usuario) return <Navigate to="/acceso" replace />
  if (!puedeVer(usuario.rol, seccion)) {
    return <Navigate to="/panel" replace />
  }
  return <Outlet />
}
