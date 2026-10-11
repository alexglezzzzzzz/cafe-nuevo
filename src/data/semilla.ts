// Datos iniciales de Café Nuevo.
// Se escriben en localStorage la primera vez que se abre la aplicación
// y se pueden volver a escribir desde Ajustes.
//
// Las fechas se calculan a partir del día en que se siembran, de forma que
// las reservas y los encargos siempre caen en el futuro próximo.

import type {
  CategoriaCarta,
  DatosCafe,
  DiaEspecial,
  Encargo,
  Horario,
  Mensaje,
  Negocio,
  Novedad,
  ProductoCarta,
  Reserva,
  Usuario,
} from '../lib/tipos'

// ------------------------------------------------------- Ayudas de fecha

function soloFecha(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

/** Fecha (sin hora) a n días de hoy. */
function enDias(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return soloFecha(d)
}

/** Instante ISO completo a n horas en el pasado. */
function haceHoras(n: number): string {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

/** Instante ISO completo a n días en el pasado. */
function haceDias(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** El próximo 25 de diciembre (o el de este año, si aún no ha pasado). */
function proximaNavidad(): string {
  const hoy = new Date()
  const anio =
    hoy.getMonth() === 11 && hoy.getDate() > 25
      ? hoy.getFullYear() + 1
      : hoy.getFullYear()
  return `${anio}-12-25`
}

/** El próximo 1 de enero. */
function proximoAnioNuevo(): string {
  return `${new Date().getFullYear() + 1}-01-01`
}

// ------------------------------------------------------------- Negocio

const negocio: Negocio = {
  nombre: 'Café Nuevo',
  lema: 'El café de siempre, hecho como nunca',
  descripcionCorta:
    'Café de especialidad, repostería casera y una mesa libre para ti. En Café Nuevo tratamos a cada vecino como si fuera el primero del día.',
  historia: [
    'Abrimos en 2019 en un local que llevaba once años cerrado, en una calle del barrio de San Pablo por la que pasa todo el mundo y en la que casi nadie se paraba.',
    'La idea era sencilla: un sitio donde pararse un momento, tomarse un café bien hecho y que alguien se acordara de tu nombre la segunda vez que vinieras. Sin prisa, sin ruido, sin complicarlo.',
    'Siete años después seguimos siendo eso. Por la barra pasan los del mercado a primera hora, las familias el fin de semana y quien busca un rincón tranquilo para desconectar un rato. Café de calidad, trato cercano y tiempo para quedarse. Nos gusta que quepan todos.',
  ],
  fundadoEn: 2019,
  direccion: {
    calle: 'Calle del Tostador, 14',
    codigoPostal: '50003',
    ciudad: 'Zaragoza',
    barrio: 'San Pablo',
  },
  telefono: '+34 600 000 000',
  email: 'hola@cafenuevo.es',
  redes: {
    instagram: '@cafenuevo.zgz',
    facebook: 'Café Nuevo Zaragoza',
  },
  comoLlegar: [
    'A cinco minutos andando del Mercado Central.',
    'Tranvía: parada César Augusto, línea 1.',
    'Autobuses 21, 29 y Ci1 a dos calles.',
    'Hay aparcamiento de bicicletas en la puerta.',
  ],
  fotos: {
    portada: {
      archivo: '/fotos/barra-flores.jpg',
      alt: 'Barra de madera clara con una taza de café servida y un jarrón de flores.',
    },
    historia: {
      archivo: '/fotos/taza-ventana.jpg',
      alt: 'Una mano sosteniendo una taza de café sobre una mesa de madera junto a la ventana.',
    },
    cafe: {
      archivo: '/fotos/latte.jpg',
      alt: 'Taza de café con leche con una figura dibujada en la espuma.',
    },
    reposteria: {
      archivo: '/fotos/tarta-cafe.jpg',
      alt: 'Porción de carrot cake con cobertura de queso junto a un café con leche.',
    },
    fondo: {
      archivo: '/fotos/grano.jpg',
      alt: 'Café en grano, seleccionado con cuidado.',
    },
  },
}

// ------------------------------------------------------------- Horarios

const especiales: DiaEspecial[] = [
  {
    id: 'esp-1',
    fecha: enDias(4),
    motivo: 'Cata de café de otoño',
    cerrado: false,
    apertura: '07:30',
    cierre: '18:00',
  },
  {
    id: 'esp-2',
    fecha: enDias(11),
    motivo: 'Formación del equipo',
    cerrado: false,
    apertura: '10:00',
    cierre: '20:00',
  },
  {
    id: 'esp-3',
    fecha: proximaNavidad(),
    motivo: 'Navidad',
    cerrado: true,
  },
  {
    id: 'esp-4',
    fecha: proximoAnioNuevo(),
    motivo: 'Año Nuevo',
    cerrado: true,
  },
]

const horario: Horario = {
  semana: [
    { dia: 1, cerrado: false, apertura: '07:30', cierre: '20:00' },
    { dia: 2, cerrado: false, apertura: '07:30', cierre: '20:00' },
    { dia: 3, cerrado: false, apertura: '07:30', cierre: '20:00' },
    { dia: 4, cerrado: false, apertura: '07:30', cierre: '20:00' },
    { dia: 5, cerrado: false, apertura: '07:30', cierre: '21:00' },
    { dia: 6, cerrado: false, apertura: '08:30', cierre: '21:00' },
    { dia: 7, cerrado: false, apertura: '09:00', cierre: '14:30' },
  ],
  especiales,
  nota: 'La cocina cierra media hora antes. En fiestas del Pilar ampliamos horario y lo anunciamos en novedades.',
}

// --------------------------------------------------------------- Carta

const categorias: CategoriaCarta[] = [
  {
    id: 'cat-cafes',
    nombre: 'Cafés',
    descripcion: 'Café de especialidad, cuidado en cada taza.',
    orden: 1,
  },
  {
    id: 'cat-desayunos',
    nombre: 'Desayunos',
    descripcion: 'Servimos desayunos hasta el mediodía, todos los días.',
    orden: 2,
  },
  {
    id: 'cat-reposteria',
    nombre: 'Repostería',
    descripcion: 'Hecha en casa cada mañana. Lo que se acaba, se acaba.',
    orden: 3,
  },
  {
    id: 'cat-salados',
    nombre: 'Bocadillos y salados',
    descripcion: 'Pan de la panadería de la esquina.',
    orden: 4,
  },
  {
    id: 'cat-bebidas',
    nombre: 'Otras bebidas',
    descripcion: 'Para quien no venga por el café.',
    orden: 5,
  },
  {
    id: 'cat-grano',
    nombre: 'Café en grano',
    descripcion: 'Para llevar a casa la misma calidad que servimos en la barra. Te lo molemos al gusto si lo pides.',
    orden: 6,
  },
]

const productos: ProductoCarta[] = [
  // Cafés
  { id: 'p-01', categoriaId: 'cat-cafes', nombre: 'Espresso', descripcion: 'Doble, corto, con la crema espesa.', precio: 1.4, disponible: true, destacado: false, alergenos: [], orden: 1 },
  { id: 'p-02', categoriaId: 'cat-cafes', nombre: 'Cortado', descripcion: 'Espresso con un dedo de leche templada.', precio: 1.5, disponible: true, destacado: false, alergenos: ['lactosa'], orden: 2 },
  { id: 'p-03', categoriaId: 'cat-cafes', nombre: 'Café con leche', descripcion: 'En vaso o en taza, como lo pidas.', precio: 1.8, disponible: true, destacado: false, alergenos: ['lactosa'], orden: 3 },
  { id: 'p-04', categoriaId: 'cat-cafes', nombre: 'Flat white', descripcion: 'Doble de espresso y leche sedosa, sin espuma.', precio: 2.4, disponible: true, destacado: true, alergenos: ['lactosa'], orden: 4 },
  { id: 'p-05', categoriaId: 'cat-cafes', nombre: 'Capuchino', descripcion: 'Con cacao por encima si te apetece.', precio: 2.2, disponible: true, destacado: false, alergenos: ['lactosa'], orden: 5 },
  { id: 'p-06', categoriaId: 'cat-cafes', nombre: 'Americano', descripcion: 'Espresso alargado con agua caliente.', precio: 1.9, disponible: true, destacado: false, alergenos: [], orden: 6 },
  { id: 'p-07', categoriaId: 'cat-cafes', nombre: 'Filtrado en V60', descripcion: 'Origen que cambia cada semana. Pregúntanos cuál toca.', precio: 3.2, disponible: true, destacado: true, alergenos: [], orden: 7 },
  { id: 'p-08', categoriaId: 'cat-cafes', nombre: 'Cold brew', descripcion: 'Veinte horas en frío. Servido con hielo.', precio: 3.0, disponible: false, destacado: false, alergenos: [], orden: 8 },
  // Desayunos
  { id: 'p-09', categoriaId: 'cat-desayunos', nombre: 'Tostada con tomate y aceite', descripcion: 'Pan de hogaza, tomate rallado y aceite de Belchite.', precio: 2.4, disponible: true, destacado: false, alergenos: ['gluten'], orden: 1 },
  { id: 'p-10', categoriaId: 'cat-desayunos', nombre: 'Tostada con mantequilla y mermelada', descripcion: 'Mermelada casera, la del tarro que esté abierto.', precio: 2.2, disponible: true, destacado: false, alergenos: ['gluten', 'lactosa'], orden: 2 },
  { id: 'p-11', categoriaId: 'cat-desayunos', nombre: 'Bocadillo de jamón', descripcion: 'Jamón serrano cortado a mano.', precio: 3.8, disponible: true, destacado: false, alergenos: ['gluten'], orden: 3 },
  { id: 'p-12', categoriaId: 'cat-desayunos', nombre: 'Croissant a la plancha', descripcion: 'Con mantequilla, prensado hasta que cruje.', precio: 2.6, disponible: true, destacado: true, alergenos: ['gluten', 'lactosa', 'huevo'], orden: 4 },
  { id: 'p-13', categoriaId: 'cat-desayunos', nombre: 'Yogur con granola y fruta', descripcion: 'Granola de la casa, con avellanas.', precio: 4.2, disponible: true, destacado: false, alergenos: ['lactosa', 'frutos secos', 'gluten'], orden: 5 },
  { id: 'p-14', categoriaId: 'cat-desayunos', nombre: 'Huevos revueltos con pan', descripcion: 'Dos huevos, cremosos, con tostada grande.', precio: 5.4, disponible: true, destacado: false, alergenos: ['huevo', 'gluten', 'lactosa'], orden: 6 },
  // Repostería
  { id: 'p-15', categoriaId: 'cat-reposteria', nombre: 'Tarta de queso', descripcion: 'Cuajada por fuera, temblona por dentro.', precio: 4.2, disponible: true, destacado: true, alergenos: ['lactosa', 'huevo', 'gluten'], orden: 1 },
  { id: 'p-16', categoriaId: 'cat-reposteria', nombre: 'Carrot cake', descripcion: 'Con frosting de queso y nuez por encima.', precio: 3.9, disponible: true, destacado: false, alergenos: ['gluten', 'lactosa', 'huevo', 'frutos secos'], orden: 2 },
  { id: 'p-17', categoriaId: 'cat-reposteria', nombre: 'Brownie', descripcion: 'Denso, con chocolate del 70%.', precio: 3.4, disponible: true, destacado: false, alergenos: ['gluten', 'huevo', 'lactosa', 'frutos secos'], orden: 3 },
  { id: 'p-18', categoriaId: 'cat-reposteria', nombre: 'Croissant', descripcion: 'De mantequilla, hojaldrado a mano.', precio: 1.8, disponible: true, destacado: false, alergenos: ['gluten', 'lactosa', 'huevo'], orden: 4 },
  { id: 'p-19', categoriaId: 'cat-reposteria', nombre: 'Napolitana de chocolate', descripcion: 'Dos barras de chocolate dentro.', precio: 2.0, disponible: true, destacado: false, alergenos: ['gluten', 'lactosa', 'huevo', 'soja'], orden: 5 },
  { id: 'p-20', categoriaId: 'cat-reposteria', nombre: 'Bizcocho de limón', descripcion: 'Con glaseado fino y ralladura.', precio: 3.2, disponible: true, destacado: false, alergenos: ['gluten', 'huevo', 'lactosa'], orden: 6 },
  // Salados
  { id: 'p-21', categoriaId: 'cat-salados', nombre: 'Bocadillo de tortilla', descripcion: 'De patata, jugosa, hecha cada mañana.', precio: 4.2, disponible: true, destacado: false, alergenos: ['gluten', 'huevo'], orden: 1 },
  { id: 'p-22', categoriaId: 'cat-salados', nombre: 'Sándwich mixto', descripcion: 'Jamón cocido y queso, bien planchado.', precio: 3.6, disponible: true, destacado: false, alergenos: ['gluten', 'lactosa'], orden: 2 },
  { id: 'p-23', categoriaId: 'cat-salados', nombre: 'Sándwich vegetal', descripcion: 'Lechuga, tomate, huevo y mayonesa.', precio: 4.4, disponible: true, destacado: false, alergenos: ['gluten', 'huevo'], orden: 3 },
  { id: 'p-24', categoriaId: 'cat-salados', nombre: 'Quiche de verduras', descripcion: 'Cambia según lo que haya en el mercado.', precio: 4.6, disponible: true, destacado: false, alergenos: ['gluten', 'huevo', 'lactosa'], orden: 4 },
  { id: 'p-25', categoriaId: 'cat-salados', nombre: 'Empanada de atún', descripcion: 'Masa fina, generosa de relleno.', precio: 3.2, disponible: false, destacado: false, alergenos: ['gluten', 'pescado', 'huevo'], orden: 5 },
  // Otras bebidas
  { id: 'p-26', categoriaId: 'cat-bebidas', nombre: 'Infusiones', descripcion: 'Menta poleo, manzanilla, rooibos o té negro.', precio: 2.2, disponible: true, destacado: false, alergenos: [], orden: 1 },
  { id: 'p-27', categoriaId: 'cat-bebidas', nombre: 'Chocolate caliente', descripcion: 'Espeso, a la taza, de los de cuchara.', precio: 2.8, disponible: true, destacado: false, alergenos: ['lactosa', 'soja'], orden: 2 },
  { id: 'p-28', categoriaId: 'cat-bebidas', nombre: 'Zumo de naranja natural', descripcion: 'Exprimido delante de ti.', precio: 2.6, disponible: true, destacado: false, alergenos: [], orden: 3 },
  { id: 'p-29', categoriaId: 'cat-bebidas', nombre: 'Limonada casera', descripcion: 'Con hierbabuena del huerto de Diego.', precio: 2.8, disponible: true, destacado: false, alergenos: [], orden: 4 },
  { id: 'p-30', categoriaId: 'cat-bebidas', nombre: 'Agua mineral', descripcion: 'Botella de medio litro.', precio: 1.4, disponible: true, destacado: false, alergenos: [], orden: 5 },
  { id: 'p-31', categoriaId: 'cat-bebidas', nombre: 'Cerveza artesana', descripcion: 'De una fábrica pequeña de Zaragoza.', precio: 2.9, disponible: true, destacado: false, alergenos: ['gluten'], orden: 6 },
  // Grano
  { id: 'p-32', categoriaId: 'cat-grano', nombre: 'Blend Nuevo · 250 g', descripcion: 'Nuestra mezcla de siempre. Chocolate y avellana.', precio: 9.5, disponible: true, destacado: true, alergenos: [], orden: 1 },
  { id: 'p-33', categoriaId: 'cat-grano', nombre: 'Etiopía Guji · 250 g', descripcion: 'Lavado. Jazmín, melocotón, mucha acidez.', precio: 12.0, disponible: true, destacado: false, alergenos: [], orden: 2 },
  { id: 'p-34', categoriaId: 'cat-grano', nombre: 'Brasil Cerrado · 250 g', descripcion: 'Natural. Cacao y frutos secos, cuerpo alto.', precio: 10.5, disponible: true, destacado: false, alergenos: [], orden: 3 },
]

// ------------------------------------------------------------ Novedades

const novedades: Novedad[] = [
  {
    id: 'nov-1',
    titulo: 'Nueva selección de café para el otoño',
    resumen:
      'Hemos renovado el café de la casa pensando en estos meses: más cuerpo, más dulzor, igual de bueno solo que con leche.',
    cuerpo:
      'Trabajamos con pequeños productores que cuidan cada lote, y elegimos el grano pensando en lo que mejor acompaña el otoño: un perfil con más cuerpo y notas de cacao.\n\nLo tienes en la barra desde esta semana y en bolsa de 250 gramos para llevar a casa.',
    fecha: enDias(-6),
    publicada: true,
    etiqueta: 'Café',
  },
  {
    id: 'nov-2',
    titulo: 'Catas de café el último viernes de cada mes',
    resumen:
      'Seis plazas, dos horas y cuatro orígenes distintos. Sin tecnicismos y sin pretensiones.',
    cuerpo:
      'La idea es sentarnos a probar cuatro cafés muy diferentes y entender por qué saben distinto. No hace falta saber nada de antemano.\n\nSon seis plazas por sesión y se reservan por teléfono o desde el formulario de contacto eligiendo el motivo "reserva". Dura unas dos horas y se queda en 15 € por persona.',
    fecha: enDias(-13),
    publicada: true,
    etiqueta: 'Eventos',
  },
  {
    id: 'nov-3',
    titulo: 'Un rincón para quedarte el rato que haga falta',
    resumen:
      'No hace falta pedir nada más para quedarte. En Café Nuevo el tiempo en la mesa no se mide.',
    cuerpo:
      'Nos gusta que la gente se quede: con un libro, con el portátil, charlando con quien tenga al lado. No hay prisa ni mesa con reloj.\n\nSi vienes solo, a media mañana es cuando más tranquilo está. Y si vienes en grupo, avísanos y te guardamos sitio.',
    fecha: enDias(-24),
    publicada: true,
    etiqueta: 'La casa',
  },
  {
    id: 'nov-4',
    titulo: 'Buscamos a alguien para el turno de tardes',
    resumen:
      'Media jornada, de lunes a viernes. Experiencia en barra deseable, ganas imprescindibles.',
    cuerpo:
      'Pendiente de revisar las condiciones con Marta antes de publicarlo.',
    fecha: enDias(-1),
    publicada: false,
    etiqueta: 'Equipo',
  },
]

// ------------------------------------------------------------- Mensajes

const mensajes: Mensaje[] = [
  {
    id: 'msg-1',
    motivo: 'encargo',
    nombre: 'Lucía Bellido',
    email: 'lucia.bellido@correo-ejemplo.es',
    telefono: '+34 600 000 011',
    mensaje:
      'Hola, quería encargar una tarta de queso para ocho personas para el sábado. ¿Podéis ponerle algo escrito por encima? Es un cumpleaños.',
    creadoEn: haceHoras(3),
    estado: 'nuevo',
    notaInterna: '',
    derivadoEn: 'enc-1',
  },
  {
    id: 'msg-2',
    motivo: 'reserva',
    nombre: 'Javier Monreal',
    email: 'jmonreal@correo-ejemplo.es',
    telefono: '+34 600 000 012',
    mensaje:
      'Somos seis y queríamos desayunar el domingo sobre las once. ¿Tenéis mesa grande?',
    creadoEn: haceHoras(9),
    estado: 'nuevo',
    notaInterna: '',
    derivadoEn: 'res-1',
  },
  {
    id: 'msg-3',
    motivo: 'consulta',
    nombre: 'Sara Puyuelo',
    email: 'sara.puyuelo@correo-ejemplo.es',
    telefono: '+34 600 000 013',
    mensaje:
      '¿El local tiene wifi y enchufes? Trabajo por mi cuenta y busco un sitio tranquilo para pasar la mañana un par de días por semana.',
    creadoEn: haceDias(1),
    estado: 'leido',
    notaInterna: 'Contestar que sí, pero que el fin de semana se llena.',
  },
  {
    id: 'msg-4',
    motivo: 'consulta',
    nombre: 'Ignacio Lamana',
    email: 'nacho.lamana@correo-ejemplo.es',
    telefono: '+34 600 000 014',
    mensaje:
      'Tengo intolerancia a la lactosa. ¿Trabajáis con bebidas vegetales? ¿Cobráis suplemento?',
    creadoEn: haceDias(2),
    estado: 'atendido',
    notaInterna: 'Respondido por teléfono. Tenemos avena y soja, sin suplemento.',
  },
  {
    id: 'msg-5',
    motivo: 'encargo',
    nombre: 'Rosa Ibarra',
    email: 'rosa.ibarra@correo-ejemplo.es',
    telefono: '+34 600 000 015',
    mensaje:
      'Para la reunión de la asociación del barrio necesitaríamos bandeja salada para unas veinte personas. ¿Qué opciones tenéis y con cuánta antelación hay que avisar?',
    creadoEn: haceDias(3),
    estado: 'atendido',
    notaInterna: 'Presupuesto enviado. Pendiente de que confirmen.',
    derivadoEn: 'enc-2',
  },
  {
    id: 'msg-6',
    motivo: 'reserva',
    nombre: 'Pablo Arnal',
    email: 'pablo.arnal@correo-ejemplo.es',
    telefono: '+34 600 000 016',
    mensaje: 'Dos personas para la cata del último viernes de mes, si queda sitio.',
    creadoEn: haceDias(4),
    estado: 'atendido',
    notaInterna: 'Confirmadas las dos plazas.',
    derivadoEn: 'res-2',
  },
]

// ------------------------------------------------------------- Reservas

const reservas: Reserva[] = [
  {
    id: 'res-1',
    mensajeId: 'msg-2',
    nombre: 'Javier Monreal',
    telefono: '+34 600 000 012',
    email: 'jmonreal@correo-ejemplo.es',
    fecha: enDias(6),
    hora: '11:00',
    personas: 6,
    notas: 'Pide la mesa grande del fondo.',
    estado: 'pendiente',
    origen: 'web',
    creadoEn: haceHoras(9),
  },
  {
    id: 'res-2',
    mensajeId: 'msg-6',
    nombre: 'Pablo Arnal',
    telefono: '+34 600 000 016',
    email: 'pablo.arnal@correo-ejemplo.es',
    fecha: enDias(18),
    hora: '19:00',
    personas: 2,
    notas: 'Cata de café. Dos plazas de las seis.',
    estado: 'confirmada',
    origen: 'web',
    creadoEn: haceDias(4),
  },
  {
    id: 'res-3',
    nombre: 'Amparo Gil',
    telefono: '+34 600 000 017',
    email: '',
    fecha: enDias(2),
    hora: '09:30',
    personas: 3,
    notas: 'Llamó por teléfono. Viene con un carrito.',
    estado: 'confirmada',
    origen: 'telefono',
    creadoEn: haceDias(1),
  },
  {
    id: 'res-4',
    nombre: 'Club de lectura La Harinera',
    telefono: '+34 600 000 018',
    email: 'clublectura@correo-ejemplo.es',
    fecha: enDias(9),
    hora: '18:30',
    personas: 9,
    notas: 'Reunión mensual. Necesitan juntar dos mesas.',
    estado: 'pendiente',
    origen: 'local',
    creadoEn: haceDias(2),
  },
  {
    id: 'res-5',
    nombre: 'Tomás Ferrer',
    telefono: '+34 600 000 019',
    email: '',
    fecha: enDias(-3),
    hora: '10:00',
    personas: 2,
    notas: '',
    estado: 'completada',
    origen: 'telefono',
    creadoEn: haceDias(8),
  },
]

// ------------------------------------------------------------- Encargos

const encargos: Encargo[] = [
  {
    id: 'enc-1',
    mensajeId: 'msg-1',
    nombre: 'Lucía Bellido',
    telefono: '+34 600 000 011',
    email: 'lucia.bellido@correo-ejemplo.es',
    tipo: 'tarta',
    descripcion:
      'Tarta de queso para ocho. Con "Felicidades Marina" escrito por encima.',
    fechaRecogida: enDias(5),
    importe: 26,
    estado: 'pendiente',
    origen: 'web',
    creadoEn: haceHoras(3),
  },
  {
    id: 'enc-2',
    mensajeId: 'msg-5',
    nombre: 'Rosa Ibarra',
    telefono: '+34 600 000 015',
    email: 'rosa.ibarra@correo-ejemplo.es',
    tipo: 'bandeja salada',
    descripcion:
      'Bandeja para veinte personas: empanada, quiche y mini bocadillos. Reunión de la asociación del barrio.',
    fechaRecogida: enDias(12),
    importe: 95,
    estado: 'aceptado',
    origen: 'web',
    creadoEn: haceDias(3),
  },
  {
    id: 'enc-3',
    nombre: 'Librería Pasaje',
    telefono: '+34 600 000 020',
    email: 'pasaje@correo-ejemplo.es',
    tipo: 'café en grano',
    descripcion: 'Cuatro bolsas de Blend Nuevo de 250 g, molido para filtro.',
    fechaRecogida: enDias(1),
    importe: 38,
    estado: 'listo',
    origen: 'telefono',
    creadoEn: haceDias(2),
  },
  {
    id: 'enc-4',
    nombre: 'Marcos Allué',
    telefono: '+34 600 000 021',
    email: '',
    tipo: 'catering',
    descripcion:
      'Café y bollería para una presentación de treinta personas en el centro cívico.',
    fechaRecogida: enDias(-2),
    importe: 120,
    estado: 'entregado',
    origen: 'local',
    creadoEn: haceDias(10),
  },
]

// --------------------------------------------------------------- Equipo

const usuarios: Usuario[] = [
  {
    id: 'usr-1',
    nombre: 'Marta Ibáñez',
    email: 'marta@cafenuevo.es',
    clave: 'Nuevo2019',
    rol: 'propietaria',
    activo: true,
    creadoEn: haceDias(400),
    ultimoAcceso: haceHoras(20),
    onboardingCompletado: true,
  },
  {
    id: 'usr-2',
    nombre: 'Diego Salas',
    email: 'diego@cafenuevo.es',
    clave: 'Barra2021',
    rol: 'encargado',
    activo: true,
    creadoEn: haceDias(300),
    ultimoAcceso: haceDias(2),
    onboardingCompletado: true,
  },
  {
    id: 'usr-3',
    nombre: 'Nerea Ferrer',
    email: 'nerea@cafenuevo.es',
    clave: 'Sala2024',
    rol: 'sala',
    activo: true,
    creadoEn: haceDias(90),
    ultimoAcceso: haceDias(5),
    onboardingCompletado: false,
  },
]

// ------------------------------------------------------------ Conjunto

export function construirSemilla(): DatosCafe {
  return {
    negocio,
    horario,
    categorias,
    productos,
    novedades,
    mensajes,
    reservas,
    encargos,
    usuarios,
    recuperaciones: [],
  }
}
