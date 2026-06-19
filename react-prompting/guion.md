# Guion — Prompting ReAct
**Canal:** VerbaNexAI Lab · Universidad Tecnológica de Bolívar  
**Duración estimada:** 12–15 minutos  
**Formato:** Screencast de la presentación + demo en vivo con Claude

---

> **Convenciones del guion**
> - `[→]` — avanzar diapositiva
> - `[PAUSA]` — pausa breve para que el espectador asimile
> - `[DEMO]` — momento de demo en vivo
> - *(entre paréntesis)* — indicaciones de cámara o pantalla, no se dicen en voz alta

---

## SLIDE 1 — Portada
*(~1 min)*

Hola, bienvenidos a VerbaNexAI Lab. Soy Carlos Agamez, de la Universidad Tecnológica de Bolívar, y en este video vamos a hablar de una técnica de prompting que cambió la forma en que los modelos de lenguaje pueden interactuar con el mundo real: **ReAct**, que viene de Reasoning and Acting — razonamiento y acción.

Si alguna vez le preguntaste a un modelo de IA algo que requería información actualizada y te inventó la respuesta, o si te preguntaste cómo hacen los agentes de IA para usar herramientas como buscadores o calculadoras de forma coherente... esto es exactamente lo que resuelve ReAct.

Vamos a ver qué es, cómo funciona, y al final vamos a construir un prompt ReAct real y lo vamos a ejecutar en Claude.

`[→]`

---

## SLIDE 2 — Tabla de contenido
*(~30 seg)*

Esto es lo que vamos a cubrir hoy. Arrancamos con el contexto: cuándo y por qué nació ReAct. Luego vemos qué es exactamente y cómo se estructura un prompt. Después vamos al ejemplo en vivo, que es la parte más práctica. Y cerramos con casos de uso reales y conclusiones.

`[→]`

---

## SLIDE 3 — Origen y Problemática
*(~2 min)*

Para entender por qué existe ReAct, tenemos que entender el problema que venía a resolver. Estamos en 2022. Los modelos de lenguaje grandes como GPT-3 y PaLM ya existen y son impresionantes, pero tienen dos problemas bien específicos cuando se trata de tareas complejas.

`[PAUSA]`

**El primer problema** es con Chain-of-Thought — o razonamiento en cadena. Esta técnica, que también es del mismo año, le permite al modelo "pensar paso a paso" antes de responder. Funciona muy bien para razonamiento interno, pero tiene un defecto crítico: **todo sale de los parámetros del modelo**. Si el modelo no sabe algo, no puede buscarlo. Simplemente lo inventa. Eso es lo que llamamos alucinación.

`[PAUSA]`

**El segundo problema** es con los modelos que sí podían ejecutar acciones — llamar herramientas, hacer búsquedas web. El problema ahí era el opuesto: el modelo actuaba, pero no explicaba por qué. Era una caja negra. Si algo fallaba, no había forma de saber en qué paso se equivocó ni cómo corregirlo.

`[PAUSA]`

Entonces Shunyu Yao y su equipo en Princeton y Google Research publicaron el paper *"ReAct: Synergizing Reasoning and Acting"* — y la propuesta era elegante: **¿por qué no mezclar los dos enfoques?** Que el modelo razone en voz alta *y* actúe, en un mismo bucle iterativo. Cada afirmación anclada a una observación real. Eso es ReAct.

`[→]`

---

## SLIDE 4 — ¿Qué es ReAct?
*(~2 min)*

Bien, entonces ¿qué es ReAct concretamente? La idea es simple: en lugar de que el modelo genere una respuesta de golpe, le pedimos que **piense en voz alta** antes de hacer cualquier cosa.

`[PAUSA]`

Fíjense en el diferencial que muestra la diapositiva. Un prompt normal le dice al modelo "responde esto" y el modelo responde, bien o mal. ReAct le dice al modelo: "antes de responder, dime qué necesitas saber, qué herramienta vas a usar para conseguirlo, y qué te devolvió esa herramienta". Ese ciclo se repite hasta que el modelo tiene suficiente información para dar una respuesta final.

`[PAUSA]`

Y el beneficio directo es **menos alucinaciones**. Porque el modelo ya no puede inventarse un dato — si lo necesita, tiene que buscarlo. Y si lo buscó, esa búsqueda queda registrada en la traza. Eso también lo hace auditable: puedes revisar paso a paso cómo llegó a la respuesta.

`[→]`

---

## SLIDE 5 — Estructura del Prompt ReAct
*(~3 min)*

Ahora sí, veamos cómo se estructura un prompt ReAct. Hay cinco componentes que se encadenan en un bucle.

`[PAUSA]`

Todo comienza con la **Pregunta** — la tarea que el usuario quiere resolver. Eso es lo único que cambia de un uso a otro.

A partir de ahí empieza el ciclo. Primero viene el **Thought** — el pensamiento. El modelo razona en voz alta: "para responder esto, primero necesito saber X". No actúa todavía. Solo planifica.

`[PAUSA]`

Luego viene la **Action** — el modelo elige una herramienta. Puede ser `search_web`, `calculator`, `read_url`, lo que sea que tenga disponible. Y justo debajo, el **Action Input** — el argumento concreto que le pasa a esa herramienta. Por ejemplo, si la acción es `search_web`, el input sería la query de búsqueda.

`[PAUSA]`

Después viene la **Observation** — el resultado real que devuelve la herramienta. Esto es clave: no lo genera el modelo, lo devuelve el sistema externo. Y ese resultado entra al contexto del modelo para que pueda usarlo en el siguiente Thought.

`[PAUSA]`

Y así el bucle se repite — Thought, Action, Observation, Thought, Action, Observation — hasta que el modelo tiene toda la información que necesita y emite la **Final Answer**. Una respuesta basada en datos verificados, no en suposiciones.

Lo importante es que no hay un número fijo de iteraciones. El modelo decide cuándo tiene suficiente. En tareas simples puede ser un solo ciclo. En tareas complejas pueden ser cinco o seis.

`[→]`

---

## SLIDE 6 — Ejemplos en vivo
*(~4 min — incluye demo)*

Ahora la parte más interesante: vamos a ver un prompt ReAct real. En pantalla tienen el prompt completo que usé para este ejemplo.

`[PAUSA — dejar que el espectador lea el prompt un momento]`

Fíjense en la estructura. Arriba está la **instrucción de sistema** — le dice al modelo que es un agente ReAct, le define el formato exacto que debe seguir, y le lista las herramientas disponibles: `search_web`, `read_url`, y `create_document`. También le da cuatro reglas concretas: no inventar datos, citar fuentes, no emitir la respuesta final sin antes crear el documento, y qué secciones debe tener ese documento.

`[PAUSA]`

Y abajo está la **tarea** — esto es lo único que cambiaríamos entre un uso y otro. En este caso le pedimos que busque el calendario del Mundial FIFA 2026, clasifique cada partido en tres categorías, y genere un PDF con todo organizado.

Noten que la tarea es perfecta para ReAct: requiere información en tiempo real que el modelo no tiene en sus parámetros, necesita múltiples pasos encadenados, y el resultado final depende de datos verificables.

`[PAUSA]`

---

`[DEMO — Abrir Claude en nueva pestaña]`

Vamos a probarlo. Copio el prompt con el botón de aquí arriba...

*(abrir Claude en nueva pestaña, pegar el prompt en el chat)*

...y lo pego en Claude.

`[PAUSA — esperar respuesta de Claude]`

Observen cómo Claude empieza a estructurar su respuesta. Primero un Thought — explica qué necesita buscar y por qué. Luego una Action con su input. Y así sucesivamente. Todo transparente, todo trazable.

Esto es exactamente lo que diferencia a un agente ReAct de un prompt normal: **puedes seguir el razonamiento paso a paso**.

`[→ — volver a la presentación]`

---

## SLIDE 7 — ¡Gracias!
*(~1 min)*

Y eso es ReAct. Para resumir: es una técnica que combina razonamiento explícito y acción en un bucle iterativo, lo que reduce alucinaciones, hace el proceso auditable, y permite al modelo trabajar con información del mundo real.

Si quieren profundizar, el paper original de Yao et al. está en arXiv:2210.03629, lo tienen referenciado en los recursos del canal. Y si quieren ver el código, los prompts, y los materiales de este y otros videos, los tienen en el GitHub del canal — el link está aquí en pantalla: **github.com/VerbaNexAI**.

Nos vemos en el próximo video. Cualquier pregunta la dejan en los comentarios.

---

## Notas de producción

**Antes de grabar:**
- Tener Claude abierto en otra pestaña, listo para pegar
- Usar modo grabación **🪟 Ventana del navegador** para capturar la demo
- Activar la opción *"Entrar en pantalla completa"* del modal de grabación

**Ritmo sugerido:**
- Habla despacio en los conceptos técnicos (Thought / Action / Observation)
- Pausa de 1–2 seg antes de avanzar cada diapositiva
- Durante la demo, describe en voz alta lo que Claude va generando

**Edición:**
- El video grabado queda en `react-prompting/media/`
- Cortar los tiempos de espera largos mientras Claude responde
