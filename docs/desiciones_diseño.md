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

---
 
## Representación
 
### Sin vista 2D acompañante
**Decidido.**
No hay un plano ni un P&ID digital como interfaz principal.
 
**Por qué:** si la respuesta al problema es una vista 2D, no hace falta un visor — alcanza con una tablet. Todo lo que el proyecto proponga tiene que aprovechar que la persona está adentro del espacio.
 
---
 
### Modo de transparencia
**Implementado — primera pasada.**
Los tanques pasan a semitransparentes conservando el borde, para poder ver la
ruta a través de ellos sin abandonar la escala real. Se activa con el botón Y
del control izquierdo.

**Cómo quedó:** cuerpo del tanque a opacity 0.16 (alpha real, no wireframe),
más un contorno (`EdgesGeometry`, solo los cantos de ~40°+, no las costuras
suaves del cilindro) que aparece cuando el cuerpo se vuelve transparente. Es
un toggle global — los dos tanques a la vez, on/off — no hay ordenamiento de
transparencias complejo porque son dos sólidos convexos que no se
interpenetran.

**Riesgo identificado (sigue abierto):** si todo se vuelve transparente se
pierde la oclusión, y con ella la percepción de profundidad. Todo flota a la
misma distancia. **No implementado todavía:** transparentar solo lo que está
entre el observador y el objetivo — esta primera pasada es global, las dos
mitigaciones más finas (parcial, modal/momentáneo en vez de toggle
persistente) siguen sin probar.

**Riesgo técnico:** con solo dos sólidos no debería notarse, pero no se pudo
verificar framerate real en visor desde este entorno — sin acceso a un
navegador de visor conectado.

**A responder con la prueba:** ¿a escala real alcanza la transparencia para
seguir la ruta, o se pierde igual la referencia? Sigue sin responder — hace
falta probarlo puesto.

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
**Abierto.**
Hoy está en `ScreenSpace`: pegado a la vista, tipo HUD, sigue al observador.
 
**La decisión de fondo:** ¿la información está pegada al operador, o vive en
la instalación? Son dos posturas distintas y probar las dos es contenido del
proyecto. Está así por conveniencia de debug, no por decisión.

**Desición por escalada:** el HUD entró por conveniencia y la evidencia que lo motivó es un hallazgo, no un problema resuelto. la ilegibilidad a distancia era información valiosa. Es la demostración física de tu problema central: el estado de la ruta no es visible desde donde está parado el operador. El agente lo resolvió antes de que fuera una desición de diseño real. Punto a resolver más adelante.
 
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
 