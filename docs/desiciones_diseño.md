# Decisiones de diseño
 
Registro corrido. Cada entrada: qué se decidió, por qué, y qué se descartó.
Las entradas abiertas son las que todavía no tienen respuesta.
 
---
 
## Alcance
 
### El caso es midstream, no upstream
**Decidido.**
VMOS es transporte y almacenamiento: oleoducto, estaciones de bombeo, playa
de tanques, carga a buque. No hay pozos ni perforación.
 
**Se descartó** el escenario de detección de *kick* y el 3W Dataset de
Petrobras, que son de perforación de pozos. Buen dataset, proyecto equivocado.
 
**Consecuencia:** el Instituto Vaca Muerta, que forma para upstream, no es
el destinatario del proyecto. Se cita como evidencia de que la industria
valida el entrenamiento inmersivo, no como cliente.
 
---
 
### El momento operativo es el alineamiento de válvulas
**Decidido.**
El operador habilita el camino de crudo desde un tanque hacia la línea de
despacho, verificando la posición de las válvulas de la ruta.
 
**Por qué:**
- Un lineup es un proceso con estados, secuencia y precondiciones. Es el
  terreno donde el diseño de procesos 2D se traduce directo al espacio.
- El problema es genuinamente espacial: parada en el campo ves una válvula
  pero no ves el camino; mirando un diagrama ves el camino pero no la
  realidad. Ese hueco es el proyecto.
**Se evaluó y descartó:**
- *Lectura ambigua de presión* — narrativa más fuerte (Marshall), pero es un
  escenario de sala de control y corre riesgo de terminar en paneles 2D
  flotando en el aire, sin justificar el visor.
- *Sobrellenado de tanque* — la más barata de construir, pero menos apoyada
  en el oficio propio.
- *Carga a buque* — inviable en un PoC individual.
---
 
### VMOS es el caso de estudio, no el cliente
**Decidido.**
El usuario es alguien sin acceso físico a una instalación de este tipo.
El proyecto no reemplaza formación ni certifica nada.
 
**Reclamo acotado:** reduce el costo del primer contacto con un entorno
industrial, para alguien que hoy solo puede leer sobre él.
 
**Por qué acotarlo:** un visor tampoco es un recurso gratuito. "Democratiza
el acceso" no se sostiene ante un lector crítico; esto sí.
 
---
 
## Construcción
 
### Geometría paramétrica, no modelo escaneado
**Decidido.**
La escena se construye con primitivas a partir de dimensiones publicadas:
tanques de 82 m de diámetro, ~35 m de altura, seis unidades.
 
**Por qué:**
- Una playa de tanques es geométricamente trivial — son cilindros.
- Es VMOS de verdad, no una planta de otro país haciendo de doble.
- Es liviano, que importa en el navegador de un visor.
- El dataset NORA quedó restringido en Zenodo y además representa una
  maqueta de piping, no una terminal.
**Pendiente:** la altura aparece como 35 m en unas fuentes y 38 m en otras.
Elegir una y citarla.
 
---
 
### El estado se modela como grafo desde el primer día
**Decidido.**
Cada válvula es una arista: declara qué dos nodos conecta y si está abierta.
Un sistema recorre el grafo y resuelve si existe camino entre origen y
destino.
 
**Por qué:** con una sola válvula un booleano alcanzaría, pero pasar de una
a seis exigiría reescribir todo. Con el grafo desde el inicio, escalar es
agregar datos, no código.
 
**Corolario:** la ruta (origen y destino) se declara en el archivo de escena,
no en el código. Cambiar el caso es editar un JSON.
 
---
 
### Escena propia, separada del scaffold
**Decidido.**
`valve-lineup.iwsdk.scene.json` en lugar de construir sobre la escena de
ejemplo generada.
 
**Por qué:** el robot y la planta del scaffold son ruido visual al evaluar
composición; la escena limpia termina siendo el artefacto propio; y la
original queda como referencia de sintaxis.
 
---
 
### La escena se trabaja a escala real
**Decidido.**
Tanques a 82 × 35 m, observador a 1,70 m de altura.
 
**Por qué:** la escala no es un detalle de presentación, es la restricción
que genera el problema. A escala real un tanque deja de ser un objeto y pasa
a ser una pared, y el estado de la ruta se vuelve invisible desde el piso.
 
---

### Altura del caño y la válvula: simplificación declarada, no dato
**Decidido — simplificación declarada.**
El caño y la válvula corren a 1,3 m de altura entre los dos tanques.

**Por qué esa altura:** escalar todo proporcionalmente a 82 m pone el caño a
22 m de altura — inalcanzable, sin escenario posible. 1,3 m es una altura de
operación plausible: en una playa de tanques real, las válvulas manuales
están al alcance de una persona parada, más o menos a la altura del pecho,
montadas sobre soportes bajos.

**Lo que no es plausible:** un caño de 30" corriendo por el aire a esa altura
entre dos tanques. Esa línea normalmente va enterrada o sobre soportes bajos;
lo que sube a altura de operación es la válvula y su extensión de vástago,
no el tramo principal de caño.

**Para el PoC no importa** — el objetivo es que la válvula sea alcanzable y
apuntable desde el piso, no reproducir el trazado real de cañerías. Pero es
una decisión de puesta en escena, no una medida relevada, y quedaba
reportada sin esa distinción.

**La escala funciona**

"Te empieza a meter en contexto de proyecto y lugar" es el primer resultado positivo verificado del proyecto. Por embodiment. Presencia, sentido de escala corporal, la comprensión que viene de estar adentro y no de mirar.

---

### Domo del tanque: casquete esférico bajo
**Implementado — proporción placeholder.**
Techo geodésico modelado como un casquete esférico bajo (`SphereGeometry`
recortado por `thetaLength`), apoyado al ras del borde superior del
cilindro.

**Cómo quedó:** altura del casquete (`DOME_RISE`) fijada en 6 m sobre un
diámetro de 82 m (~7%), muy por debajo de una semiesfera (que sería 41 m,
50%) — a propósito, para que se lea sin ambigüedad como "casquete bajo" y no
medio domo, tal como pide `escena.md`.

**Por qué esa proporción:** ninguna fuente da una relación altura/diámetro
real para el domo geodésico de VMOS. Es una decisión de puesta en escena, no
una medida relevada. Material del domo separado del cuerpo (más claro y
metálico) porque el aluminio es del domo, no de la envolvente — confusión
frecuente en prensa, ya señalada en `escena.md`.

**Sin verificar:** no se comparó la proporción contra fotos/renders de
referencia a la misma escala; ajustar si una captura en visor lo pide.

---

### Recinto rectangular y berma: dimensiones placeholder
**Implementado — dimensiones no relevadas.**
Un recinto por tanque: piso de membrana oscura y berma perimetral de cuatro
muros, con margen amplio al cilindro.

**Cómo quedó:** margen cilindro-berma 15 m, huella **cuadrada** de 112×112 m
(2×(radio+margen)), berma de 2,5 m de altura por 3 m de ancho.

**Por qué esos números y por qué cuadrado:** son valores de puesta en
escena, no cálculo de norma de contención — ya declarado en `escena.md` §2
que el dimensionamiento real de una contención sigue una regla de porcentaje
de volumen del tanque que no se calculó acá. Cuadrado porque es la forma más
simple de dar margen parejo alrededor de un círculo; `escena.md` no fija una
relación de aspecto para el recinto.

**Simplificación de construcción:** los cuatro muros de la berma miden el
largo completo de la huella cada uno (se superponen levemente en las
esquinas) en vez de estar recortados a inglete — invisible a esta escala, y
evita geometría extra por una ganancia que no se nota.

---

### Sector de manifold: decorado en el eje existente, no reubicado
**Decidido — brecha de fidelidad reconocida.**
El manifold (playón de hormigón + dos soportes bajos del caño) se agregó
sobre la posición actual de la válvula, en el eje directo TK404–TK401, en
vez de moverse a un costado como muestra el diagrama de `escena.md` §3.

**Por qué:** la resolución de camino (`ValveSystem`, BFS sobre `Valve.from`/
`to`/`open`) depende solo de valores de componente, nunca de posición —
mover la válvula no cambia nada de lógica. El costo real es geométrico: una
derivación fuera de eje necesita un caño en T o un codo que hoy no existe
(el único asset de caño es un cilindro recto), y construirlo ahora obliga a
inventar más placeholders (offset, caída, tipo de junta) para una pieza que
`escena.md` mismo posterga a la fase siguiente — la segunda y tercera
válvula, el desvío. Reubicar la válvula sin esa derivación la deja colgando
de un caño cortado a la nada: peor lectura que hoy.

**Detalle no arbitrario:** la altura de los soportes del caño (0,92 m) sí
está calculada, no inventada — llega exacto a la cara inferior del caño
(centro a 1,3 m, radio 0,38 m), para que no quede flotando sin apoyo visible.

**Se resuelve junto con:** el desvío (próximo paso, ver sección 4 de
`escena.md`), no antes.

---

### Renombre TK404/TK401: asignación arbitraria de lado
**Decidido — arbitrario, sin fuente.**
`tank-a`/`tank-b` pasaron a `tk404`/`tk401` en todo el archivo de escena
(ids de nodo, `PathQuery`, `Valve.from/to`), por instrucción explícita de
`escena.md` §3 ("no tank-a/tank-b"). TK404 quedó en x=-71, TK401 en x=+71.

**Por qué ese lado y no el otro:** `escena.md` no especifica qué tanque real
corresponde a qué posición. Se mantuvo el mismo orden izquierda-derecha que
el diagrama ASCII de la sección 3, relativo a cómo el jugador realmente ve
los tanques parado en el punto de aparición (mirando hacia -Z sin rotación,
+X es su derecha). No es un dato de sitio real — si en algún momento se
consigue cuál TK está de qué lado en la instalación real, corregir acá.

---

### Costuras de virola: banda cilíndrica, no toro
**Implementado.**
Anillos horizontales en la envolvente del tanque, marcando las hiladas de
construcción soldadas.

**Por qué banda y no toro:** una costura de soldadura es una junta casi
plana entre dos chapas, no un tubo enroscado alrededor del tanque — un
`CylinderGeometry` fino y abierto en los extremos da ese perfil; un toro se
leería como un caño enrollado, forma equivocada.

**Derivación de la separación:** el pedido fue "cada ~3 m". 12 hiladas sobre
los 35 m de envolvente dan una separación real de 35/12 ≈ 2,92 m (11
anillos interiores), en vez de un paso parejo de 3 m que dejaría un resto
corto sin sentido arriba de la última hilada. Sin anillo en el domo — es
aluminio abulonado, no chapa soldada, no comparte esa construcción.

---

### Escalera y galpón: referencia de escala humana, dimensiones placeholder
**Implementado — una sola escalera, un solo galpón.**
Escalera con baranda apoyada contra TK404; galpón chico junto al manifold.

**Por qué una sola escalera y en TK404, no una por tanque:** el pedido dice
"una escalera" y "alguna estructura", singular en los dos casos — agregar
una por tanque habría sido escala no pedida. TK404 porque es el tanque que
nombra la tarea de despacho ("habilitar el despacho de TK404").

**Cómo quedó (placeholders, sin fuente):** contrahuella 0,2 m, pedada 0,3 m,
30 escalones ⇒ 6 m de subida, 9 m de recorrido, ~33,7° de pendiente; ancho
1,2 m. Escalones como cajas sólidas apiladas (perfil "ziggurat"), no rampa
con textura pintada — no hay pipeline de texturas en este proyecto para
fingir contrahuellas. Baranda como un solo caño a lo largo de la hipotenusa
más 4 postes, no un barrote por escalón.

Galpón: caja + techo a un agua (lean-to), sin textura — placeholders de
3×2,5 m en planta, pared frontal 2,4 m, trasera 3 m.

**Por qué sin `Ghostable` en los dos:** son escenografía ajena al problema
de visibilidad de ruta que resuelve el modo de transparencia — no tiene
sentido que un galpón se transparente para ver a través de un tanque.

---

### Audio ambiente: sintetizado, parámetros de diseño sonoro
**Implementado.**
Zumbido grave posicional cerca del manifold, viento de fondo ambiente —
"sonidos sintéticos" explícito en el pedido, no grabaciones.

**Cómo se generó:** `scripts/generate-audio.mjs`, un script de Node sin
dependencias (no hay ninguna en el proyecto) que escribe un header
RIFF/WAVE y muestras PCM de 16 bits a mano. Se corre una sola vez
(`node scripts/generate-audio.mjs`), no es parte del build.

**Parámetros — elección de diseño sonoro, no dato de ningún tipo:**
zumbido: 55/110/165 Hz muy suave (pico ≈0,094), loop de 4 s sin costura
(todas las frecuencias completan ciclos enteros en el loop). Viento: ruido
blanco filtrado pasabajos (~500 Hz de corte), loop de 8 s, pico ≈0,04 —
"muy suave y bajo" según el pedido.

**Dónde vive cada fuente:** el zumbido cuelga del nodo `manifold-pad`
existente (posicional — ahí está parado el operador). El viento es un nodo
nuevo `ambient-wind` (no posicional, suena desde el observador) — no se
colgó del nodo `ground`, que es específicamente la superficie de
locomoción, no un lugar genérico para lo que sea.

---
 
## Representación
 
### Sin vista 2D acompañante
**Decidido.**
No hay un plano ni un P&ID digital como interfaz principal.
 
**Por qué:** si la respuesta al problema es una vista 2D, no hace falta un visor — alcanza con una tablet. Todo lo que el proyecto proponga tiene que aprovechar que la persona está adentro del espacio.
 
---
 
### Modo de transparencia
**Implementado — segunda pasada, sigue global.**
Los objetos de la instalación pasan a semitransparentes conservando el borde
donde lo hay, para poder ver la ruta a través de ellos sin abandonar la
escala real. Se activa con el botón Y del control izquierdo.

**Por objeto vs. global — decidido, por ahora global:** la idea de apuntar a
un objeto puntual y transparentarlo solo a él (gatillo + raycast) quedó
evaluada y descartada por el momento, no por costo técnico sino porque
todavía no hay evidencia de que sea mejor que el toggle global para el caso
de uso (seguir una ruta que cruza varios objetos a la vez). Se puede retomar
más adelante si la prueba en visor muestra que hace falta.

**Cómo quedó:** cuerpo a opacity 0.16 (alpha real, no wireframe). Los tanques
además muestran un contorno (`EdgesGeometry`, solo los cantos de ~40°+, no
las costuras suaves del cilindro) que aparece cuando el cuerpo se vuelve
transparente; el caño y la válvula no tienen ese contorno (son sólidos
simples de una sola pieza, se leen igual sin él). Es un componente genérico
(`Ghostable`) y no algo específico de tanque: **ahora alcanza también al
caño y a la válvula**, no solo a los tanques — importante porque seguir una
ruta significa poder ver a través de cualquier tramo que la obstruya, no
solo los tanques en las puntas. Sigue siendo un toggle global — todo lo
`Ghostable` a la vez, on/off.

**Encontrado al generalizar (no obvio, vale dejarlo anotado):** al extender
el sistema de tanque a caño y válvula con la misma mutación de material
(`transparent`/`opacity`/`depthWrite`), la válvula no cambiaba de opacidad
visualmente aunque el objeto `Material` en memoria mostraba los valores
correctos — mismo `MeshStandardMaterial`, mismas propiedades que el cuerpo
del tanque (que sí funcionaba), verificado con logs en el runtime del
emulador. Hacía falta forzar `material.needsUpdate = true` después de tocar
`transparent`/`opacity` para que el renderer lo recompile; sin eso, el
cambio queda mutado en JS pero no llega a pantalla. No se pudo establecer la
causa exacta contra el motor (three.js vía el fork `super-three` que usa
este proyecto) — quedó resuelto de forma empírica, verificado con
capturas antes/después en el emulador, no por lectura de código del motor.

**Riesgo identificado (sigue abierto):** si todo se vuelve transparente se
pierde la oclusión, y con ella la percepción de profundidad. Todo flota a la
misma distancia. **No implementado todavía:** transparentar solo lo que está
entre el observador y el objetivo — esta pasada sigue siendo global, las dos
mitigaciones más finas (parcial, modal/momentáneo en vez de toggle
persistente) siguen sin probar.

**Riesgo técnico:** con pocos sólidos no debería notarse, pero no se pudo
verificar framerate real en visor desde este entorno — sin acceso a un
navegador de visor conectado, solo al emulador.

**A responder con la prueba:** ¿a escala real alcanza la transparencia para
seguir la ruta, o se pierde igual la referencia? Sigue sin responder — hace
falta probarlo puesto.

---

### Punto de aparición del jugador
**Implementado.**
El jugador aparece cerca de la válvula, no al lado de un tanque.

**Por qué:** la válvula es el objeto de la interacción operativa (ver "El
momento operativo es el alineamiento de válvulas"); aparecer ahí en vez de
al lado de un tanque pone al jugador frente al objeto de trabajo desde el
primer instante, en vez de tener que caminar 100+ m para encontrarlo.

**Por qué no teleport:** se descarta explícitamente por el principio de
embodiment que ya viene sosteniendo el proyecto — ver "La escala funciona".
Se está representando un área real; saltar por teleport rompe la escala
corporal que es el resultado positivo ya verificado del proyecto. El
desplazamiento sigue siendo caminado (`SlideSystem`/locomoción).

**Cómo quedó:** `player.transform` en el scene JSON y
`locomotion.initialPlayerPosition` en `iwsdk.config.json` — hay que
mantenerlos sincronizados, ver el bug de spawn en el registro del proyecto.
Jugador a `[0, 0, 6]`, mirando hacia `-Z` (sin rotación), a 6 m de la
válvula sobre el eje del caño. **Valor de distancia (6 m): juicio de diseño,
no medido en visor** — suficiente para leer la válvula (1,2 m) completa sin
quedar pegado a ella ni perderla de vista, pero no verificado a escala real
todavía; ajustar si la prueba en visor lo pide.

---

### Descubribilidad de controles
**Implementado — sin verificar en visor.**
Panel chico anclado a la mano izquierda (sigue el grip vía `Follower` en modo
`PivotY`), visible al entrar a la sesión XR. Lista qué hace cada botón:
gatillo para apuntar y operar la válvula, Y para transparencia, X para
mostrar/ocultar el panel mismo.

**Por qué en la mano y no HUD fijo:** el panel de estado del camino ya está
marcado más abajo como decisión pendiente por estar atado al observador en
vez de vivir en la instalación. Poner este panel en la mano en vez de la
pantalla es la alternativa más barata de probar antes de decidir dónde vive
la información de verdad — mismo dilema, segunda instancia.

**Se oculta:** a los 6 segundos si no se usó nada, o en el primer uso
(válvula o transparencia, lo que ocurra primero). Se puede volver a mostrar
con X en cualquier momento.

**Sin verificar:** el seguimiento de la mano y la lectura de botones son
código que solo corre con hardware XR real. No hay visor conectado a este
entorno — falta confirmación de que la orientación del panel quede legible
al levantar la mano, y de que la elección de botón (Y/X en el control
izquierdo) no choque con algo del runtime del visor.

---
 
### Maqueta en la muñeca (World in Miniature)
**Abierto.**
Réplica reducida de la instalación, accesible mirando la muñeca.
 
**Antecedente:** World in Miniature — Stoakley, Conway y Pausch, 1995.
Citarlo; el patrón tiene treinta años y conocerlo suma.
 
**Problema de diseño identificado:** la escena mide ~140 m; para entrar en
una muñeca necesita ~1:500. A esa escala un tanque queda de 16 cm (bien) pero
una válvula de un metro queda de 2 mm — invisible e inapuntable.
 
**Consecuencia:** la maqueta no puede ser una réplica a escala. Los tanques
van a escala y las válvulas se exageran o se vuelven símbolos. En ese momento
deja de copiarse el mundo y empieza a diseñarse una notación. Ese es el
trabajo de diseño central.
 
---
 
### Divergencia entre lo real y lo reportado
**Abierto — objetivo final.**
Que la vista a escala real muestre el mundo físico y la maqueta muestre lo
que el *sistema cree* que está pasando: la posición reportada de cada
válvula.
 
**Por qué:** cuando coinciden no pasa nada. Cuando no coinciden, hay una
persona parada frente a una válvula cerrada mientras la maqueta insiste en
que el camino está abierto. Es el problema de Marshall — datos que admiten
dos lecturas — convertido en espacio.
 
**No construir todavía.** Ordena todo lo demás, pero requiere que las dos
vistas existan primero.
 
---
 
### Ubicación del panel de estado
**Resuelto — parcialmente, vive en la instalación.**
Antes estaba en `ScreenSpace`: pegado a la vista, tipo HUD, seguía al
observador tanto en posición como en rotación. Ahora es al revés: el panel
tiene una posición fija en el mundo, flotando sobre la válvula (no sobre el
operador), y solo su rotación (eje Y únicamente, sin inclinar el texto)
sigue la cabeza del jugador para que se pueda leer desde cualquier ángulo.
La intersección/raycast de la válvula en sí no cambió — sigue igual que
antes, esto es solo sobre el panel de texto.

**La decisión de fondo, resuelta:** ¿la información está pegada al operador,
o vive en la instalación? Se optó por que viva en la instalación (postura
"vive ahí"), con una concesión de legibilidad (rotación sigue al que mira)
en vez de una concesión de posición (que persiga al operador). Es una
postura intermedia, no las dos puntas extremas que planteaba la entrada
original.

**Por qué ahora y no antes:** la ilegibilidad a distancia que motivó el HUD
en su momento deja de ser un problema con el punto de aparición del jugador
movido a estar cerca de la válvula (ver "Punto de aparición del jugador") —
el panel a "vive en la instalación" ya no obliga a leer desde lejos. Las dos
decisiones están acopladas: el panel anclado al mundo depende de que el
operador empiece cerca de él.

**Cómo quedó técnicamente:** el nodo sigue usando `ScreenSpace` (necesario
para el fallback 2D fuera de XR, ancla la vista de escritorio a la cámara
igual que antes) pero en sesión XR ese mismo sistema reparenta el documento
UIKit de vuelta al nodo de la escena con posición fija — ahí es donde se
engancha la rotación hacia la cabeza del jugador, cuadro a cuadro, sin tocar
la posición.

**Sigue abierto:** la posición fija exacta (altura 2,5 m, 4 m de la válvula
hacia donde aparece el jugador) es elección de diseño, no medida en visor —
falta confirmar que se lea bien parado en el punto de aparición real.

---

### Panel de misión: fijo cerca del spawn, 12 s de auto-ocultado
**Implementado.**
Al entrar a la sesión, un panel declara el objetivo: "Tarea: Habilitar el
despacho de TK404 hacia la línea de exportación" — texto exacto pedido
(salvo tildes, ver nota de fuente abajo).

**Por qué sistema propio y no extender `ControllerHintSystem`:** el anclaje
es distinto (fijo en el mundo, no siguiendo el grip de la mano), forzarlo
adentro del mismo sistema hubiera significado ramas/arrays para dos formas
de anclaje. Mismo criterio de un-sistema-por-panel que ya sigue el proyecto
(`PanelSystem`/`ControllerHintSystem` separados). El patrón interno
(mostrar al entrar a XR, ocultar una vez y no volver a mostrar) es una
copia directa del de `ControllerHintSystem` — mismo problema, misma forma.

**Por qué 12 s y no los 6 s del panel de controles:** es una oración para
entender la tarea, se lee una vez; 6 s (pensado para un recordatorio de
botón de una palabra) es corto para una frase completa.

**Se oculta:** a los 12 s, o al primer uso de la válvula (el jugador ya
entendió y está trabajando) — mismo evento de calificación
(`[Valve, Pressed]`) que ya usa el panel de controles.

---

### Identificadores del mundo: tamaño de panel y aritmética de escala
**Implementado.**
Nombre de cada tanque pintado en letras grandes sobre la envolvente, placa
chica junto a la válvula — regla dura de `escena.md`: son parte física del
mundo, siempre visibles, no reportan estado.

**Cómo se cumple "siempre visible":** sin componente `Ghostable` en estos
nodos. `TransparencySystem` solo toca entidades `Ghostable`, así que
omitirlo alcanza para que queden opacos pase lo que pase con el toggle de
transparencia — verificado con captura, el nombre queda legible con el
tanque atrás completamente fantasma.

**Aritmética de escala:** panel UIKit autoría a `font-size:100` (1 m) ×
`transform.scale:4` = **4 m de alto**; `width:500` (5 m) × 4 =
**20 m de ancho**. Montado al ras de la envolvente (radio 41 + 0,1 m),
altura y=14 (placeholder, ~40% de los 35 m, libre de la berma), yaw
calculado hacia el manifold (90°/-90° según el lado).

**Aproximación reconocida:** un panel plano de 20 m tangente a un cilindro
de 41 m de radio tiene flecha ≈0,30 m en los bordes — las letras de las
puntas del nombre quedan ~30 cm despegadas del casco real. Coherente con
"geometría por primitivas, no fidelidad" ya declarado en `escena.md`.

**Placa de válvula:** id inventado `MOV-4001` (prefijo tipo + área 40
compartida con la familia TK4xx + servicio 01) — la convención ya está
pre-aprobada en `escena.md` ("Identificadores de válvulas"), el número
puntual es la elección de esta ronda.

**Hallazgo no relacionado, corregido de paso:** el renderer de texto de
este proyecto no tiene glifo para tildes ni eñe (`í`, `ó`, `á`...) —
se renderizan como un cuadro vacío, confirmado con captura y con el log del
navegador ("Missing glyph info"). No se encontró una forma de solucionarlo
declarando una fuente alternativa por `@font-face` en el tiempo de esta
sesión (se probó, sin éxito, ver historial de la sesión). Mientras tanto,
todo texto nuevo va sin tildes — el panel de misión dice "linea" y
"exportacion" sin acento, y de paso se corrigió "válvula" → "valvula" en el
panel de controles ya existente, que tenía el mismo problema. **Pendiente
real:** conseguir una fuente con cobertura de español y confirmar que sí
se pueda declarar — no verificado que sea imposible, solo que no se logró
acá.

---
 
## Método
 
### Documentar las decisiones mientras se toman
**Decidido.**
Este archivo. Más capturas de cada versión.
 
**Por qué:** el par de versiones — la obvia y la que la corrige — con la
explicación de por qué existe la segunda, es el portfolio. No el render
final.
 
### Documentar también lo que no se verificó
**Decidido.**
Los pendientes se marcan como pendientes y se publican así.
 
**Por qué:** ante un lector técnico, mostrar qué no se sabe suma más
credibilidad que afirmar de más. El riesgo real de este proyecto nunca fue
no haber pisado una instalación; es afirmar cosas sin fuente.
 