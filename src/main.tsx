import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { iniciarDatos } from './lib/almacen'
import './index.css'

// Los datos se preparan antes del primer render, de forma que cualquier
// pantalla puede leer del almacén sin comprobar si está listo.
iniciarDatos()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
