---
title: "Python para IA: las herramientas que valen la pena y cómo crear tu primer agente"
description: "Python es el idioma de la inteligencia artificial. Te mostramos las cinco herramientas que más se usan, qué es de verdad un agente de IA y cómo armar uno sencillo en menos de 60 líneas."
seoTitle: "Python para IA: herramientas y tu primer agente de IA"
seoDescription: "Las herramientas de Python que más rinden con IA (pandas, Jupyter, SDKs, Pydantic, FastAPI) y un ejemplo sencillo de agente de IA paso a paso."
sources:
  - octoverse2024
  - anthropicEffectiveAgents
  - claudeToolUse
cta:
  title: "¿Quieres un agente que trabaje con los datos de tu empresa?"
  text: "Te ayudamos a elegir el primer proceso, conectar tus datos de forma segura y poner en marcha un agente que tu equipo pueda usar."
  button: "Agenda tu consultoría gratis"
---

Si quieres sacarle provecho a la inteligencia artificial más allá de chatear con ChatGPT, tarde o temprano vas a llegar a Python. En 2024, según el informe Octoverse de GitHub, Python superó a JavaScript como el lenguaje más popular en GitHub, y el mismo informe lo atribuye en buena parte al auge de la IA y la ciencia de datos.

Esta guía es para quien sabe un poco de programación, o tiene curiosidad, y quiere entender dos cosas: qué herramientas de Python valen la pena para trabajar con IA y cómo funciona un agente de IA por dentro. Al final tienes un ejemplo completo, corto y comentado.

## Por qué Python domina la IA

Python no es el lenguaje más rápido, pero gana por tres razones prácticas:

- **Se lee casi como inglés.** Un analista de datos o un ingeniero puede entender un script sin ser programador de carrera.
- **Tiene una librería para todo.** Limpiar un Excel, entrenar un modelo, leer un PDF o llamar a una API de IA son pocas líneas.
- **Los proveedores de IA lo apoyan.** OpenAI, Anthropic y Google publican SDKs oficiales de Python, con documentación y ejemplos listos para copiar.

El informe de GitHub también encontró que el uso de Jupyter Notebooks, la herramienta favorita para experimentar con datos, creció 92 % en un año.

## Las cinco herramientas de Python que más rinden con IA

![Cinco herramientas de Python para IA: pandas para limpiar datos, Jupyter para probar ideas, el SDK del modelo para hablar con la IA, Pydantic para validar respuestas y FastAPI para publicar tu agente](/images/blog/python-ai-agents/herramientas-python-para-ia.svg)

1. **pandas: tus datos en orden.** La IA es tan buena como los datos que le das. Con pandas lees un Excel o un CSV, quitas duplicados, unes tablas y preparas exactamente lo que el modelo necesita ver.
2. **Jupyter: un cuaderno para probar.** Escribes una celda, la ejecutas y ves el resultado al instante. Es ideal para probar un prompt con diez ejemplos reales antes de convertirlo en un programa.
3. **El SDK del modelo: la conexión con la IA.** Paquetes como `anthropic` u `openai` se instalan con `pip install` y te dejan enviar un mensaje al modelo y recibir la respuesta con tres o cuatro líneas de código.
4. **Pydantic: respuestas con forma.** Cuando le pides a la IA que extraiga datos de una factura, necesitas que el monto sea un número y la fecha una fecha. Pydantic valida esa estructura y te avisa si algo no cuadra.
5. **FastAPI: tu agente como servicio.** Cuando el agente funciona en tu computadora, FastAPI lo convierte en una API que tu web, tu CRM o una automatización pueden llamar.

¿Y LangChain, LlamaIndex y los demás frameworks de agentes? Pueden ahorrar trabajo en proyectos grandes, pero no son obligatorios. La propia Anthropic recomienda empezar llamando directamente a la API, porque muchos patrones se resuelven en pocas líneas, y advierte que los frameworks añaden capas que hacen más difícil ver qué está pasando y depurar errores.

## Qué es un agente de IA, sin humo

Un chatbot responde con lo que sabe. Un **agente** puede *hacer cosas*: consultar tu base de datos, buscar un pedido, crear una tarea o enviar un correo. Anthropic lo define como un sistema en el que el modelo dirige su propio proceso y decide qué herramientas usar para completar la tarea.

Por dentro, un agente es un ciclo sencillo:

![El ciclo de un agente: llega una pregunta, el modelo decide qué herramienta usar, tu función de Python se ejecuta y devuelve el resultado, y el ciclo se repite hasta tener la respuesta final](/images/blog/python-ai-agents/ciclo-de-un-agente-ia.svg "El modelo nunca ejecuta tu código: te pide que lo ejecutes y tú le devuelves el resultado.")

1. **Le describes tus herramientas al modelo:** un nombre, para qué sirve y qué datos necesita.
2. **El modelo decide.** Si puede responder, responde. Si necesita datos, te devuelve una petición para usar una herramienta, con los datos ya llenos.
3. **Tu código ejecuta la herramienta** y le devuelve el resultado al modelo.
4. **Se repite** hasta que el modelo tiene lo que necesita y da la respuesta final.

Ese es el truco: **el modelo nunca toca tu sistema directamente.** Solo pide, y tu código decide qué se ejecuta. Eso te da control y seguridad.

## Ejemplo: un agente que consulta pedidos

Vamos a crear un agente que responde preguntas sobre pedidos de clientes. Usamos el SDK de Anthropic, pero la idea es la misma con otros proveedores. Necesitas Python instalado y una clave de API guardada en la variable de entorno `ANTHROPIC_API_KEY`.

```bash
pip install anthropic
```

Este es el agente completo:

```python
import json
import anthropic

client = anthropic.Anthropic()  # lee ANTHROPIC_API_KEY del entorno

# 1. Tus datos. En la vida real: tu base de datos, un Excel o tu sistema de ventas.
PEDIDOS = {
    "1042": {"cliente": "Ferretería Luna", "estado": "enviado", "total": 350.0, "pagado": 200.0},
    "1043": {"cliente": "Café Central", "estado": "pendiente", "total": 120.0, "pagado": 0.0},
}

# 2. La función que el agente puede usar.
def consultar_pedido(numero: str) -> str:
    pedido = PEDIDOS.get(numero)
    if pedido is None:
        return f"No existe el pedido {numero}."
    return json.dumps(pedido, ensure_ascii=False)

# 3. La descripción de la herramienta, para que el modelo sepa cuándo usarla.
herramientas = [{
    "name": "consultar_pedido",
    "description": "Devuelve cliente, estado, total y monto pagado de un pedido.",
    "input_schema": {
        "type": "object",
        "properties": {
            "numero": {"type": "string", "description": "Número del pedido, por ejemplo 1042"},
        },
        "required": ["numero"],
    },
}]

# 4. El ciclo del agente.
def agente(pregunta: str) -> str:
    mensajes = [{"role": "user", "content": pregunta}]
    for _ in range(10):  # tope de vueltas, por seguridad
        respuesta = client.messages.create(
            model="claude-opus-5-5",
            max_tokens=4096,
            tools=herramientas,
            messages=mensajes,
        )
        # Si no pide herramientas, ya tiene la respuesta final.
        if respuesta.stop_reason != "tool_use":
            return "".join(b.text for b in respuesta.content if b.type == "text")

        # Guardamos lo que pidió el modelo y ejecutamos cada herramienta.
        mensajes.append({"role": "assistant", "content": respuesta.content})
        resultados = []
        for bloque in respuesta.content:
            if bloque.type == "tool_use":
                resultados.append({
                    "type": "tool_result",
                    "tool_use_id": bloque.id,
                    "content": consultar_pedido(bloque.input["numero"]),
                })
        mensajes.append({"role": "user", "content": resultados})
    return "El agente no terminó en 10 vueltas."

print(agente("¿Cuánto le falta por pagar a Ferretería Luna en el pedido 1042?"))
```

Qué pasa cuando lo ejecutas:

1. El modelo lee la pregunta, ve que tiene la herramienta `consultar_pedido` y pide usarla con `numero: "1042"`. La respuesta llega con `stop_reason` igual a `"tool_use"`.
2. Tu código ejecuta `consultar_pedido("1042")` y le devuelve los datos en un bloque `tool_result`, con el mismo `id` de la petición.
3. El modelo vuelve a correr, ahora con los datos, y responde algo como: *"Al pedido 1042 de Ferretería Luna le faltan $150 por pagar: el total es $350 y ha pagado $200. El pedido ya fue enviado."*

Fíjate en que la resta la hizo el modelo con datos reales de tu sistema, no inventados. Si preguntas por un pedido que no existe, tu función lo dice y el agente lo comunica.

## Cómo hacerlo crecer sin complicarte

- **Agrega herramientas de una en una.** Por ejemplo, `buscar_cliente` o `crear_tarea`. Cada una es una función más y su descripción; en el ciclo eliges qué función correr según `bloque.name`.
- **Escribe buenas descripciones.** El modelo decide qué herramienta usar leyendo el nombre y la descripción. Una descripción clara vale más que un prompt largo.
- **Empieza solo con herramientas de lectura.** Consultar es seguro. Para acciones que cambian algo (enviar un correo, cobrar, borrar), pide una confirmación humana antes de ejecutarlas.
- **Pon límites.** El tope de vueltas del ejemplo evita ciclos infinitos y gastos inesperados. Registra cada herramienta que el agente usa para poder revisarlo después.
- **Protege tus claves y tus datos.** La clave de API va en variables de entorno, nunca en el código. Comparte con el modelo solo los datos que la tarea necesita. Te explicamos los riesgos en [Agentes de IA: qué son y qué riesgos tiene darles acceso a tus cuentas](/es/blog/ai-agents-account-access-risks/).

## Por dónde empezar esta semana

1. Instala Python y Jupyter, y prueba el SDK de tu proveedor de IA con una sola pregunta.
2. Elige una consulta que tu equipo repite todos los días: estado de pedidos, inventario o saldo de un cliente.
3. Copia el ejemplo, cambia el diccionario `PEDIDOS` por una lectura de tu Excel con pandas y prueba con diez preguntas reales.

Un agente útil no necesita ser grande. Necesita una tarea clara, buenos datos y límites bien puestos.
