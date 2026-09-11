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
 
**Sobre el antecendente Marshall** Este es un ejercicio de diseño sobre un problema documentado y todavía vigente. No fue validado con operadores ni con especialistas de dominio. No propone reemplazar ningún sistema. Muestra cómo abordo un problema de legibilidad espacial, con datos públicos y limitaciones declaradas.

### Se descartó reducir el proyecto a un explorador informativo
**Decidido.**
Ante la imposibilidad de validar con operadores se evaluó reemplazar la
mecánica de decisión por un recorrido informativo de la instalación.

**Descartado porque:** los identificadores y descripciones de un explorador
también habría que inventarlos — mismo riesgo de exactitud, sin el aporte
de diseño que lo justifica. Y compite con material institucional real.

**Se corrige el reclamo, no el artefacto.** El proyecto no propone un
sistema para operadores ni afirma prevenir ningún incidente. Es un ejercicio
de diseño sobre un problema documentado y vigente, sin validación de dominio.

**El problema no está resuelto en la industria:** EEMUA 191 (1999) e
ISA-18.2 (2009) existen precisamente porque la sobrecarga y la mala lectura
de información en salas de control son condiciones crónicas.

Existe un marco regulatorio y normativo específico para la interacción entre controladores e información en operaciones de ductos — PHMSA CRM, API 1165, 1167, 1168 — que obliga a gestionar alarmas, considerar factores humanos y revisar si las acciones de sala de control contribuyeron a cada incidente. Que esa arquitectura normativa exista y siga vigente indica que el problema es una condición a gestionar de forma continua, no un episodio resuelto.

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
 
 ### Escala real verificada: el embodiment funciona
**Verificado en visor — 09/09/2026.**
Con la escena a escala real (tanques de 82 × 35 m) y geometría de primitivas
grises, sin texturas, la sensación reportada fue de estar en contexto de
proyecto y lugar.

**Por qué importa:** es la respuesta empírica a "¿por qué esto necesita un
visor y no una tablet?". Deja de ser un argumento teórico.

**Corolario:** el embodiment no vino del fotorrealismo. Cualquier inversión
futura en fidelidad visual tiene que justificarse por otra cosa.

---

### La caminata entre tanques es larga y vacía
**Hallazgo, parcialmente resuelto.**
El traslado entre tanques resultó tedioso.

**Diagnóstico:** son dos problemas distintos. Que sea *larga* es un dato del
mundo real y no se corrige. Que sea *vacía* es un problema de diseño.

**Resuelto por investigación, no por diseño:** la referencia de la
instalación real mostró que los tanques no se conectan entre sí y que el
ruteo se concentra en un sector de manifold. El operador no camina entre
tanques cambiando válvulas. El problema se disolvió al entender mejor el
dominio.

**Tensión que queda abierta:** la distancia entre manifold y tanques sigue
siendo el motivo por el que no se ve el estado completo de la ruta. Es el
problema y es el valor al mismo tiempo.

**Descartado explícitamente:** teletransporte. Elimina la distancia y con
ella el sentido de escala que sí se verificó que funciona.

---

### Identificadores en el mundo, estado en la interfaz
**Decidido.**
Los identificadores de tanque van pintados sobre la envolvente, en letras de
varios metros, como en una playa de tanques real. Las válvulas llevan placa
con su identificador. Ninguno de los dos es una capa de UI.

El **estado** — válvula abierta o cerrada, camino completo o incompleto — no
va en el mundo. Lo reporta el sistema y se muestra aparte.

**Por qué:** lo que está pintado o atornillado existe siempre, no depende del
sistema y no puede mentir. Lo que reporta la interfaz sí puede estar
equivocado. Esa frontera es la que sostiene el objetivo final del proyecto
—la divergencia entre lo real y lo reportado—: cuando llegue, el usuario ya
va a tener aprendido en qué confiar.

**Corrección posterior:** los identificadores de tanque (TK404, TK401) son
reales y públicos. Los de válvula fueron inventados siguiendo convención de
industria; los reales están en P&ID de ingeniería, que no son públicos. Se
usa prefijo `HV-` (hand valve) y no `MOV-`, que corresponde a válvulas de
accionamiento motorizado y no a las manuales del manifold.

---

### Skybox en lugar de terreno modelado hasta el horizonte
**Decidido.**
El cielo y el horizonte lejano se resuelven con skybox. El terreno geométrico
se limita al área caminable.

**Por qué:** costo de rendimiento casi nulo, que importa en el navegador del
visor.

**A cuidar:** que el color del borde del piso empate con el horizonte del
skybox, y que la dirección de la luz direccional coincida con la posición del
sol de la imagen. Si no, las sombras apuntan mal y rompen la sensación sin
que se sepa por qué.

**Origen del asset:** [completar — si es HDRI de Poly Haven u otra fuente,
anotar licencia].

---

### Gaussian Splatting satelital: evaluado y descartado
**Descartado.**
Se evaluó reconstruir la instalación mediante Gaussian Splatting a partir de
imágenes satelitales o datos de mapas.

**Estado del arte relevado:** EOGS (Earth Observation Gaussian Splatting),
que adapta 3DGS a sensores pushbroom satelitales con corrección radiométrica
y modelado de sombras, ~300× más rápido que los métodos NeRF previos.
EOGS++, que opera sobre datos pancromáticos crudos con bundle adjustment
integrado. SkySplat, ~86× más rápido que EOGS. Los tres con código público.

**Por qué no aplica:**
- *Resolución.* El mejor error medio reportado es de ~1,80 m. Sobre un tanque
  de 82 m eso da un volumen reconocible, pero una válvula de 1 m y un caño de
  0,76 m quedan por debajo del ruido. Todo lo operable desaparece.
- *Insumos.* Requiere imaginería satelital multi-vista de alta resolución con
  modelos de cámara RPC. Es material comercial, no descargable.
- *Tipo de salida.* Modelo de superficie visto desde arriba. No hay geometría
  a nivel de piso, que es donde está parado el usuario.

**Google Photorealistic 3D Tiles:** descartado también. La cobertura
fotogramétrica es urbana y Punta Colorada es costa despoblada. La licencia
complica la publicación. Y la extracción de geometría vía RenderDoc viola los
términos de servicio.

**Dónde sí encajaría:** paisaje lejano como alternativa al skybox, no equipo
operable. El candidato técnicamente bueno sería splatting desde imágenes de
dron, pero no hay acceso a las tomas crudas de la obra.

**Razón de fondo:** ya se verificó que el embodiment funciona con primitivas
grises. La fidelidad fotográfica no es lo que falta; falta la tarea, el
desvío y la consecuencia.

---

## El desvío: segunda y tercera válvula

### El grafo deja de ser lineal
**Decidido.**
Antes: una sola válvula conectaba `tk404` directo con `tk401` — contradecía
`escena.md` §1 ("los tanques no se conectan entre sí"), brecha ya reconocida
en "Sector de manifold: decorado en el eje existente, no reubicado" y
pospuesta a propósito hasta tener la segunda y tercera válvula.

Ahora: desde `tk404` el crudo entra al manifold (nodo `manifold`, el cuerpo
de la T) y de ahí se reparte hacia `linea-exportacion` (destino correcto,
ya declarado por el panel de misión: "despacho de TK404 hacia la linea de
exportacion") o `destino-secundario` (señuelo). Tres válvulas:

| entidad           | from       | to                  | placa     |
|--------------------|-----------|---------------------|-----------|
| `valve`             | `tk404`   | `manifold`          | `HV-4001` |
| `valve-export`       | `manifold`| `linea-exportacion` | `HV-4002` |
| `valve-secondary`    | `manifold`| `destino-secundario`| `HV-4003` |

**Combinación con camino completo al destino equivocado:** `HV-4001` +
`HV-4003` abiertas, `HV-4002` cerrada.

**tk401 sale del grafo activo**, sin arista propia — sigue existiendo como
tanque completo (domo, recinto, id), pero temporalmente sin línea propia
modelada. Inventarle una ahora choca con `escena.md` §5 ("no agregar los
tanques restantes hasta que el manifold y las válvulas estén resueltos") —
misma lógica que ya se usó para posponer el desvío mismo. **Brecha
reconocida, no atajo silencioso**, igual que el manifold en el eje
equivocado lo fue en la pasada anterior.

**Fix de paso:** la placa de `valve` decía `MOV-4001` en el archivo, pese a
que la corrección a `HV-` (manual, no motorizada) ya estaba loggeada más
arriba ("Identificadores del mundo") sin aplicarse. Se corrige ahora junto
con las dos placas nuevas (`HV-4002`, `HV-4003`), mismo prefijo.

### Universo de destinos inferido del grafo, no declarado aparte
**Decidido.**
`ValveSystem` necesitaba saber "cuáles son los otros destinos posibles" para
distinguir *completo hacia el destino correcto* de *completo hacia el
equivocado* — antes solo evaluaba conectividad para el par `from`/`to`
declarado en `PathQuery`, sin noción de un tercer estado.

**Cómo se resuelve:** en un grafo en árbol (una raíz, ramas que no vuelven a
converger) el universo de destinos es "todo nodo que aparece como `to` de
alguna válvula pero nunca como `from`" — se calcula puro sobre las válvulas
que ya existen en la escena, sin declarar nada nuevo.

**Alternativa evaluada y descartada:** un componente `Destination` marcando
nodos en el JSON. Se descarta por agregar componente + entidades para el
mismo resultado que ya da la inferencia sobre `Valve`. **Si el manifold deja
de ser un árbol simple** (una válvula que reconecta dos ramas, por ejemplo)
esta inferencia deja de valer y hay que revisarla — no es válida en general,
solo para la forma actual del grafo.

### Texto del estado "destino equivocado": provisorio
**Provisorio — no es una decisión de diseño.**
El panel ahora puede mostrar `"camino: completo -- destino-secundario"`
además de `"completo"` / `"incompleto"`. A diferencia del texto del panel de
misión (pedido con palabras exactas), esta redacción la elegí yo esta
ronda — nombra el nodo equivocado en vez de decir "equivocado" a secas,
porque parecía más útil para el rompecabezas, pero no está confirmada. El
texto interpola directamente el id del nodo (`destino-secundario`), sin una
etiqueta separada — funciona porque los ids ya se eligieron legibles en
español; si un id futuro no lo fuera, esto habría que revisarlo.

Sigue sin tildes por el bug de glifos ya documentado ("Identificadores del
mundo... Hallazgo no relacionado") — no aplica acá de todas formas, ninguna
de las tres palabras las lleva.

### Geometría de la derivación: T real, sin codo nuevo
**Decidido.**
El tramo TK404→manifold no necesitaba una pieza de codo (ya señalada como
inexistente en "Sector de manifold: decorado en el eje existente") — es un
solo caño recto en diagonal, desde la pared de TK404 (x=-30, z=0) hasta el
cabezal del manifold, calculado con la misma trigonometría que ya usa
`ValveSystem` para el billboard del panel (yaw en el plano XZ, sin
inclinación porque ambos puntos comparten y=1,3).

**La T es real, no decorativa:** el caño sigue derecho desde TK404 hasta la
válvula de exportación (`HV-4002`) — son geométricamente la misma línea, sin
pieza intermedia — y la rama hacia `HV-4003` se desprende a 90° en ese punto.
Nuevo `pipe-tee.scene-asset.ts`: solo una esfera (radio 0,5 m) que tapa la
costura de tres caños, mismo criterio que ya se usó para las juntas de la
berma ("se superponen levemente... invisible a esta escala"). Nuevo
`pipe-run.scene-asset.ts` (función `createPipeRun(length)`, única fábrica del
proyecto en vez de archivo por instancia — acá sí hacían falta tres largos
distintos con el mismo radio/material). Nuevo `pipe-endcap.scene-asset.ts`
(brida ciega) donde cada rama sale de la escena hacia un destino no
modelado.

**El caño recto de 60 m que unía las dos paredes de tanque se elimina.** Era
exactamente la ficción que este paso corrige; dejarlo al lado del ramal
nuevo hubiera leído como dos líneas distintas cerca de TK404.

**Reubicación del manifold — valores sin verificar en visor propio, solo
por render de editor:** cabezal en `x=0, z=-12` (perpendicular al eje
TK404–TK401, "a un costado" según `escena.md` §3), spawn del jugador movido
a `[0,0,-18]` mirando hacia +Z (mismo criterio de "6 m detrás del cluster de
válvulas" que ya tenía el spawn original), panel de estado a `[0,2.5,-16]`
(mismo offset de 2 m detrás del spawn, 4 m del cabezal, que tenía antes).
Verificado con `scene_render_file` (vistas `top`, `spawn-check`, `quarter`)
en esta sesión — `visibleNodeIds` incluye toda la geometría nueva, la
composición del spawn-check muestra los dos tanques simétricos con el
cluster de válvulas al frente. **No verificado:** lectura en visor real ni
legibilidad de las placas nuevas a la distancia — sigue pendiente, como ya
lo estaba la posición del panel de estado en la entrada anterior sobre eso.

**Playón del manifold:** se reposiciona y se rota (`rotationDeg.y` igual al
del caño principal) para que sus dos soportes internos, que son
axis-aligned en su espacio local, queden bajo la línea principal otra vez.
La rama hacia `HV-4003` sale a 90° de esa línea y se queda sin soporte
propio — brecha reconocida, no se resuelve acá.

## Problemas en testeo y hallazgos: 
**combinaciones a ciegas**  el unico que veo etiquetado es el HV-4003 el resto ambos dos no se cual es cual, eso es un gran problema. otra cosa, no tengo forma de saber cuando una esta abierta o cerrada, no hay algo que cambie, ej el color simplemente es un cuadrado que le doy "click" y cambia el destino arriba, pero para saber eso tengo que probar combinaciones a ciegas.

---

### HV-4003 quedaba tapado desde el spawn
**Hallazgo del usuario, resuelto — bug real, no de `Ghostable`.**
Las tres placas son parte del mundo (`escena.md`, "Qué es entidad y qué es
decoración") y no llevan `Ghostable`, así que la regla de "siempre visibles"
nunca estuvo en duda — lo que fallaba era la geometría por debajo: dos
válvulas quedaban parcial o totalmente tapadas desde el punto de aparición.

**Diagnóstico, con `scene_render_file` contra el spawn real, no a ojo:**
1. **HV-4001 y su tramo de caño principal no aparecían en `visibleNodeIds`
   desde `spawn-check`.** La válvula `valve-secondary` (entonces ubicada casi
   en línea recta entre el spawn y HV-4001) lo tapaba — a esa distancia el
   cubo de 1,2 m alcanza para ocluir un objeto detrás.
2. **Las placas de HV-4001 y HV-4002 apuntaban con un error de orientación**
   de hasta 33° — se habían colocado con una rotación aproximada (180°
   parejo para las dos) en vez de calcular el ángulo exacto hacia el spawn
   para cada una. No alcanzaba para taparlas del todo, pero sí para
   degradar la lectura.
3. **HV-4003, incluso ya con su placa bien orientada hacia el spawn, seguía
   sin aparecer en `visibleNodeIds`** al recolocar la rama a 90° de la línea
   principal (primer intento de arreglo) — quedaba casi exactamente detrás
   del caño principal y de la T (a ~7° de la línea de mira spawn→cabezal),
   así que ese caño y esa esfera, más grandes, la tapaban igual. La
   corrección fue angular, no de rotación de placa: abrir la rama a la
   izquierda del eje mucho más (de vuelta a un ángulo derivado del propio
   caño de TK404, pero por el lado contrario, y con la rama alargada de 3 a
   4,5 m) hasta que la línea de mira spawn→HV-4003 quedara despejada de
   HV-4001 y del cabezal a la vez. Verificado agregando una vista de
   autoría temporal apuntada directo a cada válvula, confirmando
   `visibleNodeIds` antes de borrar esa vista.

**Placas: se recalculó la orientación de las tres** con el mismo método
(vector spawn − posición de la placa, ángulo exacto, no una rotación
compartida aproximada) y se las movió al lado de su válvula que da hacia el
spawn, no a un costado genérico — así ninguna queda detrás del cuerpo de la
válvula que identifica.

**Por qué importa el método y no solo el resultado:** las tres correcciones
se verificaron con `scene_render_file` leyendo `visibleNodeIds`, no
mirando una captura y decidiendo "parece que sí". La tercera en particular
no se habría encontrado a ojo — a la distancia del render se veía una placa
del tamaño de un píxel, indistinguible de "no está".

**Pendiente real:** esto se verificó contra el editor (render offline), no
contra el visor real con las manos del usuario — falta confirmar que a
distancia interactiva (acercándose, mirando alrededor) las tres se lean
cómodo. El offset placa-válvula (1,1 m) y el ángulo de apertura de la rama a
`HV-4003` (¿por qué exactamente ese ángulo y no otro?) siguen siendo
elección de esta ronda, no una medida — si hace falta más separación, es un
número para ajustar, no un rediseño.

---

### La válvula muestra su posición en el mundo, no con color
**Decidido, en respuesta directa al segundo hallazgo del usuario.**
El pedido: nada de semáforo (verde/rojo) ni luz — la posición de una manija
es la única fuente de verdad, igual que en una válvula real de compuerta o
mariposa, donde el vástago o la manija muestran el estado a simple vista sin
ningún indicador agregado.

**Cómo quedó:** `valve.scene-asset.ts` pasa de un único `Mesh` a un `Group`
(cuerpo + vástago corto + manija, una barra `BoxGeometry` de 0,9 m montada
arriba del cuerpo). La manija es el único mesh con nombre `'handle'` —
`ValveSystem` la ubica vía `entity.object3D.getObjectByName('handle')`, sin
ids de nodo hardcodeados (mismo criterio de mantener el grafo/la escena como
fuente de datos que ya usa el resto del sistema). Rotación de la manija:
0 rad (alineada con el eje local X) si `open`, 90° (cruzada) si no —
`updateHandles()` la interpola hacia el ángulo objetivo cada frame en vez de
saltar, a ~540°/s (un cuarto de vuelta en ~0,17 s), así que un toggle se ve
girar, no teletransportarse. Al cargar la escena no anima: `snapHandles()`
en `init()` deja cada manija ya en su ángulo correcto, para no arrancar con
manijas girando solas antes de que el usuario toque nada.

**Por qué el ángulo objetivo depende de la rotación del nodo, no es fijo:**
"alineada con el caño" solo significa algo si el eje local X de la válvula
ya apunta en la dirección real del caño en esa posición — por eso las tres
válvulas ahora llevan `rotationDeg.y` propio en el JSON (antes ninguna lo
tenía, daba lo mismo con un cubo simétrico). Ese valor es el mismo ángulo
usado para orientar el tramo de caño correspondiente, no uno nuevo inventado
para la válvula.

**No verificado:** que la manija se lea con claridad a la distancia y
ángulo con que un jugador realmente se acerca a operar la válvula — pendiente
de confirmar en visor, igual que las placas.

---

### Placas: texto cortado y HV-4003 detrás del caño
**Hallazgo del usuario (con captura del editor), resuelto.**
Dos problemas de acabado sobre lo de la entrada anterior.

**Texto cortado:** `width: 40` con `padding` de 6 a cada lado dejaba 28
unidades para el texto; "HV-4001"/"-4002"/"-4003" a `font-size: 9` no
entraba. Pasa a `width: 54`, `padding` 4, `font-size: 8` en las tres placas
— mismo cambio, mismo archivo × 3, no una decisión de diseño distinta por
válvula.

**HV-4003 detrás del caño:** el offset de la entrada anterior apuntaba hacia
el spawn, un punto fijo lejano — para HV-4001/HV-4002 (que están casi en la
línea recta hacia el spawn) eso coincide más o menos con el costado libre de
la válvula, pero HV-4003 sale en un ángulo muy distinto (la rama abierta
para despejarla del caño principal, ver entrada anterior) y ese mismo offset
la dejaba del lado que da hacia el caño, no hacia el costado abierto.

**Corregido con una regla más simple y más general:** la placa va al costado
de la válvula perpendicular a su propio caño (no hacia un punto externo),
usando la misma rotación que ya tiene el nodo de la válvula — a
`rotationDeg.y` de la válvula le suma 180° y ese es el ángulo de la placa;
la posición es la válvula más 1,1 m en esa dirección. HV-4001 y HV-4002 no
se tocaron (ya se leían bien); solo se recalculó HV-4003 con esta regla.
Verificado con una vista de autoría temporal parada del lado "bueno" de
HV-4003, confirmando que la placa entra en `visibleNodeIds` sin que el caño
esté en el medio — borrada después de verificar, no queda en el JSON final.

---

## Panel de investigación: hilo con fuentes

### Causa real del bug de tildes: no es la fuente, es el charset del generador MSDF
**Encontrado — la fuente local NO arregló nada, y ahora se sabe por qué.**
Antes de tocar el panel nuevo, confirmé lo pendiente de la sesión anterior:
descargué DM Sans, la serví desde `public/ui/fonts/` (sin red externa de por
medio) y rendericé un panel de prueba con "CORRECCIÓN acotación válvula".
Mismo resultado: cuadros vacíos en Ó/Á. Eso descarta CORS/red como causa —
hacía falta ver el código, no adivinar más.

**Encontrado en el código, no supuesto:** `@drawcall/uikitml` (el parser de
`.uikitml`) resuelve cada `@font-face` llamando
`new TTFLoader().loadAsync(src)` — **sin opciones** (`fonts.js`,
`loadTTF()`). El `TTFLoader` de `@pmndrs/uikit` (`loaders/ttf.js`) genera el
atlas MSDF a partir de un `charset` que, sin config explícita, cae al
`DEFAULT_OPTIONS.charset` hardcodeado del paquete:

```
' \tABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?.,;:\'"()-[]{}@#$%&*+=/\\<>'
```

Ni una tilde, ni la Ñ. No importa qué fuente se declare ni de dónde se sirva
— el generador de atlas nunca pide esos glifos, así que nunca existen en la
textura. El archivo `.uikitml` no tiene forma de pasar un `charset` propio
(no está en el schema de `css.js`/`tokens.js`); es una limitación del
formato de autoría, no de una fuente puntual.

**Por qué esto no se arregla para los paneles estáticos ya existentes** (panel
de misión, hints, placas): sin parchear `@drawcall/uikitml` o
`@pmndrs/uikit`, no hay manera de pasarles un charset ampliado vía
`.uikitml`. Siguen sin tildes — ese workaround sigue en pie para ellos, no se
tocó nada de lo existente.

**Cómo se resuelve para el panel de investigación (sí, para este):** ya
necesitaba construirse por código para el scroll (ver más abajo), así que la
lista de mensajes no pasa por `@font-face` de UIKitML — carga la fuente con
`UIKit.TTFLoader` directo (`@iwsdk/core` re-exporta `@pmndrs/uikit` completo
sin recortar, confirmado en `node_modules/@iwsdk/core/dist/index.d.ts`), con
un `charset` propio que agrega el alfabeto español (á é í ó ú ñ Ñ Á É Í Ó Ú
ü Ü ¿ ¡) al set por default. Es una solución real para el texto que este
panel necesita, no evitar tildes de nuevo — pero acotada a este panel; no
es una corrección general del bug.

### Carga de `feed.md`: parseo en runtime, no archivo generado
**Decidido.**
`public/data/feed.md` (movido desde `docs/` — es contenido de la app, no
documentación del proyecto, ver `escena.md`). Un parser chico a mano lee los
bloques `**[tipo]** Fuente` + párrafo — no hace falta una librería de
markdown completa para un formato tan regular. Se evaluó un script generador
tipo `scripts/generate-audio.mjs` emitiendo un `.uikitml` o un `.json`
armado de antemano, y se descartó: un `.uikitml` generado contradice la
regla del proyecto de que ese archivo es la fuente de verdad; un `.json`
generado agrega un paso de regeneración que alguien puede olvidar después de
editar el `.md`. Parseando en vivo, `feed.md` es la única fuente — se edita
y el panel lo refleja solo.

### Scroll: no existe en el markup de UIKitML, se construye por código
**Decidido.**
Revisado el schema de `@drawcall/uikitml` (`css.js`, `tokens.js`,
`component-sets.js`): `overflow` no aparece en ningún lado, el parser no lo
reconoce como propiedad. La librería de base, `@pmndrs/uikit`, sí soporta
`Container({ overflow: 'scroll' })` (confirmado en
`node_modules/@pmndrs/uikit/dist/components/container.d.ts`) — la capacidad
existe, el formato de archivo no la expone.

**Cómo queda:** el marco del panel (fondo, borde, header) se autora en
`.uikitml` como siempre. La lista de mensajes, que además ya tenía que ser
código por el parseo de `feed.md`, se construye con `UIKit.Container({
overflow: 'scroll' })` más un `UIKit.Text` por mensaje, montada dentro de un
slot del documento cargado — mismo principio que `ValveSystem` ya usa para
inyectar el texto de estado con `setProperties`, extendido de "una string" a
"un subárbol de elementos". Input de scroll: thumbstick derecho (eje
vertical) — X e Y de botón ya están tomados (hints/transparencia), el
trigger es para interactuar con válvulas.

### Los tres tipos de mensaje se distinguen por posición y acento, no por escala
**Decidido, corrección del usuario.**
Primera propuesta: `[acotacion]` más chica que `[fuente]`. El usuario la
rechazó — una acotación limita lo que afirma la fuente anterior, achicarla
comunica lo contrario (que pesa menos, no que matiza). Los tres tipos van al
mismo `font-size` de cuerpo; lo que los distingue es la barra lateral de
acento (color por tipo) y la posición/indentación, no el tamaño de letra.
`[correccion-propia]` lleva el acento más notorio de los tres — es el tipo
que más le importa al proyecto que salte a la vista.

### Ancho, font-size y tope de caracteres: provisorios
**Provisorio — no decisión de diseño.**
`width`, `font-size` del cuerpo y el tope blando de ~240 caracteres por
burbuja son elección de esta ronda, sin medir contra una captura ni contra
visor real todavía — mismo tratamiento que los números del desvío. Se
ajustan cuando haya una captura para mirar.

### El diseño visual es temporario
**Anotado por el usuario, no una decisión de esta ronda.**
El usuario va a mandar un kit de UI propio más adelante y ahí se revisa
también cómo se accede a esta UX (el reloj es la solución de esta ronda, no
necesariamente la final). Lo que se construye ahora — colores, layout,
disparador de muñeca — es funcional, no final. No vale la pena pulir estética
hasta que llegue ese kit.

### Implementado — verificado por consola y ECS, no en visor
**Implementado.**
`Watch` (componente marca, vacío, mismo rol que `Valve` para su query),
`watch.scene-asset.ts` (esfera achatada + "pantalla" cian, placeholder),
`feed-system.ts` (parser de `feed.md`, carga de fuente con charset propio,
árbol `UIKit.Container`/`Text` construido por código, panel posicionado al
abrir — no siguiendo al jugador — con billboard de yaw igual al de
`ValveSystem`).

**Encontrado al probar el charset ampliado — el em dash faltaba.**
Al recargar el runtime apareció `"Missing glyph info for character —"` — el
mismo bug, pero para la raya (—) de `feed.md` ("vmos.ar — sitio oficial") y
del prefijo `CORRECCIÓN — ` que agrega el código. No es un carácter español,
así que no estaba en el charset ampliado del principio de esta sección.
Se listaron con un script todos los codepoints de `feed.md` fuera del
charset base (no se adivinó) y se agregó el que faltaba. Confirmado sin ese
warning tras recargar.

**Verificado:** `tsc --noEmit` limpio; la entidad `Watch` existe con
`RayInteractable` (`ecs find`); el documento del panel existe como entidad
propia; sin errores en consola del runtime tras recargar varias veces.
**No verificado:** que el reloj responda al ray+trigger, que el panel se
posicione bien frente al jugador real, que el scroll con el stick derecho
funcione, ni legibilidad en visor — nada de esto se puede probar sin
manos/cabeza reales o una sesión XR emulada más involucrada que un
screenshot. Mismo estado que el resto de lo agregado hoy: estructuralmente
sano, sin confirmar en uso.

**Nota aparte, no tocada:** al abrir la escena en el editor para estas
pruebas, el nodo `ground` apareció con `"scale": [1, 1, 3.1304]` que nadie
pidió — no lo revertí porque no sé si fue un ajuste automático del editor
o algo previo sin loggear; el usuario decide si vuelve a 1.

---

### La rama no era perpendicular: 90° nominal, 175° real
**Hallazgo del usuario con captura, corregido.**
La rama a `HV-4003` se había reubicado (ver "HV-4003 quedaba tapado desde el
spawn") priorizando despejar la línea de vista desde el spawn, sin volver a
chequear el ángulo contra el caño principal. Resultado: la dirección elegida
(normalize(-6,3)) quedaba a ~175° del tramo TK404→exportación, casi
exactamente opuesta — visualmente un solo caño con un quiebre chico, no una
Y. Desde una vista cenital (la del usuario) se leía como que el tramo largo
seguía uniendo TK404 con TK401, aunque el mesh nunca llega más allá de
x=5 (TK401 está en x=71).

**Corregido:** la rama vuelve a `θ_spur - 90°`, la opción que se había
descartado en el primer intento por creer que apuntaba "hacia el spawn" —
error de esa sesión: esa evaluación usaba la posición vieja del spawn
(`z=+6`), no la actual (`z=-18`). Con el spawn donde está ahora, esta
dirección se aleja de él (hacia +Z, hacia la fila de tanques), así que
resuelve la Y **y** evita la oclusión al mismo tiempo — no hacía falta el
ángulo forzado de la vez pasada. Verificado con una vista cenital ajustada
cerca del manifold (temporal, borrada después): la bifurcación se lee clara,
90° reales.

**Recalculado con esto:** `pipe-branch`, `valve-secondary` (nameplate
incluida, misma regla de "al costado, perpendicular al propio caño" que ya
usaba), `pipe-secondary-stub`, `pipe-secondary-endcap`. `HV-4001`/`HV-4002`
no se tocaron.

---

### El corredor no tiene margen para centrar, hay que achicar
**Hallazgo del usuario, medido antes de tocar nada.**
El usuario reportó el playón "pegado" a la berma de TK404 — razón de dominio,
no estética: el recinto de contención existe para contener un derrame, y
poner el área de trabajo justo en su límite compromete ese propósito. Pidió
más separación sin inventar un número "correcto".

**Medido, no estimado a ojo:** render ortográfico preciso centrado en el
borde del recinto. Cara exterior de la berma de TK404 en x=-15, esquina más
cercana del playón (rotado, `APRON_SIZE=10` de entonces) en x=-6,5 →
**8,5 m reales**, no cero. La captura del usuario en perspectiva exageraba la
cercanía.

**El primer plan (centrar el conjunto) resultó ser un no-op, encontrado a
tiempo:** el playón es un cuadrado rotado centrado en el cabezal — sus
esquinas son simétricas por construcción. El cabezal ya está en x=0, el
centro exacto del corredor de 30 m (fijado por la separación real entre
tanques, ya una decisión previa). No había 0,7 m para ganar centrando; ya
estaba centrado. La única palanca real dentro de un corredor de ancho fijo es
reducir el propio footprint del conjunto.

**Aplicado:** `APRON_SIZE` de `manifold-pad.scene-asset.ts` baja de 10 a 8 m.
Nueva separación: **9,8 m** de cada lado (antes 8,5 m) — ganancia real de
1,3 m, simétrica. Si hace falta más, las palancas que quedan son mayores:
achicar más el footprint operativo (soportes, radio de la T) o revisar el
setback recinto-tanque (15 m) o la separación entre tanques, ambas ya
decisiones previas con su propia justificación — no se tocan sin pedido
explícito.

---

### TK401: de destino del grafo a escenografía
**Decisión de una sesión anterior, recién registrada ahora — el usuario
notó que no estaba anotada.**
Cuando existía una sola válvula conectando `tk404` directo con `tk401`
(antes del desvío), `tk401` era el destino del grafo — agregarle una línea
propia habría sido agregar un elemento que participa de la mecánica antes de
tenerla resuelta, y por eso `escena.md` §5 ("no agregar tanques hasta que el
manifold y las válvulas estén resueltos") aplicaba para posponer su línea.

El desvío sacó a `tk401` del grafo activo — pasa a ser sólo escenografía,
igual que el domo o la escalera de TK404, sin arista ni válvula propia. Esa
reclasificación pasó en el momento pero nunca se escribió como decisión; la
brecha siguió documentada con la razón vieja ("se resuelve cuando le toque
su fase") que ya no describía la situación real.

**Corregido:** `escena.md` §5 distingue ahora "elementos que participan del
grafo" (siguen esperando) de "geometría decorativa de lo ya modelado" (no
espera si su ausencia contradice una regla ya verificada — acá, §1: "cada
tanque tiene una línea propia").

**Implementado con esa regla:** línea decorativa de TK401 (pared en x=30,
z=0) hasta una brida ciega cerca del sector de manifold, `pipe-tk401-line` +
`pipe-tk401-endcap` — sin `Valve`, sin arista, no participa del grafo. Punto
de llegada elegido para leerse "cerca del manifold, sin conectar" — pasa
junto al playón sin tocarlo (justo afuera de sus esquinas, ya achicado por
la entrada anterior) y termina en una brida, no en la T. Placeholder de
puesta en escena, no una medida; ver `desiciones_diseño.md` por el criterio
ya establecido de "no inventar dimensiones donde no hay dato" — acá no hay
dato porque la línea misma es una simplificación (§2, "cantidad de
elementos" del proyecto no modela el ruteo real completo).

**Corregido — la brida quedaba corta, no llegaba al sector de ruteo.** El
primer punto de llegada (elegido solo para no cruzar el playón) terminaba en
el aire, a mitad de camino del manifold — la misma clase de ficción que este
paso venía a evitar, solo que a medio resolver. Recalculado para terminar
justo afuera de la esquina este del playón (~1,3 m de margen, no lo toca ni
se une a la línea de TK404) en vez de a 9 m de distancia. Ver "Ningún
elemento termina en el aire" más abajo — es la regla general de la que esto
fue el primer incumplimiento.

**De paso:** la casilla (`manifold-shed`) pisaba el trazado nuevo de esta
línea. Placeholder de escala humana, sin función — se reubica a
`(-3, 0, -17)`, despejada de la línea de TK401 y del resto del manifold, sin
otro criterio que no estorbar.

---

### Ningún elemento termina en el aire
**Decidido.**
Toda línea modelada llega a algo: un tanque, el cabezal del manifold, o
una brida ciega que declara que la línea continúa fuera de escena.

**Por qué:** un caño que corta en el vacío es una ficción visible, del
mismo tipo que el caño tanque-a-tanque que este paso vino a corregir.
Si un tramo no puede terminar en algo, no se modela.

---

### El reloj no seguía la mano — bug real, no de posición
**Hallazgo del usuario ("no hay tal reloj"), encontrado y corregido con
`ecs query`, no a ojo.**
El reloj existía (confirmado con `ecs find`) pero `ecs query` mostró su
`Transform.position` en `[0,0,0]` — el origen de la escena, lejísimos del
spawn actual (`z=-18`). La entidad ni siquiera tenía el componente
`Follower` en su lista de componentes.

**Causa:** `entity.setValue(Follower, 'target', ...)` /
`entity.getVectorView(Follower, 'offsetPosition')` sobre un componente que
la entidad todavía no tiene son un **no-op silencioso** — no lo agregan
implícitamente, a diferencia de lo que ese patrón (copiado de
`ControllerHintSystem`, ya existente en el proyecto) parecía sugerir. Sin
error en consola, sin fallar el build: la entidad simplemente se queda sin
el componente y `FollowSystem` (que sí está registrado por defecto — se
confirmó en `node_modules/@iwsdk/core`, no se asumió) nunca la toca.

**Mismo bug encontrado en `ControllerHintSystem`,** que usaba idéntico
patrón para el panel de controles en la muñeca — nunca siguió la mano en
ningún momento de este proyecto. Probablemente pasó desapercibido porque en
layouts viejos de la escena el origen quedaba cerca de donde importaba;
dejó de disimularse en cuanto el spawn se alejó a `z=-18`.

**Corregido en los dos:** `entity.addComponent(Follower, { target,
offsetPosition, behavior })` con el objeto completo, en vez de
`setValue`/`getVectorView` encadenados. Verificado con `ecs query` después
del fix — `Follower` aparece en la lista de componentes y
`Transform.position` coincide con el grip del jugador, no con el origen.

**Alcance de la revisión:** se buscó `setValue(Follower` en todo `src/` —
solo esos dos casos. No se auditaron otros componentes por el mismo patrón
(`RayInteractable`, `Ghostable`, etc. se agregan con `addComponent` en todo
el proyecto, así que no aplica), pero si aparece una entidad "creada por
código que no hace lo que su primer `setValue` dice", este es el primer
sospechoso.

