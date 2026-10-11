# Café Nuevo

Web de una cafetería de barrio con panel de gestión privado. Funciona **sin
servidor**: toda la información vive en el almacenamiento local del navegador.

El proyecto tiene dos caras que comparten los mismos datos:

- **La web pública** — carta, historia, horarios, ubicación, novedades y un
  formulario de contacto que sirve además para reservar mesa y hacer encargos.
- **El panel del equipo** — bandeja de mensajes, reservas, encargos, editor de
  carta, horarios, novedades, equipo y ajustes.

Lo que se edita en el panel se ve en la web al momento. No hay dos sitios donde
tocar lo mismo.

---

## Cómo arrancar el proyecto

Hace falta **Node.js 20 o superior**. Comprueba lo que tienes con `node -v`.

```bash
npm install
npm run dev
```

Se abre en <http://localhost:5173>.

Otros comandos:

```bash
npm run build     # compila a dist/ para publicar
npm run preview   # sirve lo compilado, para revisarlo antes de subir
npm run lint      # pasa el linter
```

---

## Cómo entrar al panel

El acceso está en `/acceso`, y también hay un enlace discreto al pie de la web.

| Correo | Contraseña | Acceso |
|---|---|---|
| `marta@cafenuevo.es` | `Nuevo2019` | Propietaria — todo |
| `diego@cafenuevo.es` | `Barra2021` | Encargado — todo menos equipo y ajustes |
| `nerea@cafenuevo.es` | `Sala2024` | Sala — atiende, consulta el resto |

También puedes **crear una cuenta nueva** en `/acceso/registro`: entra con
permisos de sala y arranca el recorrido de bienvenida.

---

## Qué está simulado

Esto es lo importante de entender antes de juzgar lo que ves. No hay back-end,
así que algunas cosas funcionan de una forma que conviene conocer:

**Los datos viven en el navegador.** Todo se guarda bajo las claves
`cafenuevo:datos`, `cafenuevo:version` y `cafenuevo:sesion` del `localStorage`.
Eso significa que **no se comparten entre dispositivos ni entre navegadores**:
lo que escribas en el móvil no aparece en el ordenador. Cada navegador tiene su
propia copia independiente.

**El formulario no envía ningún correo.** Al enviarlo, el mensaje se guarda y
aparece en la bandeja del panel — y si era una reserva o un encargo, se crea
además la entrada correspondiente, enlazada con el mensaje que la originó. Para
verlo: rellena el formulario de la web y entra al panel **en ese mismo
navegador**. Si lo rellenas en el móvil y abres el panel en el ordenador, no lo
verás, porque son dos almacenamientos distintos.

**El envío tarda 700 ms a propósito.** Sin esa pausa el formulario responde tan
rápido que no se percibe que haya pasado nada. Es apariencia deliberada, no una
llamada a ningún sitio.

**Las contraseñas se guardan sin cifrar.** Están en `localStorage` tal cual.
Sin servidor no hay forma de hacerlo bien, y simular un cifrado sería peor que
decirlo. Lo mismo con la sesión: es un identificador guardado en el navegador,
no un token firmado.

**La recuperación de contraseña entrega el enlace en pantalla.** No hay
servidor de correo, así que tras pedirla la propia aplicación te da el enlace,
y lo explica ahí mismo. El enlace caduca a los 30 minutos y solo sirve una vez;
las dos cosas son reales.

**El mapa es un dibujo, no un mapa.** La sección «Visítanos» muestra un plano
esquemático en SVG. No hay integración con ningún servicio de mapas, y no
pretende aparentarlo.

**Los datos de contacto son marcadores.** El teléfono `+34 600 000 000`, el
correo `hola@cafenuevo.es` y la dirección de la Calle del Tostador no
corresponden a ningún negocio real. Café Nuevo es un local ficticio.

**No hay captcha ni antispam.** No tendría sentido sin servidor.

---

## Cómo reiniciar los datos de ejemplo

Hay tres formas, de más cómoda a más drástica:

**1. Desde la propia aplicación.** Entra al panel como propietaria y ve a
**Ajustes → Reiniciar el contenido**. Devuelve la carta, los horarios, las
novedades, los mensajes, las reservas, los encargos y el equipo a su estado
original, y cierra la sesión. Es la forma recomendada.

**2. Desde la consola del navegador.** Con la web abierta, pulsa F12 y ejecuta:

```js
localStorage.clear(); location.reload()
```

**3. Subiendo la versión de los datos.** En `src/lib/almacen.ts` hay una
constante `VERSION_DATOS`. Si la cambias, cualquier navegador que tuviera datos
de la versión anterior los sustituye solo por los nuevos al abrir la web. Es lo
que hay que hacer cuando se cambia la forma de los datos en `src/lib/tipos.ts`.

Los datos de partida están en `src/data/semilla.ts`. Las fechas de reservas,
encargos y novedades **se calculan en el momento de sembrar**, así que las
reservas siempre caen en los próximos días por mucho tiempo que pase desde que
se escribió el proyecto.

---

## Cómo está organizado

```
src/
  components/
    ui/          Piezas base: botones, campos, tarjetas, modal, avisos
    publico/     Secciones de la web pública
    panel/       Armazón del panel, rutas protegidas y piezas compartidas
  paginas/
    publico/     Landing, páginas legales y 404
    acceso/      Entrar, registro y recuperación de contraseña
    panel/       Las nueve pantallas del panel
  lib/
    tipos.ts     El modelo de datos entero
    almacen.ts   Persistencia en localStorage, versionado y siembra
    sesion.ts    Entrar, registrarse y recuperar contraseña
    acciones.ts  Lo que escribe la web pública
    gestion.ts   Lo que escribe el panel
    permisos.ts  Qué puede hacer cada rol
    validacion.ts Reglas del formulario, horarios incluidos
    formato.ts   Fechas, horas y precios en español
  data/
    semilla.ts   El contenido inicial de Café Nuevo
```

**Los componentes nunca tienen datos dentro.** Todo lo que se ve sale de
`localStorage` a través de `useDatos()`. Para comprobarlo: abre la consola,
cambia el lema del negocio en `cafenuevo:datos`, recarga, y verás el titular
nuevo.

---

## Los tres niveles de acceso

| | Propietaria | Encargado | Sala |
|---|---|---|---|
| Mensajes, reservas, encargos | Gestiona | Gestiona | Gestiona |
| Carta, horarios, novedades | Gestiona | Gestiona | Consulta |
| Equipo | Gestiona | Consulta | No ve |
| Ajustes | Gestiona | No ve | No ve |

Los permisos se aplican de verdad, no solo ocultando opciones del menú:
escribir la URL de una sección prohibida devuelve al inicio del panel. Están
definidos en un único sitio, `src/lib/permisos.ts`.

---

## Si algún día hay que llevarlo a un backend

El proyecto está preparado para ese salto, porque **todas las lecturas y
escrituras pasan por tres archivos**. No hay una sola llamada a `localStorage`
repartida por los componentes.

**Lo que habría que tocar:**

1. **`src/lib/almacen.ts`** es la pieza central. Sus funciones (`leerDatos`,
   `escribirDatos`, `actualizarDatos`) se sustituyen por llamadas al servidor.
   El resto de la aplicación no se entera, salvo por un detalle: ahora todo es
   síncrono y pasaría a ser asíncrono, así que `useDatos()` necesitaría manejar
   estados de carga y error.

2. **`src/lib/tipos.ts`** se traduce casi literalmente al esquema de la base de
   datos. Cada interfaz es una tabla: `negocio`, `productos`, `categorias`,
   `novedades`, `mensajes`, `reservas`, `encargos`, `usuarios`.

3. **`src/lib/sesion.ts`** se reemplaza por autenticación real. Aquí sí hay
   trabajo de fondo: contraseñas con hash, tokens de sesión firmados, y una
   recuperación que envíe correos de verdad en lugar de mostrar el enlace.

4. **`src/lib/permisos.ts`** se queda tal cual en el cliente para decidir qué
   enseñar, **pero hay que repetirlo en el servidor**. Los permisos de cliente
   sirven para la interfaz, nunca para la seguridad.

5. **El formulario de contacto** pasaría a enviar un correo o una notificación
   al equipo, además de guardar el mensaje.

**Lo que no habría que tocar:** ningún componente visual, las validaciones de
`validacion.ts`, los formatos de `formato.ts`, ni los permisos como tales.

---

## Decisiones que quizá llamen la atención

**No hay modo oscuro.** Una cafetería con paleta de cremas y marrones no gana
nada con él, y ofrecerlo a medias sería peor que no tenerlo.

**No hay fotos propias.** Las cinco imágenes son de bancos con licencia CC0
(StockSnap, rawpixel y Wikimedia Commons), libres para uso comercial y sin
atribución obligatoria. Están optimizadas: 572 KB entre las cinco.

**Los productos agotados no se borran, se marcan.** En la carta del panel hay
una casilla de «disponible» precisamente porque lo que de verdad pasa en un bar
es que algo se acaba ese día, no que desaparezca de la carta.

**Los cambios del panel se guardan según se escriben**, sin botón de guardar en
cada campo, con un aviso breve de confirmación. Es lo que espera quien gestiona
el negocio desde el móvil detrás de la barra.

---

## Hecho con

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 7

Sin dependencias de interfaz: los componentes están escritos a mano. Fuentes
Fraunces y DM Sans, de Google Fonts.
