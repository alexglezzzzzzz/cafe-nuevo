import { Carta } from '../../components/publico/Carta'
import { Contacto } from '../../components/publico/Contacto'
import { Hero } from '../../components/publico/Hero'
import { Historia } from '../../components/publico/Historia'
import { Navegacion } from '../../components/publico/Navegacion'
import { Novedades } from '../../components/publico/Novedades'
import { PieDePagina } from '../../components/publico/PieDePagina'
import { Visitanos } from '../../components/publico/Visitanos'

export function Landing() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-cafe-800 focus:px-4 focus:py-2 focus:text-crema-50"
      >
        Saltar al contenido
      </a>
      <Navegacion />
      <main id="contenido">
        <Hero />
        <Historia />
        <Carta />
        <Novedades />
        <Visitanos />
        <Contacto />
      </main>
      <PieDePagina />
    </>
  )
}
