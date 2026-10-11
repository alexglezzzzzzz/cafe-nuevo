import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { registrarContacto, type ResultadoContacto } from '../../lib/acciones'
import { capitalizar, fechaLarga } from '../../lib/formato'
import { useDatos } from '../../lib/useDatos'
import {
  validarCorreo,
  validarFechaFutura,
  validarHora,
  validarMensaje,
  validarNombre,
  validarPersonas,
  validarTelefono,
  type Errores,
} from '../../lib/validacion'
import type { MotivoMensaje, TipoEncargo } from '../../lib/tipos'
import { AreaTexto, Aviso, Boton, Casilla, Entrada, Seleccion } from '../ui'

const motivos: { valor: MotivoMensaje; etiqueta: string; pista: string }[] = [
  {
    valor: 'consulta',
    etiqueta: 'Una consulta',
    pista: 'Horarios, alérgenos, si hay sitio para trabajar… lo que sea.',
  },
  {
    valor: 'reserva',
    etiqueta: 'Reservar mesa',
    pista: 'Para grupos y para las catas. Te confirmamos por teléfono.',
  },
  {
    valor: 'encargo',
    etiqueta: 'Hacer un encargo',
    pista: 'Tartas, bandejas, café en grano o catering.',
  },
]

const tiposEncargo: TipoEncargo[] = [
  'tarta',
  'bandeja salada',
  'café en grano',
  'catering',
  'otro',
]

const vacio = {
  motivo: 'consulta' as MotivoMensaje,
  nombre: '',
  email: '',
  telefono: '',
  mensaje: '',
  fecha: '',
  hora: '',
  personas: '2',
  tipoEncargo: 'tarta' as TipoEncargo,
  fechaRecogida: '',
  consiento: false,
}

export function FormularioContacto() {
  const { horario } = useDatos()
  const [campos, setCampos] = useState(vacio)
  const [errores, setErrores] = useState<Errores>({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState<ResultadoContacto | null>(null)
  const refFormulario = useRef<HTMLFormElement>(null)
  // Cerrojo síncrono: el estado de React no cambia hasta el siguiente render,
  // así que varios clics seguidos en el mismo instante lo esquivarían.
  const enviandoYa = useRef(false)
  const refConfirmacion = useRef<HTMLDivElement>(null)

  const esReserva = campos.motivo === 'reserva'
  const esEncargo = campos.motivo === 'encargo'
  const pista = motivos.find((m) => m.valor === campos.motivo)?.pista

  function cambiar<C extends keyof typeof vacio>(
    campo: C,
    valor: (typeof vacio)[C],
  ) {
    setCampos((c) => ({ ...c, [campo]: valor }))
    // Al corregir un campo, su error desaparece sin esperar a reenviar.
    setErrores((e) => {
      if (!e[campo]) return e
      const resto = { ...e }
      delete resto[campo]
      return resto
    })
  }

  function revisar(): Errores {
    const e: Errores = {}

    const nombre = validarNombre(campos.nombre)
    if (nombre) e.nombre = nombre

    const email = validarCorreo(campos.email)
    if (email) e.email = email

    const telefono = validarTelefono(campos.telefono, esReserva || esEncargo)
    if (telefono) e.telefono = telefono

    const mensaje = validarMensaje(campos.mensaje)
    if (mensaje) e.mensaje = mensaje

    if (esReserva) {
      const fecha = validarFechaFutura(campos.fecha, 'el día')
      if (fecha) e.fecha = fecha

      const hora = validarHora(campos.hora, campos.fecha, horario)
      if (hora) e.hora = hora

      const personas = validarPersonas(campos.personas)
      if (personas) e.personas = personas
    }

    if (esEncargo) {
      const recogida = validarFechaFutura(
        campos.fechaRecogida,
        'el día de recogida',
      )
      if (recogida) e.fechaRecogida = recogida
    }

    if (!campos.consiento) {
      e.consiento = 'Necesitamos tu permiso para guardar estos datos.'
    }

    return e
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (enviandoYa.current) return // doble clic o doble Intro

    const fallos = revisar()
    setErrores(fallos)

    if (Object.keys(fallos).length > 0) {
      // El foco va al primer campo con problema.
      const primero = Object.keys(fallos)[0]
      const control = refFormulario.current?.querySelector<HTMLElement>(
        `[name="${primero}"]`,
      )
      control?.focus()
      control?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    enviandoYa.current = true
    setEnviando(true)
    // Pequeña espera deliberada: sin ella el envío es tan instantáneo que
    // no se percibe que haya ocurrido nada. No hay servidor detrás.
    await new Promise((r) => setTimeout(r, 700))

    const resultado = registrarContacto({
      motivo: campos.motivo,
      nombre: campos.nombre.trim(),
      email: campos.email.trim(),
      telefono: campos.telefono.trim(),
      mensaje: campos.mensaje.trim(),
      reserva: esReserva
        ? {
            fecha: campos.fecha,
            hora: campos.hora,
            personas: Number(campos.personas),
          }
        : undefined,
      encargo: esEncargo
        ? { tipo: campos.tipoEncargo, fechaRecogida: campos.fechaRecogida }
        : undefined,
    })

    enviandoYa.current = false
    setEnviando(false)
    setEnviado(resultado)
    // El aviso de confirmación recibe el foco para quien navega con teclado.
    window.setTimeout(() => refConfirmacion.current?.focus(), 50)
  }

  function empezarDeNuevo() {
    setCampos(vacio)
    setErrores({})
    setEnviado(null)
  }

  if (enviado) {
    return (
      <Confirmacion
        ref={refConfirmacion}
        resultado={enviado}
        onOtro={empezarDeNuevo}
      />
    )
  }

  const hayErrores = Object.keys(errores).length > 0

  return (
    <form
      ref={refFormulario}
      onSubmit={enviar}
      noValidate
      className="rounded-2xl border border-cafe-200/70 bg-crema-50 p-6 sm:p-8"
    >
      {hayErrores && (
        <div className="mb-6">
          <Aviso tipo="atencion" titulo="Revisa el formulario">
            {Object.keys(errores).length === 1
              ? 'Hay un campo que necesita tu atención.'
              : `Hay ${Object.keys(errores).length} campos que necesitan tu atención.`}
          </Aviso>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <Seleccion
            etiqueta="¿En qué podemos ayudarte?"
            name="motivo"
            required
            value={campos.motivo}
            onChange={(e) =>
              cambiar('motivo', e.target.value as MotivoMensaje)
            }
            ayuda={pista}
          >
            {motivos.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.etiqueta}
              </option>
            ))}
          </Seleccion>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Entrada
            etiqueta="Nombre"
            name="nombre"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={campos.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            error={errores.nombre}
          />
          <Entrada
            etiqueta="Correo electrónico"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.es"
            value={campos.email}
            onChange={(e) => cambiar('email', e.target.value)}
            error={errores.email}
          />
        </div>

        <Entrada
          etiqueta="Teléfono"
          name="telefono"
          type="tel"
          required={esReserva || esEncargo}
          autoComplete="tel"
          placeholder="+34 600 000 000"
          value={campos.telefono}
          onChange={(e) => cambiar('telefono', e.target.value)}
          error={errores.telefono}
          ayuda={
            esReserva || esEncargo
              ? 'Te llamamos para confirmar.'
              : 'Solo si prefieres que te llamemos.'
          }
        />

        {esReserva && (
          <fieldset className="rounded-xl border border-cafe-200/70 bg-crema-100/60 p-5">
            <legend className="px-2 text-sm font-semibold text-cafe-700">
              La reserva
            </legend>
            <div className="grid gap-5 sm:grid-cols-3">
              <Entrada
                etiqueta="Día"
                name="fecha"
                type="date"
                required
                value={campos.fecha}
                onChange={(e) => cambiar('fecha', e.target.value)}
                error={errores.fecha}
              />
              <Entrada
                etiqueta="Hora"
                name="hora"
                type="time"
                required
                value={campos.hora}
                onChange={(e) => cambiar('hora', e.target.value)}
                error={errores.hora}
              />
              <Entrada
                etiqueta="Personas"
                name="personas"
                type="number"
                min={1}
                max={20}
                required
                value={campos.personas}
                onChange={(e) => cambiar('personas', e.target.value)}
                error={errores.personas}
              />
            </div>
          </fieldset>
        )}

        {esEncargo && (
          <fieldset className="rounded-xl border border-cafe-200/70 bg-crema-100/60 p-5">
            <legend className="px-2 text-sm font-semibold text-cafe-700">
              El encargo
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Seleccion
                etiqueta="Qué quieres encargar"
                name="tipoEncargo"
                required
                value={campos.tipoEncargo}
                onChange={(e) =>
                  cambiar('tipoEncargo', e.target.value as TipoEncargo)
                }
              >
                {tiposEncargo.map((t) => (
                  <option key={t} value={t}>
                    {capitalizar(t)}
                  </option>
                ))}
              </Seleccion>
              <Entrada
                etiqueta="Cuándo lo recoges"
                name="fechaRecogida"
                type="date"
                required
                value={campos.fechaRecogida}
                onChange={(e) => cambiar('fechaRecogida', e.target.value)}
                error={errores.fechaRecogida}
                ayuda="Avísanos con dos días, mejor."
              />
            </div>
          </fieldset>
        )}

        <AreaTexto
          etiqueta={esEncargo ? 'Cuéntanos el encargo' : 'Mensaje'}
          name="mensaje"
          required
          rows={5}
          placeholder={
            esEncargo
              ? 'Para cuántas personas, si lleva algo escrito, alergias…'
              : 'Cuéntanos qué necesitas'
          }
          value={campos.mensaje}
          onChange={(e) => cambiar('mensaje', e.target.value)}
          error={errores.mensaje}
        />

        <div>
          <Casilla
            name="consiento"
            etiqueta="Guardad mis datos para responderme"
            checked={campos.consiento}
            onChange={(e) => cambiar('consiento', e.target.checked)}
          />
          <p className="mt-1.5 pl-7 text-sm text-cafe-500">
            Los usamos solo para contestarte. Puedes leer la{' '}
            <Link
              to="/privacidad"
              className="underline underline-offset-2 hover:text-cafe-700"
            >
              política de privacidad
            </Link>
            .
          </p>
          {errores.consiento && (
            <p
              role="alert"
              className="mt-1.5 pl-7 text-sm font-medium text-terracota-600"
            >
              {errores.consiento}
            </p>
          )}
        </div>

        <Boton type="submit" tamano="lg" disabled={enviando} anchoCompleto>
          {enviando ? 'Enviando…' : 'Enviar'}
        </Boton>
      </div>
    </form>
  )
}

function Confirmacion({
  ref,
  resultado,
  onOtro,
}: {
  ref: React.Ref<HTMLDivElement>
  resultado: ResultadoContacto
  onOtro: () => void
}) {
  const { mensaje, reserva, encargo } = resultado

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="rounded-2xl border border-oliva-400/40 bg-oliva-100/50 p-6 sm:p-8"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-oliva-500">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-crema-50"
          aria-hidden="true"
        >
          <path d="m5 13 4.5 4.5L19 7" />
        </svg>
      </div>

      <h3 className="fuente-display mt-4 text-2xl text-cafe-900">
        Recibido, {mensaje.nombre.split(' ')[0]}
      </h3>

      <p className="mt-2 leading-relaxed text-cafe-600">
        {reserva
          ? 'Tenemos tu petición de mesa. Te llamamos para confirmarla.'
          : encargo
            ? 'Tenemos tu encargo. Te llamamos para cerrar los detalles y el precio.'
            : 'Hemos recibido tu mensaje y te contestamos al correo.'}
      </p>

      <dl className="mt-6 space-y-2.5 border-t border-oliva-400/30 pt-5 text-sm">
        <Linea termino="Para" descripcion={mensaje.email} />
        {mensaje.telefono && (
          <Linea termino="Teléfono" descripcion={mensaje.telefono} />
        )}
        {reserva && (
          <>
            <Linea
              termino="Día"
              descripcion={capitalizar(fechaLarga(reserva.fecha))}
            />
            <Linea termino="Hora" descripcion={reserva.hora} />
            <Linea
              termino="Personas"
              descripcion={String(reserva.personas)}
            />
          </>
        )}
        {encargo && (
          <>
            <Linea termino="Tipo" descripcion={capitalizar(encargo.tipo)} />
            <Linea
              termino="Recogida"
              descripcion={capitalizar(fechaLarga(encargo.fechaRecogida))}
            />
          </>
        )}
      </dl>

      <Boton variante="contorno" className="mt-6" onClick={onOtro}>
        Escribir otro mensaje
      </Boton>
    </div>
  )
}

function Linea({
  termino,
  descripcion,
}: {
  termino: string
  descripcion: string
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-cafe-500">{termino}</dt>
      <dd className="text-cafe-800">{descripcion}</dd>
    </div>
  )
}
