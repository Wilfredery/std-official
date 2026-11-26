---
title: "Análisis RFM para pymes: descubre qué clientes cuidar, cuáles recuperar y cuáles dejar ir"
description: "Qué es el análisis RFM (recencia, frecuencia y monto), cómo calcularlo paso a paso en Excel con el historial de tus clientes y qué hacer con cada segmento, aplicado a un salón de belleza independiente con 840 clientes."
seoTitle: "Análisis RFM para pymes: ejemplo práctico paso a paso"
seoDescription: "Aprende a segmentar a tus clientes con el análisis RFM en Excel, con el ejemplo de un salón de belleza y qué hacer con cada segmento."
sources:
  - sbcs2026
  - blsBarbers2026
cta:
  title: "¿Sabes cuáles de tus clientes están dejando de venir?"
  text: "Tomamos el historial de ventas o citas de tus clientes, armamos tu segmentación RFM y te decimos a quién llamar primero."
  button: "Agenda tu consultoría gratis"
---

Todo negocio tiene clientes que vienen cada mes, clientes que vinieron una vez y no volvieron, y clientes que antes venían seguido y hace tiempo que no aparecen. El problema es que, mirando las ventas del mes, no se nota quién es quién. Las ventas pueden verse estables mientras tus mejores clientes se van, uno a uno, a la competencia.

El análisis RFM pone nombre y apellido a cada grupo. Es el segundo de nuestra serie de análisis de inteligencia de negocios para pequeñas empresas. En el [primero, el análisis de Pareto](/es/blog/pareto-analysis-small-business/), ordenamos los productos. Ahora ordenamos a los clientes.

Lo aplicamos a otro negocio que hay en cualquier ciudad de Estados Unidos: un salón de belleza independiente.

## Qué es el análisis RFM

RFM son las iniciales de tres preguntas que puedes hacerle al historial de compras de cada cliente:

- **Recencia (R):** ¿hace cuántos días fue su última compra? Un cliente que vino la semana pasada tiene más probabilidad de volver que uno que no viene desde hace ocho meses.
- **Frecuencia (F):** ¿cuántas veces compró en el período? El que viene seis veces al año ya tiene el hábito.
- **Monto (M):** ¿cuánto gastó en total? No todos los clientes frecuentes gastan lo mismo.

A cada cliente se le da una nota del 1 al 5 en cada pregunta, comparándolo con el resto de tus clientes. El 20% con la compra más reciente saca 5 en recencia, el siguiente 20% saca 4, y así hasta el 1. Lo mismo con la frecuencia y el monto.

Con esas notas, cada cliente cae en un **segmento**. Hay versiones con diez u once segmentos, pero para una pequeña empresa cinco alcanzan, porque cada uno pide una acción distinta:

- **Campeones:** vinieron hace poco, vienen seguido y gastan bien.
- **Nuevos y prometedores:** vinieron hace poco, pero todavía van pocas veces o gastan poco.
- **Necesitan atención:** ni muy recientes ni muy lejanos. Están en el punto donde un cliente decide si vuelve.
- **En riesgo:** gastaban bien y venían seguido, pero hace tiempo que no vuelven.
- **Perdidos:** vinieron una o dos veces, gastaron poco y no han vuelto.

Para no trabajar con 125 combinaciones, la frecuencia y el monto se promedian en una sola nota, **FM**. Así queda una matriz de 5 por 5 que se puede ver en un solo gráfico.

## Por qué vale la pena hacerlo

En la encuesta de crédito a pequeñas empresas de los bancos de la Reserva Federal, el 57% de las empresas con empleados dijo que le costaba llegar a clientes y hacer crecer sus ventas, y el 73% reportó el aumento de costos como una dificultad financiera. Conseguir clientes nuevos cuesta dinero en publicidad, descuentos y tiempo. Recuperar a un cliente que ya te conoce, ya sabe dónde estás y ya confió en ti una vez, casi siempre cuesta menos.

El análisis RFM te dice a quién recuperar, y también a quién no vale la pena perseguir.

## El salón del ejemplo

Según la Oficina de Estadísticas Laborales de Estados Unidos (BLS), los barberos, estilistas y cosmetólogos ocupaban 670.800 empleos en 2025, y se proyecta que su empleo crezca 7% entre 2025 y 2035, mucho más rápido que el promedio. El 48% de los estilistas y cosmetólogos trabaja por cuenta propia. Es un sector de negocios pequeños, donde la relación con cada cliente lo es todo.

Imagina un salón independiente, con un solo local, que en los últimos 12 meses atendió a 840 clientes distintos en 2.702 visitas y facturó US$284.050, con un ticket promedio de unos US$105. Como trabaja con citas, cada visita queda registrada con el nombre del cliente, la fecha y el monto.

La dueña siente que la agenda está llena, pero ve caras nuevas todo el tiempo y no sabe cuántas de sus clientas de siempre siguen viniendo.

Los datos son ilustrativos, pero el patrón es el que vemos en negocios de servicios con clientes recurrentes: salones, barberías, spas, talleres mecánicos, veterinarias o gimnasios.

## Cómo hacer el análisis paso a paso

Igual que el de Pareto, se puede hacer en Excel o Google Sheets.

1. **Exporta el historial de ventas o citas** de los últimos 12 meses, con tres columnas: cliente, fecha y monto. Si tu sistema de citas o tu punto de venta guarda el cliente en cada venta, ya tienes lo necesario.
2. **Resume por cliente** con una tabla dinámica: la fecha de la última visita (máximo), el número de visitas (contar) y el total gastado (suma).
3. **Calcula la recencia**: los días entre la fecha del análisis y la última visita.
4. **Asigna las notas del 1 al 5.** Para la recencia, donde menos días es mejor, la fórmula es `=1+ENTERO(5*CONTAR.SI(D:D;">"&D2)/CONTAR(D:D))`, con los días en la columna D. Para la frecuencia y el monto, donde más es mejor, cambia `">"` por `"<"`. Si muchos clientes empatan, como todos los que vinieron una sola vez, reciben la misma nota.
5. **Calcula FM**: el promedio de la frecuencia y el monto, redondeado.
6. **Asigna el segmento** con la recencia y FM: campeones si R es 4 o 5 y FM es 4 o 5; nuevos y prometedores si R es 4 o 5 y FM es 3 o menos; necesitan atención si R es 3; en riesgo si R es 1 o 2 y FM es 3 o más; perdidos si R y FM son 1 o 2.

Para el salón lo hicimos en Python con pandas y gráficos en matplotlib. La lógica es exactamente la misma de la hoja de cálculo.

En el salón, las notas de recencia quedaron así: 5 para quienes vinieron en los últimos 23 días, 4 de 24 a 49 días, 3 de 50 a 119, 2 de 120 a 207 y 1 para quienes no vienen desde hace 208 días o más. El 41% de los clientes vino una sola vez, y todos ellos sacaron 1 en frecuencia.

## Lo que encontró el salón

Primero miramos qué parte de los clientes y de los ingresos representa cada segmento.

![Barras horizontales por segmento con el porcentaje de clientes y de ingresos: los campeones son el 28% de los clientes y el 62% de los ingresos; los nuevos y prometedores, el 12% y el 4%; los que necesitan atención, el 20% y el 13%; los clientes en riesgo, el 10% y el 15%; y los perdidos, el 30% y el 6%](/images/blog/rfm-analysis-small-business/segmentos-clientes-ingresos.svg "Datos ilustrativos. Cada segmento tiene dos barras: su parte de los clientes y su parte de los ingresos.")

Tres hallazgos:

- **237 campeones sostienen el salón.** Son el 28% de los clientes y dejaron el 62% de los ingresos, US$176.520 en el año. Cada uno gastó en promedio US$745 en unas seis visitas.
- **82 clientes en riesgo valen más que 255 perdidos.** Los clientes en riesgo son solo el 10%, pero aportaron el 15% de los ingresos, US$42.746. Venían unas cuatro veces al año y gastaban en promedio US$521, pero su última visita fue, en promedio, hace 166 días.
- **Casi un tercio de los clientes vino una vez y no volvió.** Los 255 perdidos son el 30% de la lista y apenas el 6% de los ingresos.

La matriz muestra dónde está cada cliente según su recencia y su nota de frecuencia y gasto. Las celdas más claras tienen más clientes.

![Matriz de 5 por 5 con la recencia en el eje vertical y la frecuencia y gasto en el eje horizontal: arriba a la derecha, los campeones, con 237 clientes y el 62% de los ingresos; arriba a la izquierda, los nuevos y prometedores, con 99 clientes y el 4%; en la fila del medio, los que necesitan atención, con 167 clientes y el 13%; abajo a la derecha, los clientes en riesgo, con 82 clientes y el 15%; y abajo a la izquierda, los perdidos, con 255 clientes y el 6%](/images/blog/rfm-analysis-small-business/matriz-rfm-salon.svg "Datos ilustrativos. Las celdas más claras tienen más clientes.")

Las dos esquinas de abajo cuentan historias muy distintas. La esquina izquierda está llena de clientes de una sola visita que nunca volvieron. La derecha tiene menos clientes, pero son clientes que ya eran fieles y se están yendo.

El último gráfico lo confirma: cuenta cuántos clientes no vienen desde hace cuántos días, y separa a los de frecuencia y gasto altos de los demás.

![Histograma de los días desde la última visita, de 0 a 365 días: más de la mitad de los clientes de frecuencia y gasto altos vino en los últimos 50 días; a partir de los 120 días, donde empiezan las notas de recencia 1 y 2, todavía quedan clientes de frecuencia y gasto altos, los 82 clientes en riesgo, que dejaron US$42.746 el último año, mientras la mayoría son clientes de frecuencia y gasto bajos](/images/blog/rfm-analysis-small-business/dias-desde-ultima-visita.svg "Datos ilustrativos. La línea punteada marca el inicio de las notas de recencia 1 y 2.")

## Qué hacer con cada segmento

### Campeones: cuidarlos, no darles descuentos

No necesitan una promoción para volver; ya vuelven. Lo que necesitan es sentirse reconocidos y que nada los empuje a irse. Para el salón, la decisión fue:

- Agendar la próxima cita antes de que salgan del salón, para que su estilista favorita no esté llena cuando la necesiten.
- Darles prioridad en los horarios más pedidos, como los sábados por la mañana.
- Pedirles que recomienden el salón. Un campeón que trae a una amiga vale más que cualquier anuncio.

### Nuevos y prometedores: conseguir la segunda visita

Son 99 clientes que vinieron hace poco y todavía no tienen el hábito. La segunda visita es la que decide si se quedan. El salón empezó a enviar un mensaje personal a las tres o cuatro semanas de la primera visita, firmado por la estilista que los atendió, con un enlace para agendar.

### Necesitan atención: el recordatorio a tiempo

Estos 167 clientes no vienen desde hace entre 50 y 119 días. Muchos simplemente no se acordaron de pedir cita. Un recordatorio automático cuando se cumple su ciclo habitual, por ejemplo a las seis u ocho semanas de su último corte, alcanza para que la mayoría vuelva.

### En riesgo: la llamada personal

Aquí está el dinero que el salón estaba perdiendo sin darse cuenta. Son 82 clientes que dejaron US$42.746 el año pasado. Si el salón recupera a uno de cada cuatro, son unos US$10.700 al año, sin gastar en publicidad.

Para este grupo, un mensaje masivo no sirve. La estilista llama o escribe a cada uno, pregunta cómo está y si hubo algo que no le gustó. A veces la respuesta es una mudanza. A veces es una mala experiencia que nadie supo, y esa información vale tanto como la clienta.

### Perdidos: un último intento y seguir adelante

Para los 255 clientes perdidos, el salón envía una sola campaña de bajo costo, por ejemplo un correo con una oferta para volver, y después deja de gastar en ellos. Perseguir a quien vino una vez hace diez meses es la forma más cara de buscar ventas. Ese esfuerzo rinde mucho más con los clientes en riesgo.

## Errores comunes

- **Darle descuentos a todos por igual.** Un descuento a un campeón regala margen a alguien que iba a volver igual. Úsalo en los clientes en riesgo, donde sí cambia la decisión.
- **Usar notas fijas copiadas de otro negocio.** Que un cliente no vuelva en 60 días es normal en un salón y alarmante en una cafetería. Por eso las notas del 1 al 5 se calculan comparando a tus propios clientes.
- **Hacerlo una sola vez.** Los clientes cambian de segmento todos los meses. Repite el análisis cada mes o cada trimestre y mira quién pasó de campeón a en riesgo.
- **No registrar al cliente en cada venta.** Sin el nombre o el teléfono del cliente en cada compra, no hay RFM. Si hoy vendes sin identificar al cliente, empieza por ahí: un programa de lealtad o pedir el teléfono en caja alcanza.

## Qué viene en la serie

El análisis RFM es una foto de tus clientes hoy. El siguiente paso es ver la película: el análisis de cohortes agrupa a los clientes según el mes en que llegaron y muestra cuántos siguen viniendo uno, tres y seis meses después. Será el próximo artículo de esta serie sobre inteligencia de negocios para pequeñas empresas.

Si todavía no tienes tus datos de clientes en un solo lugar, empieza por nuestra [guía de inteligencia de negocios para pymes](/es/blog/business-intelligence-small-business/).

## Tu siguiente paso

Exporta hoy el historial de ventas o citas de los últimos 12 meses con el cliente, la fecha y el monto. Arma la tabla dinámica por cliente y ordena por la fecha de la última visita. Solo con eso vas a ver quiénes eran clientes fieles y llevan meses sin venir.

Si quieres que el análisis se actualice solo cada mes y que tu equipo reciba la lista de clientes a llamar, en ShineTechData lo armamos contigo. Conoce nuestro servicio de [análisis de datos](/es/services/data-analysis/).
