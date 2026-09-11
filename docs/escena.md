# Especificación de escena

Referencia física de la instalación y reglas de construcción de la escena.
Este archivo es la fuente de verdad geométrica del proyecto. Ante cualquier
ambigüedad en un pedido, vale lo que dice acá.

Tres secciones:
- **Verificado** — dato con fuente pública. No inventar alrededor.
- **Simplificación declarada** — decisión consciente de apartarse de lo real.
- **Reglas de escena** — cómo se estructura el proyecto.

---

## 1. Verificado

### Tanques
- Diámetro: **82 m**
- Altura de envolvente: **35 m**
  (una fuente indica 38 m; se adopta 35 por mayoría de fuentes)
- Capacidad: **120.000 m³** cada uno
- Cantidad total prevista en Punta Colorada: **seis**
- Identificadores reales publicados: **TK401**, **TK404**
- Envolvente de acero, construida en anillos horizontales
  (~1.500 t de acero y más de un millón de pulgadas de soldadura por unidad)

### Techo
- **Domo geodésico de aluminio**, 57 toneladas, ~30.000 bulones
- Es un **casquete bajo**, no una media esfera. En las fotos la altura del
  domo es una fracción chica del diámetro.
- El aluminio es del domo, no de la envolvente. (Confusión frecuente en
  prensa.)

### Recinto de contención
- **Rectangular**, no circular. Un tanque por recinto.
- Bordes de tierra elevados (berma) rodeando el perímetro.
- Margen amplio entre el cilindro y la berma.
- Fondo impermeabilizado (visible como membrana oscura en obra).

### Disposición
- Los tanques **no se conectan entre sí**. Cada tanque tiene una línea propia
  que sale hacia un rack de cañerías.
- Los racks corren **a lo largo de las calles**, sobre soportes bajos, a la
  vista, no enterrados y no por el aire entre tanques.
- El ruteo se concentra en un **sector de manifold**: un área chica y densa,
  separada de los tanques, donde convergen las líneas y están las válvulas
  de operación.
- Separación entre tanques: aproximadamente **un diámetro** entre
  envolventes (~80 m).

### Diámetros de línea
- Ducto troncal: **30"** (0,762 m de diámetro → 0,381 m de radio)
- Ducto costero: **38"**
Son líneas distintas. Verificar cuál corresponde antes de fijar el radio.

### Fuentes
Fotografía aérea de obra (ArgenPorts), renders del proyecto (ArgenPorts),
cobertura de prensa del montaje de domos en TK404 y TK401 (Revista
Petroquímica, LM Neuquén, Shale24, Económicas Bariloche), publicaciones del
Gobierno de Río Negro.

---

## 2. Simplificaciones declaradas

Todo lo de acá es una desviación consciente de la realidad. Se declara en el
portfolio; no se presenta como fidelidad.

### Altura de válvulas: 1,3 m
Las válvulas operables se ubican al alcance de una persona parada. Escalar
proporcionalmente las alturas del render pondría la línea a más de 20 m,
inalcanzable, y no habría escenario.

### Cantidad de elementos
Se modela un subconjunto: dos tanques y unas pocas válvulas, no las seis
unidades ni el conjunto real de líneas. El objetivo es el problema de
alineamiento, no la réplica de la instalación.

### Datos de proceso
Simulados. No reflejan parámetros, procedimientos ni sistemas reales.

### Dimensiones de recinto y berma
Estimadas a partir de fotografía aérea. El dimensionamiento real de una
contención responde a la regla de contener un porcentaje del volumen del
tanque, que no se calculó acá.

### Geometría por primitivas
Cilindros, cajas y casquetes. No hay modelo de ingeniería público de VMOS
disponible, y no se busca fidelidad de detalle sino de escala y disposición.

---

## 3. Reglas de escena

### Disposición objetivo

```
        [ recinto TK404 ]        [ recinto TK401 ]
         ┌─────────────┐          ┌─────────────┐
         │      ⬭     │           │     ⬭      │
         └──────┬──────┘          └──────┬──────┘
                │                        │
        ════════╧════════════════════════╧════════   ← rack sobre calle
                                    ║
                              [ manifold ]  ← válvulas, spawn del usuario
```
Nota: el manifold al costado requiere derivación (T o codo). Se implementa junto con la segunda y tercera válvula. Hasta entonces, decorado sobre el eje.

- Centros de tanque separados ~162 m (82 de diámetro + ~80 de separación).
- Recinto rectangular por tanque, con berma perimetral.
- Rack corriendo por la calle entre recintos, a nivel de terreno sobre
  soportes bajos.
- Manifold como sector propio, a un costado, con las válvulas concentradas
  en pocos metros.
- **El usuario spawnea en el manifold**, mirando hacia los tanques.

### Nomenclatura
Los nodos del grafo usan identificadores reales: `TK404`, `TK401`.
No `tank-a` / `tank-b`.

### Qué es entidad y qué es decoración
- **Entidades con componente `Valve`:** solo las válvulas operables del
  manifold. Cada una declara qué dos nodos conecta y si está abierta.
- **Decoración sin lógica:** tanques, domos, bermas, recintos, tramos de
  caño, terreno. Existen para escala y contexto, no participan del grafo.
- La ruta activa (`PathQuery`) se declara en el archivo de escena, no en
  código.

### Identificadores de válvulas
Inventados siguiendo convención de la industria (prefijo de tipo +
número de servicio). Los identificadores reales de VMOS están en los
P&ID de ingeniería, que no son públicos.

Los identificadores de tanque (TK404, TK401) **sí** son reales y
provienen de fuentes públicas.

### Escala
La escena se trabaja siempre a escala real. Observador a 1,70 m.
La escala no es presentación: es la restricción que genera el problema.

---

## 4. Estado actual y próximo paso

**Funciona:** grafo de válvulas, toggle por interacción, resolución de camino
completo/incompleto. Modo de transparencia implementado (botón Y, global —
alcanza tanques, domo, caño y válvula a la vez). Se evaluó y se difirió
transparentar por objeto — no es un bug, fue decisión del usuario; ver
"Modo de transparencia" en `desiciones_diseño.md` para el razonamiento
completo, no se duplica acá. Domo geodésico bajo, nombres reales de nodo
(`TK404`/`TK401`), recinto rectangular con berma perimetral, y manifold
decorado (playón + soportes de caño) ya aplicados — ver las entradas nuevas
en `desiciones_diseño.md` por los valores placeholder usados en cada uno.
También aplicados: costuras de virola cada ~3 m en la envolvente, escalera
con baranda (TK404 solamente) y galpón chico junto al manifold como
referencia de escala humana, sonido ambiente sintetizado (zumbido cerca del
manifold + viento de fondo), panel de misión al iniciar sesión, e
identificadores del mundo — nombre de tanque en letras grandes sobre la
envolvente y placa de válvula (`MOV-4001`), ninguno con `Ghostable` para que
queden siempre visibles. Ver las entradas correspondientes en
`desiciones_diseño.md` por los números.

**Desvío aplicado:** el manifold se reubicó fuera del eje directo
TK404–TK401 (perpendicular, "a un costado", como pide la sección 3). Ahora
`tk404` entra al manifold y de ahí se reparte hacia `linea-exportacion`
(destino correcto, el que declara el panel de misión) o `destino-secundario`
(señuelo), con tres válvulas (`HV-4001`/`HV-4002`/`HV-4003`) en vez de una.
`ValveSystem` distingue tres estados — incompleto / completo / completo
hacia el destino equivocado — en vez de solo completo/incompleto. Ver "El
desvío: segunda y tercera válvula" en `desiciones_diseño.md` por el detalle
completo (grafo, geometría de la T, valores de reubicación).

**Brecha cerrada:** `tk401` ya tiene línea propia decorativa hacia el sector
del manifold — sin válvula, sin arista en el grafo, no participa de la
mecánica. Cuando el desvío sacó a `tk401` del grafo activo (ver más abajo),
la razón para posponer su línea (que "todavía era destino del grafo") dejó
de aplicar; ver "TK401: de destino del grafo a escenografía" en
`desiciones_diseño.md`.

**Corregido tras testeo del usuario (mismo día):** dos hallazgos de la
primera versión del desvío. Uno, HV-4001 y HV-4002 no se leían desde el
spawn (geometría propia ocluyendo la línea de vista, no un problema de
`Ghostable`) — reubicado. Dos, no había forma de saber si una válvula estaba
abierta o cerrada sin tocarla — el estado ahora es geometría del mundo: cada
válvula tiene una manija tipo mariposa que gira sola cuando se opera,
alineada con el caño si está abierta, cruzada si está cerrada. Sin color, sin
luz — mismo principio de "identificador en el mundo, estado en la interfaz"
que ya regía para los nombres de tanque, extendido a que el estado *físico*
de una válvula tampoco es un reporte de sistema. Ver "HV-4003 quedaba tapado
desde el spawn" y "La válvula muestra su posición en el mundo, no con color"
en `desiciones_diseño.md`.

**Siguiente:** panel de investigación (hilo estilo feed, ver
`desiciones_diseño.md` — "Panel de investigación: hilo con fuentes").

**Contenido de la app, no documentación:** `feed.md` vive en
`public/data/feed.md`, no en `docs/`. Es el contenido real de un panel
espacial (el hilo de investigación) — el runtime lo sirve y lo parsea, no es
material de proceso del proyecto como este archivo o
`desiciones_diseño.md`.

---

## 5. Qué no hacer

- **No agregar tanques nuevos ni elementos que participen del grafo** (nodos,
  válvulas, aristas) hasta que la mecánica actual esté resuelta. Pero
  completar la geometría **decorativa** de lo que ya está en escena — como la
  línea propia de un tanque ya modelado, sin válvula ni arista — no espera a
  eso: si su ausencia contradice una regla ya verificada (§1, "cada tanque
  tiene una línea propia"), es una ficción visible, no una brecha a sostener.
  Ver "TK401: de destino del grafo a escenografía" en `desiciones_diseño.md`
  por qué esta distinción no estaba escrita hasta ahora.
- **No introducir teletransporte.** La distancia es parte del problema y
  sostiene el sentido de escala, que ya se verificó que funciona.
- **No resolver el panel de estado por conveniencia.** Hoy es un HUD fijo y
  eso es provisorio, no una decisión. Que un panel en el mundo sea ilegible
  a distancia es un hallazgo del proyecto, no un bug a tapar.
- **No inventar dimensiones.** Si un dato no está en la sección Verificado ni
  en Simplificaciones, preguntarlo antes de asumirlo.