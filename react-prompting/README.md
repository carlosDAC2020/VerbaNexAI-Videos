# Prompting ReAct (Reasoning + Acting)

## ¿Qué es ReAct?

**ReAct** es una técnica de *prompting* para modelos de lenguaje introducida por Shunyu Yao y colaboradores en el paper *"ReAct: Synergizing Reasoning and Acting in Language Models"* (2022, Princeton University / Google Research).

La idea central es **combinar el razonamiento en cadena de pensamiento (Chain-of-Thought) con la capacidad de ejecutar acciones** (como llamar herramientas, buscar en la web o consultar APIs), en un único bucle iterativo.

En lugar de que el modelo razone y responda de una sola vez (CoT) o ejecute acciones sin explicar por qué (Act-only), ReAct **intercala ambos** para obtener lo mejor de los dos enfoques:

- **Razonamiento**: permite planificar, descomponer problemas, manejar excepciones y reintentar.
- **Acción**: permite al modelo obtener información del mundo real (búsquedas, cálculos, bases de datos) que no está en sus pesos.

---

## ¿Cómo funciona?

ReAct sigue un ciclo de tres pasos repetido hasta obtener una respuesta final:

1. **Thought (Pensamiento)**: el modelo razona sobre qué necesita hacer a continuación.
2. **Action (Acción)**: el modelo decide y ejecuta una acción externa (por ejemplo, `Search["..."]`, `Calculator[...]`, `Lookup[...]`).
3. **Observation (Observación)**: el modelo recibe el resultado de la acción y lo incorpora a su contexto.

El bucle se repite hasta que el modelo emite un `Final Answer`.

### Formato típico de un prompt ReAct

```
Question: ¿Cuál es la edad actual del presidente de Estados Unidos
multiplicada por 2?

Thought 1: Necesito saber quién es el presidente actual de EE. UU.
Action 1: Search[presidente actual de Estados Unidos]
Observation 1: Donald Trump es el presidente número 47 de EE. UU.

Thought 2: Ahora necesito su fecha de nacimiento.
Action 2: Search[fecha de nacimiento Donald Trump]
Observation 2: Nació el 14 de junio de 1946.

Thought 3: Calculo su edad en 2026: 2026 - 1946 = 80 años.
Action 3: Calculator[2026 - 1946]
Observation 3: 80

Thought 4: Multiplico por 2: 80 * 2 = 160.
Action 4: Calculator[80 * 2]
Observation 5: 160

Thought 5: Ya tengo la respuesta.
Final Answer: 160
```

---

## Variantes

| Variante | Descripción |
|----------|-------------|
| **ReAct (few-shot)** | Se proporciona al modelo 1–6 ejemplos completos del formato Thought/Action/Observation. |
| **ReAct + CoT** | Se combina con razonamiento explícito solo (*chain-of-thought*) para tareas sin acciones externas. |
| **ReAct reflexivo** | Se añade un paso de *self-critique* o *reflection* entre iteraciones. |
| **ReAct multi-agente** | Un agente planifica (ReAct) y otros agentes ejecutan acciones especializadas. |

---

## Ventajas

- **Reduce las alucinaciones**: cada afirmación se ancla a una observación verificable.
- **Trazabilidad**: el razonamiento queda explícito, lo que facilita depurar y auditar.
- **Modularidad**: se pueden añadir/quitar herramientas sin reentrenar el modelo.
- **Robustez**: si una acción falla, el modelo puede razonar sobre cómo recuperarse.

## Limitaciones

- **Coste**: cada paso consume tokens; los bucles largos pueden ser caros.
- **Latencia**: las acciones externas (red, APIs) añaden tiempo.
- **Diseño de herramientas**: el modelo solo es tan bueno como las herramientas que se le ofrecen.
- **Formato frágil**: los modelos pequeños no siempre respetan el formato Thought/Action.

---

## ¿Cuándo usar ReAct?

- Tareas que requieren **información en tiempo real** (precios, clima, noticias).
- Preguntas que necesitan **cálculos precisos** (matemáticas, fechas).
- Flujos con **múltiples pasos** donde el resultado de uno alimenta al siguiente.
- Casos donde la **auditoría del razonamiento** es importante (soporte, legal, medicina).

## ¿Cuándo NO usarlo?

- Preguntas simples que el modelo ya conoce bien.
- Tareas que requieren una única llamada a una API sin razonamiento intermedio.
- Escenarios con latencia mínima requerida.

---

## Frameworks que implementan ReAct

- **LangChain**: `AgentExecutor` con `ReAct` como tipo de agente.
- **LlamaIndex**: `ReActAgent`.
- **Haystack** (deepset): pipelines con `Agent`.
- **AutoGen**, **CrewAI**: coordinaciones multi-agente basadas en ideas de ReAct.
- **Implementación manual**: cualquier bucle `while` que llame al modelo, ejecute una acción y devuelva la observación.

---

## Referencias

- Yao, S. et al. (2022). *ReAct: Synergizing Reasoning and Acting in Language Models*. arXiv:2210.03629.
- Wei, J. et al. (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models*. arXiv:2201.11903.
- Yao, S. et al. (2023). *ReAct meets ActRe: When Language Agents Co-train with Autonomous Action*. (siguiente iteración conceptual).
