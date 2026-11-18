---
title: "Cómo hacer un dashboard en Excel que se actualice solo (y cuándo pasar a Power BI)"
description: "Deja de armar el mismo reporte cada lunes. Te explicamos paso a paso cómo montar un dashboard en Excel que se actualiza solo, y las señales de que llegó el momento de pasar a Power BI."
seoTitle: "Dashboard en Excel que se actualiza solo: paso a paso"
seoDescription: "Arma un dashboard en Excel que se actualiza solo con tablas, Power Query y tablas dinámicas, y conoce las señales de que es hora de pasar a Power BI."
sources:
  - excelRefresh
  - powerBiPricing
cta:
  title: "¿Cansado de armar el mismo reporte cada semana?"
  text: "Conectamos tus datos, construimos un tablero que se actualiza solo y te ayudamos a decidir si Excel te alcanza o ya es hora de Power BI."
  button: "Agenda tu consultoría gratis"
---

En la mayoría de las pequeñas empresas el primer dashboard vive en Excel, y está bien que así sea. El problema empieza cuando alguien pasa cada lunes en la mañana copiando las ventas de la semana al archivo, arreglando fórmulas y revisando que los gráficos tomen las filas nuevas.

La solución no son más fórmulas. Es una estructura donde los datos crudos entran por una sola puerta y todo lo demás se actualiza a partir de ellos. Esta guía, pensada para dueños y gerentes de pymes, incluidas las empresas hispanas en Estados Unidos, te muestra cómo armarla en Excel paso a paso y cómo saber cuándo Excel ya cumplió y toca pasar a Power BI.

## Por qué los dashboards en Excel dejan de actualizarse

- **Datos pegados a mano** encima de los de la semana pasada, a veces con las columnas en otro orden.
- **Fórmulas con rangos fijos** como A2:A500 que se saltan la fila 501 sin avisar.
- **Gráficos hechos sobre copias** de los datos y no sobre los datos mismos.
- **Tablas dinámicas que nadie actualiza**, así que siguen mostrando números viejos.

Las cuatro tienen la misma causa: los datos, los cálculos y el dashboard están mezclados.

## La estructura: tres capas

![Dashboard en Excel en tres capas: una hoja de Datos con una tabla, una de Cálculos con tablas dinámicas y una de Dashboard con gráficos](/images/blog/excel-dashboard-auto-refresh-power-bi/dashboard-excel-tres-capas.svg "Los datos entran en una hoja; todo lo demás lee de ella.")

1. **Datos:** solo datos crudos, con formato de tabla de Excel. Aquí nadie escribe ni calcula.
2. **Cálculos:** tablas dinámicas y fórmulas que leen de esa tabla por su nombre.
3. **Dashboard:** gráficos, números clave y segmentaciones. Es la única hoja que la mayoría abre.

## Paso a paso

1. **Trae los datos con Power Query en vez de copiar y pegar.** En Datos > Obtener datos, conéctate a tu exportación en CSV, a una carpeta de archivos, a una base de datos o a un archivo en OneDrive o SharePoint. Power Query guarda cada paso de limpieza (quitar columnas, corregir fechas, filtrar filas) y lo repite cada vez que actualizas.
2. **Cárgalos como tabla.** Las tablas de Excel crecen cuando llegan filas nuevas, y las fórmulas, tablas dinámicas y gráficos que apuntan a la tabla incluyen esas filas solos. Si todavía no usas Power Query, selecciona los datos y presiona Ctrl+T.
3. **Crea tablas y gráficos dinámicos a partir de la tabla.** Ventas por mes, por producto y por vendedor cubren la mayoría de los primeros dashboards. Agrega segmentaciones por fecha y producto para que la gente filtre sin tocar fórmulas.
4. **Pon los números clave arriba.** Ventas totales, ticket promedio y variación contra el mes pasado, con fórmulas que usan el nombre de la columna (por ejemplo, `=SUMA(Ventas[Monto])`) en vez de un rango de celdas.
5. **Activa la actualización automática.** Ve a Datos > Consultas y conexiones, abre la pestaña Conexiones, haz clic derecho en la consulta y elige Propiedades. En la pestaña Uso, marca **Actualizar al abrir el archivo** y, si el archivo pasa abierto durante el día, **Actualizar cada** con la cantidad de minutos. Para actualizar todo a mano, presiona Ctrl+Alt+F5 (Actualizar todo).

Dos detalles que conviene saber: estas opciones funcionan en Excel de escritorio mientras el libro está abierto, así que un archivo que nadie abre no se actualiza. Y si Excel tiene deshabilitados los datos externos en una computadora, hay que habilitar las conexiones desde la barra del Centro de confianza o guardar el archivo en una ubicación de confianza.

## Señales de que Excel ya no te alcanza

![Lista que compara cuándo mantener en Excel el dashboard de una pyme y cuándo pasarlo a Power BI](/images/blog/excel-dashboard-auto-refresh-power-bi/excel-vs-power-bi-cuando-cambiar.svg)

- **Varias personas necesitan los mismos números** y se pasan el archivo por correo preguntando cuál es la versión buena.
- **Combinas tres fuentes o más** cada vez: el sistema de ventas, la contabilidad y la publicidad, por ejemplo.
- **El archivo se puso lento** y tarda minutos en abrir o actualizar.
- **El reporte tiene que actualizarse a una hora fija**, aunque nadie lo abra.
- **Cada persona debe ver solo lo suyo**, como cada vendedor viendo solo sus clientes.
- **La gente lo quiere ver en el celular.**

Si te identificas con dos o más, Excel ya cumplió su trabajo.

## Qué agrega Power BI y cuánto cuesta

- **Power BI Desktop se descarga gratis** para crear reportes. Con una cuenta gratis puedes crearlos, pero para compartirlos necesitas una licencia de pago.
- **Power BI Pro cuesta $14 por usuario al mes** con pago anual, y permite publicar y compartir reportes. Los conjuntos de datos en Pro pueden actualizarse de forma programada hasta 8 veces al día.
- **Premium Per User cuesta $24 por usuario al mes** con pago anual, con hasta 48 actualizaciones al día y modelos más grandes.
- **Cada persona que ve los reportes compartidos necesita licencia**, salvo que la empresa compre un plan de capacidad grande. Para un equipo de cinco, Pro sale en unos $70 al mes.

La buena noticia: Power BI limpia los datos con el mismo Power Query que aprendiste en Excel, así que el trabajo del paso 1 no se pierde.

## ¿Excel o Power BI?

Quédate en Excel mientras una sola persona sea responsable del reporte, los datos vengan de una o dos fuentes y te baste con actualizar al abrir el archivo. Pasa a Power BI cuando el dashboard se convierta en una herramienta compartida del equipo. En los dos casos, la estructura importa más que la herramienta: datos limpios en un solo lugar, cálculos que leen de ellos y un dashboard donde nadie escribe a mano.

Si apenas estás empezando con los indicadores, nuestra [guía práctica de inteligencia de negocios para pymes](/es/blog/business-intelligence-small-business/) te ayuda a elegir qué medir primero.
