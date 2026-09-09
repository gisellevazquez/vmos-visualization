## Día 1 — VMOS PoC
La investigación
## El punto de partida y su problema

Traías un documento con casos de XR en oil & gas — Shell en el Golfo de México, Chevron en El Segundo, gemelos digitales en el Mar del Norte, una plataforma AR/VR para geociencias presentada en SPE Viena — más una tabla de datasets públicos y el argumento de que la interfaz humano-datos es territorio de diseño y no de ingeniería. Ese argumento es correcto y sobrevivió intacto todo el día. Lo que no sobrevivió fue el encuadre.

## Qué es VMOS, en serio

Se verificó contra el sitio oficial del proyecto, YPF Energía Argentina, publicaciones del Gobierno de Río Negro, Global Energy Monitor y presentaciones ante la SEC de Pampa Energía.

Vaca Muerta Oil Sur es infraestructura midstream: un oleoducto de 437 km y 30 pulgadas desde Allen hasta Punta Colorada, en dos tramos (Allen–Chelforó, 110 km; Chelforó–Punta Colorada, 327 km), con estación cabecera en Allen y bombeo en Chelforó y Santa Rosa. En Punta Colorada, seis tanques de 82 m de diámetro y 120.000 m³ cada uno. Carga offshore por dos monoboyas Single Point Mooring conectadas por ductos submarinos, para buques VLCC. Tres mil millones de dólares. Exportación prevista para fines de 2026.

VMOS S.A. es un consorcio de ocho empresas — YPF, Vista, Pampa, Pan American Sur, Pluspetrol, Shell, Chevron y Gas y Petróleo del Neuquén — no una subsidiaria de YPF, que era como lo decía tu descargo original.

Ahí no se perfora nada. Cayó el escenario de detección de kick, que es un evento de perforación, y con él el 3W Dataset de Petrobras, que es data de pozos. Buen dataset, proyecto equivocado.

## El Instituto Vaca Muerta

Se verificó porque ibas a publicar sus números.

Cuatro salas de simuladores con cascos de realidad virtual — confirmado — para perforación, fractura y wireline, más recorridos 3D por locaciones del Upstream. Dos sedes en Neuquén, incluido un pozo escuela en Río Neuquén.

Correcciones: no fueron 17.000 inscriptos sino más de 13.000. No es "2.000 a 3.000 por año" sin más: 672 alumnos en la primera camada, con expectativa de 2.400 capacitados para fin de 2026, según el director ejecutivo de la Fundación YPF.

Y el hallazgo que reencuadró todo: el IVM forma para upstream. Su investigación prospectiva original apuntó a los perfiles que demandaría el upstream de gas y petróleo. Su pozo escuela es un equipo de perforación. No tiene relación operativa con un oleoducto y una terminal.

Pero además exige 85% de presencialidad. Eso, cruzado con 13.000 anotados para 672 lugares, define el hueco: el IVM por diseño no puede alcanzar a la persona que no puede estar ahí. No es una crítica al IVM — es la razón de existir de tu proyecto.

## El antecedente: Marshall, 2010

Este fue el hallazgo del día. NTSB/PAR-12/01, informe público completo.

Un oleoducto de 30 pulgadas — el mismo diámetro que VMOS — se rompió durante las últimas etapas de una parada programada. No se detectó ni se atendió por más de 17 horas, y en ese lapso se bombeó más crudo en dos arranques que representaron el 81% del total derramado. Se generaron alarmas de detección de fugas; el personal las interpretó como separación de columna, un fenómeno normal, aun cuando la zona era relativamente plana.

## El dato estaba. La lectura del dato falló.

El informe incluye una línea de tiempo del evento y un diagrama del personal involucrado en las 17 horas — material directamente utilizable como insumo de diseño. Y un estudio del NTSB de 2005 sobre SCADA en oleoductos de líquidos muestra que no fue un caso aislado: de 13 accidentes analizados entre 1992 y 2004, en diez hubo demora de los operadores de sala en reconocer la fuga.

## Los modos de falla del dominio

Se relevaron para poder elegir escenario con criterio: sobrellenado de tanque (Buncefield 2005, Caribbean Petroleum 2009), golpe de ariete por cierre contra flujo, alineamiento equivocado, y el caso Marshall. De ahí salieron los cuatro momentos operativos candidatos.

## Los modelos

NORA quedó restringido en Zenodo, y además es una maqueta de piping de 15 × 7,5 × 5 m, no una terminal. Tampoco aparecieron modelos abiertos de playas de tanques con licencia usable.

De ahí salió la decisión que resolvió el problema: una playa de tanques es geometría trivial. Son cilindros de dimensiones publicadas. Construirla paramétricamente es más honesto que usar una planta brasileña de doble, más liviano para el navegador del visor, y es VMOS de verdad.

Quedaron dos discrepancias documentadas: altura de tanques 35 m contra 38 m, y distancia de monoboyas 4–7 km contra 15 km, según fuente. Y una advertencia: la descripción de tanques "de aluminio" probablemente se refiere al techo flotante, no a la estructura.

## Lo que no se consiguió

El Estudio de Impacto Ambiental de VMOS y su Adenda. Existe, fue aprobado, y la Secretaría de Ambiente de Río Negro lo usa como referencia de fiscalización. No está en abierto. Vía posible: pedido de acceso a información pública a la provincia.

## Lo que se construyó

Proyecto IWSDK levantado en VS Code con Claude Code conectado por MCP. Escena propia separada del scaffold. Dos tanques a escala real unidos por caño y válvula operable: al apuntarla, el estado de la ruta cambia entre completo e incompleto. Piso caminable de 320 × 100 m. Modo de transparencia y panel de descubribilidad en curso.

La mecánica está modelada como grafo desde el primer día — cada válvula es una arista que declara qué nodos conecta — para que pasar de una válvula a seis sea agregar datos, no reescribir código.

## El material

docs/contexto.md con el contexto verificado y las fuentes. docs/caso.md con el momento operativo. docs/decisiones.md con cada decisión, su razón y lo descartado. Y el descargo corregido.

## Lo abierto

La maqueta en la muñeca, con su problema ya identificado: a 1:500 los tanques quedan bien y las válvulas quedan de 2 milímetros, así que hay que diseñar una notación en vez de copiar el mundo. La divergencia entre lo real y lo reportado, que es el final del proyecto. Y el panel de estado, que hoy es un HUD por conveniencia y no por decisión.