---
title: "Análisis de Pareto para pymes: el 20% de productos que genera el 80% de tus ventas"
description: "Qué es el análisis de Pareto y la clasificación ABC, cómo hacerlo paso a paso con tus ventas y qué decidir con cada clase, aplicado a una tienda de mascotas independiente con 120 productos."
seoTitle: "Análisis de Pareto (ABC) para pymes: ejemplo práctico"
seoDescription: "Aprende a hacer un análisis de Pareto y una clasificación ABC de tus productos, con el ejemplo de una tienda de mascotas y qué decidir con cada clase."
sources:
  - sba2026
  - sbcs2026
cta:
  title: "¿Sabes cuáles son tus productos A?"
  text: "Tomamos tus ventas de los últimos 12 meses, armamos tu clasificación ABC con margen incluido y te decimos qué hacer con cada clase."
  button: "Agenda tu consultoría gratis"
---

Si tienes un negocio con muchos productos, seguramente sientes que todos importan. Cada uno ocupa espacio, se pide al proveedor, se cuenta en el inventario y se cobra en caja. Pero no todos aportan lo mismo. Casi siempre, unos pocos productos sostienen el negocio y la mayoría vende muy poco.

El análisis de Pareto te dice exactamente cuáles son unos y otros. Es el primero de nuestra serie de análisis de inteligencia de negocios para pequeñas empresas, porque es el más fácil de hacer, se arma con los datos que ya tienes en tu punto de venta y da resultados que puedes usar la misma semana.

En este artículo lo aplicamos a uno de los negocios más comunes en cualquier ciudad de Estados Unidos: una tienda de mascotas independiente.

## Qué es el análisis de Pareto

El análisis de Pareto ordena tus productos de mayor a menor según lo que venden y mide qué porcentaje del total acumulan. Lleva el nombre del economista Vilfredo Pareto, que notó que la riqueza se concentraba en pocas manos. Con el tiempo esa idea se volvió la famosa regla del 80/20: una pequeña parte de las causas explica la mayor parte de los resultados.

En un negocio se ve así: alrededor del 20% de tus productos suele generar cerca del 80% de tus ventas. No es una ley exacta. En tu caso puede ser 15/70 o 30/85. Lo importante no es el número redondo, sino descubrir que la concentración existe y cuáles son los productos que la forman.

La **clasificación ABC** lleva el análisis un paso más allá y pone a cada producto en una de tres clases:

- **Clase A:** los productos que suman el primer 80% de las ventas. Son pocos y son los que sostienen el negocio.
- **Clase B:** los que llevan el acumulado del 80% al 95%. Venden de forma regular, sin ser protagonistas.
- **Clase C:** el último 5% de las ventas. Suelen ser la mayoría de los productos.

Los cortes de 80% y 95% son los más usados, pero puedes moverlos. Lo que no cambia es la lógica: tratar igual a todos tus productos es la forma más cara de manejar un negocio.

## Por qué vale la pena hacerlo ahora

Las pequeñas empresas son la mayor parte de la economía de Estados Unidos. La Oficina de Defensa de la Administración de Pequeñas Empresas (SBA) cuenta 36.207.130 pequeñas empresas en el país, que emplean al 45,9% de los trabajadores del sector privado. Y la mayoría trabaja con márgenes ajustados.

En la encuesta de crédito a pequeñas empresas de los bancos de la Reserva Federal, el 73% de las empresas con empleados reportó el aumento de costos como una dificultad financiera, y el 57% dijo que le costaba llegar a clientes y hacer crecer sus ventas. Cuando los costos suben, cada dólar que tienes parado en inventario que no se mueve pesa más. Y cuando vender cuesta, conviene saber qué productos traen a los clientes por la puerta.

El análisis de Pareto responde las dos preguntas con una sola tabla.

## La tienda del ejemplo

Imagina una tienda de mascotas independiente, con un solo local, que vende unos US$780.000 al año. Tiene 120 productos en su catálogo, repartidos en diez categorías: comida para perros, comida para gatos, arena para gatos, salud y antipulgas, premios, acuario, aseo, animales pequeños, camas y accesorios, y juguetes.

El dueño siente que la tienda está llena de cosas y que nunca hay dinero para reponer lo que de verdad se vende. Quiere saber qué productos proteger, cuáles empujar y cuáles dejar de pedir.

Los datos son ilustrativos, pero el patrón es el que vemos una y otra vez en comercios minoristas.

## Cómo hacer el análisis paso a paso

No necesitas software especial. Con Excel o Google Sheets alcanza para empezar.

1. **Exporta tus ventas por producto** de los últimos 12 meses desde tu punto de venta o sistema de facturación. Usa 12 meses para no confundirte con la temporada.
2. **Ordena de mayor a menor** por ventas en dólares.
3. **Calcula la participación** de cada producto: sus ventas divididas entre el total.
4. **Calcula el acumulado**: la participación del producto más la de todos los que están encima de él.
5. **Asigna la clase**: A si el acumulado antes del producto está por debajo de 80%, B si está por debajo de 95% y C para el resto.
6. **Agrega el margen bruto** de cada producto. Este paso es opcional, pero es el que convierte una lista de ventas en decisiones.

Para la tienda armamos el análisis en Python, con gráficos en matplotlib. La lógica es la misma de la hoja de cálculo, solo que automatizada.

¿Quieres ver el tuyo? Envíanos tus ventas por producto de los últimos 12 meses, en Excel o CSV, tal como salen de tu punto de venta. Preparamos tu clasificación ABC con estos mismos gráficos y te la enviamos a tu correo, gratis.

::analysis-request

## Lo que encontró la tienda

El resultado fue casi de libro: 24 productos, el 20% del catálogo, generan el 80% de las ventas. Y 22 de esos 24 son comida y arena para perros y gatos.

![Curva de Pareto de la tienda de mascotas: el porcentaje acumulado de ventas sube rápido con los primeros productos y se aplana después; el 20% de los productos, la clase A, suma el 80% de las ventas, la clase B llega al 95% con el 49% de los productos y la clase C forma la mitad restante del catálogo](/images/blog/pareto-analysis-small-business/curva-pareto-tienda-mascotas.svg "Datos ilustrativos. La línea punteada muestra cómo sería la curva si todos los productos vendieran lo mismo.")

La curva lo dice todo: sube casi vertical con los primeros productos y después se aplana. Si todos los productos vendieran igual, la curva sería la línea diagonal. Cuanto más se separa de ella, más concentrado está tu negocio.

Luego miramos cuánto pesa cada clase, no solo en ventas, sino también en ganancia bruta.

![Barras apiladas del peso de cada clase: la clase A es el 20% de los productos, el 80% de las ventas y el 73% de la ganancia bruta; la clase B es el 29% de los productos, el 15% de las ventas y el 19% de la ganancia; la clase C es el 51% de los productos, el 5% de las ventas y el 9% de la ganancia](/images/blog/pareto-analysis-small-business/peso-clases-abc.svg "Datos ilustrativos. La mitad del catálogo aporta el 5% de las ventas.")

Tres hallazgos saltan a la vista:

- **La mitad del catálogo vende casi nada.** Los 61 productos de la clase C suman apenas el 5% de las ventas, unos US$38.000 al año. Y 27 de ellos venden menos de US$500 al año cada uno.
- **Los productos A venden mucho pero dejan poco por dólar.** Su margen bruto es de 24%, contra 27% del promedio de la tienda. Aun así aportan el 73% de la ganancia bruta, porque el volumen manda.
- **El margen alto está escondido en las clases B y C.** Los premios para mascotas tienen un margen cercano al 51%, más del doble que la comida, y la mayoría está en la clase B.

El último gráfico cruza las ventas con el margen de cada producto y lo divide en cuatro zonas de decisión.

![Gráfico de dispersión de ventas anuales contra margen bruto de los 120 productos: los productos A están a la derecha con márgenes de entre 20% y 27%, salvo dos por encima de 39%; muchos productos B y C están a la izquierda con márgenes de entre 40% y 61%; las cuatro zonas son estrellas, imanes de tráfico, oportunidad y revisar o eliminar](/images/blog/pareto-analysis-small-business/ventas-vs-margen-productos.svg "Datos ilustrativos. Cada punto es un producto; la línea vertical marca el inicio de la clase A.")

## Qué hacer con cada clase

Aquí está el valor del análisis. Cada clase pide un trato distinto.

### Clase A: que nunca falten

Son los **imanes de tráfico**: el cliente entra por la bolsa de comida de su perro, y si no la encuentra se va a otra tienda o a internet, y quizás no vuelve. Para la tienda del ejemplo, la decisión fue:

- Contar el inventario de estos 24 productos cada semana, no cada mes.
- Fijar un mínimo de reposición para cada uno y no bajarlo nunca, aunque el dinero esté justo.
- Negociar con los proveedores de comida mejores precios o plazos de pago. Con el 80% de las ventas concentrado ahí, un punto de margen vale más que en cualquier otro lugar.

Los dos productos A con margen alto, un premio y un antipulgas, son las **estrellas**: merecen el mejor lugar de la tienda.

### Clase B: la oportunidad de margen

Aquí está el dinero que la tienda no estaba viendo. Los premios de la clase B tienen buen margen y ya tienen demanda. La tienda decidió ponerlos junto a la caja y junto a la comida, y entrenar al personal para sugerirlos. Si cada cliente que compra comida se lleva también un premio, el margen total de la tienda sube sin vender un solo producto nuevo.

### Clase C: revisar uno por uno

La clase C no se elimina completa. Se revisa. La tienda separó sus 61 productos C en tres grupos:

- **Liquidar y no volver a pedir:** los productos que venden menos de US$500 al año y no tienen una razón para estar.
- **Pedir solo por encargo:** productos que algunos clientes fieles necesitan, como ciertos artículos de acuario.
- **Mantener a propósito:** productos que venden poco solos pero completan la compra de un cliente A. Una tienda de mascotas sin juguetes se siente incompleta, aunque los juguetes vendan poco.

El dinero que se libera con la clase C va directo a que nunca falte un producto A.

## Errores comunes

- **Mirar solo las ventas.** Sin el margen, la clase A parece la mejor de todas y la clase B parece secundaria. En la tienda, la mejor oportunidad estaba justo en la B.
- **Usar un período muy corto.** Un mes de diciembre o una semana de promoción distorsiona todo. Usa 12 meses y repite el análisis cada trimestre.
- **Eliminar productos nuevos.** Un producto que lleva dos meses en la tienda siempre va a parecer clase C. Dale tiempo antes de juzgarlo.
- **Eliminar sin mirar qué se compra junto.** Un producto C que siempre va en la misma bolsa que un producto A puede ser más importante de lo que parece. Eso lo responde el análisis de canasta de mercado, que explicamos en nuestro artículo de [machine learning para pymes](/es/blog/machine-learning-small-business/).

## Qué viene en la serie

El análisis de Pareto ordena tus productos. El siguiente paso es ordenar a tus clientes: el [análisis RFM](/es/blog/rfm-analysis-small-business/) aplica una lógica parecida para descubrir quiénes compran más seguido, quiénes gastan más y quiénes están dejando de venir. Es el siguiente artículo de esta serie sobre inteligencia de negocios para pequeñas empresas.

Si todavía no tienes tus datos ordenados en un solo lugar, empieza por nuestra [guía de inteligencia de negocios para pymes](/es/blog/business-intelligence-small-business/).

## Tu siguiente paso

Exporta hoy tus ventas por producto de los últimos 12 meses, ordénalas de mayor a menor y calcula el acumulado. En menos de una hora vas a saber cuáles son tus productos A.

Si quieres ir más allá, con margen incluido, actualización automática y un tablero que tu equipo pueda revisar cada semana, en ShineTechData lo armamos contigo. Conoce nuestro servicio de [análisis de datos](/es/services/data-analysis/).
