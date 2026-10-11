import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MarcoPanel } from './components/panel/MarcoPanel'
import {
  RutaDeSeccion,
  RutaProtegida,
} from './components/panel/RutaProtegida'
import { Entrar } from './paginas/acceso/Entrar'
import { NuevaClave } from './paginas/acceso/NuevaClave'
import { Recuperar } from './paginas/acceso/Recuperar'
import { Registro } from './paginas/acceso/Registro'
import { Ajustes } from './paginas/panel/Ajustes'
import { Ayuda } from './paginas/panel/Ayuda'
import { Bienvenida } from './paginas/panel/Bienvenida'
import { CartaPanel } from './paginas/panel/CartaPanel'
import { Encargos } from './paginas/panel/Encargos'
import { Equipo } from './paginas/panel/Equipo'
import { Horarios } from './paginas/panel/Horarios'
import { Inicio } from './paginas/panel/Inicio'
import { Mensajes } from './paginas/panel/Mensajes'
import { NovedadesPanel } from './paginas/panel/NovedadesPanel'
import { Reservas } from './paginas/panel/Reservas'
import { AvisoLegal } from './paginas/publico/AvisoLegal'
import { Landing } from './paginas/publico/Landing'
import { NoEncontrada } from './paginas/publico/NoEncontrada'
import { Privacidad } from './paginas/publico/Privacidad'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Landing />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/privacidad" element={<Privacidad />} />

        {/* Acceso del equipo */}
        <Route path="/acceso" element={<Entrar />} />
        <Route path="/acceso/registro" element={<Registro />} />
        <Route path="/acceso/recuperar" element={<Recuperar />} />
        <Route path="/acceso/recuperar/:token" element={<NuevaClave />} />

        {/* Panel */}
        <Route element={<RutaProtegida />}>
          <Route path="/panel/bienvenida" element={<Bienvenida />} />

          <Route element={<MarcoPanel />}>
            <Route path="/panel" element={<Inicio />} />
            <Route path="/panel/ayuda" element={<Ayuda />} />

            <Route element={<RutaDeSeccion seccion="mensajes" />}>
              <Route path="/panel/mensajes" element={<Mensajes />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="reservas" />}>
              <Route path="/panel/reservas" element={<Reservas />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="encargos" />}>
              <Route path="/panel/encargos" element={<Encargos />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="carta" />}>
              <Route path="/panel/carta" element={<CartaPanel />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="horarios" />}>
              <Route path="/panel/horarios" element={<Horarios />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="novedades" />}>
              <Route path="/panel/novedades" element={<NovedadesPanel />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="equipo" />}>
              <Route path="/panel/equipo" element={<Equipo />} />
            </Route>
            <Route element={<RutaDeSeccion seccion="ajustes" />}>
              <Route path="/panel/ajustes" element={<Ajustes />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  )
}
