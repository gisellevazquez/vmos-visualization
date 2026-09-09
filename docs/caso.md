# Caso

## Qué es VMOS
Oleoducto de 437 km y 30" desde Allen (Río Negro) hasta la
terminal de exportación de Punta Colorada, con estaciones de
bombeo intermedias, playa de seis tanques de 82 m de diámetro,
y carga a buque por monoboyas offshore. En construcción;
exportación prevista para fines de 2026.
Es transporte y almacenamiento. No hay pozos ni perforación.

## Qué momento estoy construyendo
El operador debe habilitar el camino de crudo desde el tanque 3 hacia la línea de despacho, verificando la posición de las válvulas de la ruta. Una válvula mal posicionada envía el crudo a donde no debe, o lo deja sin salida.

El recorte de experiencia:

Seis válvulas. Una ruta: tanque origen, tramo de cañería, destino. De esas seis, tres tienen que quedar abiertas, dos cerradas, y una es la trampa — la que si dejás mal, el crudo va al lugar equivocado.

La geometría es más barata de lo que pensás. Un caño es un cilindro. Una válvula es una caja con una manija. Un tanque es un cilindro grande. Toda la escena son primitivas. No necesitás modelar nada.

Lo caro no es la geometría, es el estado. Un lineup es un grafo: nodos conectados por tramos, y cada válvula es una compuerta que habilita o corta un tramo. Necesitás una función que responda "¿existe camino de A a B?". Eso es lógica, no modelado — y encaja perfecto con ECS: cada válvula es una entidad con un componente que dice si está abierta y qué dos nodos conecta, y un sistema recorre el grafo y te dice si la ruta está completa.

## Interfaz 
Vamos a testear el panel de info como ScreenSpace. Eso significa pegado: te movés, el panel te sigue.
Para el caso necesitamos reelevar si "la información está pegada al operador" o "la información vive en la instalación". Son dos posturas de diseño distintas.

## Por qué ese
Porque es donde la decisión depende de cómo está presentada
la información, no de la información en sí. Referencia: NTSB/PAR-12/01, Marshall 2010 — 17 horas de alarmas leídas como otra cosa.

## Para quién
Alguien sin acceso físico a una instalación de este tipo.
No reemplaza formación; reduce el costo del primer contacto con un entorno industrial.

## Qué NO es
No es un producto para VMOS S.A. ni para el IVM.
No es un simulador de operación certificable.
VMOS es el caso de estudio, no el cliente.


## Disclaimer: 

⚠️ Este proyecto es un ejercicio de diseño independiente, sin fines comerciales. No está afiliado, patrocinado ni respaldado por VMOS S.A., YPF S.A., ni ninguna de las empresas del consorcio Vaca Muerta Oil Sur.

El caso de estudio se basa exclusivamente en información de dominio público: comunicados oficiales del proyecto VMOS, publicaciones del Gobierno de Río Negro, y documentación pública de la industria energética. La geometría de las instalaciones fue reconstruida de forma aproximada a partir de dimensiones publicadas en prensa y comunicaciones oficiales, y no representa el diseño real de ingeniería.

Los escenarios operativos y los datos de proceso son simulados con fines ilustrativos y no reflejan procedimientos, parámetros ni sistemas reales de VMOS. Los casos de referencia citados (informe NTSB/PAR-12/01, Enbridge Marshall 2010) corresponden a incidentes documentados públicamente en otras jurisdicciones y se usan únicamente como antecedente de diseño.

El objetivo es explorar aplicaciones de diseño de experiencia inmersiva para fines educativos y de investigación.