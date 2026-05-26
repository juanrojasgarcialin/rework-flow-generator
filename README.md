# Rework Flow Generator

**Nombre del estudiante:** Juan Jose Rojas Garcia

**Grupo:** 942

## Descripcion general

Rework Flow Generator, o Generador de Flujos de Retrabajo, es una aplicacion web local creada con HTML, CSS y JavaScript puro. Su objetivo es ayudar a transformar reglas de retrabajo de un proceso productivo en una pseudonomenclatura estandarizada.

El sistema permite registrar un flujo principal, crear flujos alternos de retrabajo, definir reglas y generar automaticamente el texto requerido para cada paso del proceso.

Ademas incluye una biblioteca de ejemplos para probar procesos mas variados, como ensamblaje de auto, empaquetado de aguacate, fabricacion de refresco y fabricacion de medicamento.

## Statement del problema

En un proceso productivo real, un producto normalmente avanza por una secuencia de pasos. Sin embargo, en cualquier punto puede aparecer una falla, defecto o situacion especial que obligue al producto a salir del flujo normal.

Cuando esto ocurre, el producto entra a un flujo de retrabajo. Despues de completar el retrabajo, debe regresar a un paso especifico del flujo principal. El problema es que estas reglas pueden volverse dificiles de documentar manualmente cuando existen muchos pasos, razones y flujos alternos.

El cliente necesita una forma clara y repetible de capturar esas relaciones y generar el output tecnico esperado.

## Objetivo

Desarrollar una herramienta web funcional que permita:

- Registrar el proceso principal y sus pasos.
- Registrar uno o varios flujos de retrabajo.
- Relacionar razones de falla con flujos de retrabajo.
- Definir el paso al que regresa el producto despues del retrabajo.
- Generar automaticamente la salida en el formato solicitado.
- Guardar los datos en el navegador usando LocalStorage.

## Requerimientos identificados

Durante el analisis se identificaron los siguientes requerimientos:

- Capturar el nombre del proceso principal.
- Capturar pasos principales con nombre y posicion.
- Crear flujos de retrabajo con sus propios pasos.
- Crear reglas que conecten un paso principal con una razon, un flujo de retrabajo, un paso inicial de retrabajo y un paso de retorno.
- Generar el output agrupado por cada paso del flujo principal.
- Concatenar multiples reglas de un mismo paso separadas por punto y coma.
- Mostrar el resultado en una tabla.
- Permitir copiar el output generado.
- Guardar automaticamente la informacion en LocalStorage.
- Incluir botones para cargar ejemplo y limpiar datos.
- Cargar diferentes procesos de ejemplo con un click.
- Visualizar la distribucion de cada flujo de retrabajo seleccionado.

## Input esperado

El sistema espera cuatro grupos principales de informacion:

1. Proceso principal:
   - Nombre del proceso.
   - Lista de pasos con nombre y posicion.

2. Flujos de retrabajo:
   - Nombre del flujo de retrabajo.
   - Lista de pasos del flujo.

3. Reglas:
   - Paso principal afectado.
   - Reason o razon del retrabajo.
   - Flujo de retrabajo destino.
   - Paso inicial dentro del flujo de retrabajo.
   - Paso del flujo principal al que se regresa.

4. Accion del usuario:
   - Generar output.
   - Copiar output.

## Output esperado

El formato exacto del output generado por cada regla es:

```text
GoToFlowPath[Nombre del flujo de retrabajo/Paso del flujo de retrabajo] ReturnStep[Paso de retorno del flujo principal] Reason[Razon del retrabajo];
```

Ejemplo:

```text
GoToFlowPath[Retrabajar Leche/Hervir Leche] ReturnStep[Empacar Lata] Reason[Leche Podrida];
```

Si un paso principal tiene varias razones de retrabajo, el sistema concatena las reglas en la misma celda:

```text
GoToFlowPath[Retrabajar Leche/Hervir Leche] ReturnStep[Empacar Lata] Reason[Leche Podrida]; GoToFlowPath[Retrabajar Empaque/Desempacar] ReturnStep[Empacar Lata] Reason[Empaque Dañado];
```

## Explicacion de la logica

La aplicacion maneja tres estructuras principales:

```javascript
mainFlow = {
  name: "Proceso Envasado Leche",
  steps: [
    { id: 1, name: "Crear Lata", position: 1 },
    { id: 2, name: "Llenar Lata", position: 2 }
  ]
}
```

```javascript
reworkFlows = [
  {
    id: 1,
    name: "Retrabajar Leche",
    steps: [
      { id: 1, name: "Hervir Leche", position: 1 }
    ]
  }
]
```

```javascript
rules = [
  {
    id: 1,
    mainStepId: 3,
    reason: "Leche Podrida",
    reworkFlowId: 1,
    reworkStepId: 1,
    returnStepId: 3
  }
]
```

La funcion `generateOutput()` recorre cada paso del flujo principal. Para cada paso busca las reglas cuyo `mainStepId` coincide con el `id` del paso. Despues obtiene los nombres relacionados y arma la cadena:

```text
GoToFlowPath[Flujo/Paso] ReturnStep[Paso] Reason[Razon];
```

Finalmente, si existen varias reglas para el mismo paso, se unen en una sola celda separadas por un espacio.

## Procesos elegidos para ejemplificar

La aplicacion incluye varios ejemplos para mostrar que la solucion no se limita a un proceso simple:

- Envasado de leche.
- Ensamblaje de un auto.
- Empaquetado de aguacate.
- Fabricacion de un refresco.
- Fabricacion de un medicamento.

El ejemplo base usa un proceso de envasado de leche:

Proceso principal:

- Crear Lata
- Llenar Lata
- Empacar Lata
- Enviar Lata

Flujo de retrabajo 1:

- Retrabajar Leche
- Hervir Leche
- Analizar Leche

Flujo de retrabajo 2:

- Retrabajar Empaque
- Desempacar
- Cambiar Empaque
- Reetiquetar

Reglas:

- Si en `Empacar Lata` ocurre `Leche Podrida`, ir a `Retrabajar Leche/Hervir Leche` y regresar a `Empacar Lata`.
- Si en `Empacar Lata` ocurre `Empaque Dañado`, ir a `Retrabajar Empaque/Desempacar` y regresar a `Empacar Lata`.

Los ejemplos adicionales siguen la misma logica, pero agregan mas pasos y mas flujos alternos para representar escenarios de negocio mas realistas.

## Herramientas utilizadas

- HTML5 para la estructura.
- CSS3 para el diseno visual.
- JavaScript Vanilla para la logica.
- LocalStorage para persistencia local.
- Git y GitHub para control de versiones y publicacion.
- Herramientas de IA como apoyo para interpretar el requerimiento, organizar la logica, proponer la estructura del sistema y documentar la solucion.

No se utilizaron frameworks pesados, backend ni bases de datos externas.

## Proceso de solucion paso a paso

La solucion se desarrollo siguiendo un proceso similar al de un Business Analyst:

1. Primero se entendio el problema del cliente: documentar salidas de retrabajo dentro de un proceso productivo.
2. Despues se identificaron las entidades principales: proceso, pasos, flujos de retrabajo, razones y reglas.
3. Luego se definio el input necesario para construir cada regla.
4. Despues se definio el output exacto esperado por el sistema.
5. Se modelo la relacion entre pasos principales, razones, retrabajos y pasos de retorno.
6. Finalmente se creo una herramienta visual para automatizar la generacion del texto.

## Problemas encontrados y como se resolvieron

Uno de los principales retos fue representar reglas que dependen de varias entidades al mismo tiempo. Para resolverlo, cada paso y flujo tiene un `id` interno. Las reglas guardan esos identificadores y el sistema busca los nombres al momento de generar el output.

Otro reto fue mantener la informacion despues de recargar la pagina. Se resolvio usando LocalStorage, guardando el estado completo cada vez que el usuario agrega o elimina datos.

Tambien se considero que un mismo paso principal puede tener varias razones de retrabajo. La funcion de generacion agrupa las reglas por paso principal y concatena los resultados en la misma celda.

Una mejora posterior fue permitir que el usuario visualice la distribucion de cada flujo de retrabajo. Para resolverlo, se agrego un panel donde se selecciona un flujo con un click y se muestran sus pasos, las reglas que entran a ese flujo y el paso principal al que regresa el producto.

## Como ejecutar el proyecto

No se requiere instalacion de dependencias.

1. Descargar o clonar el repositorio.
2. Abrir la carpeta `rework-flow-generator`.
3. Abrir el archivo `index.html` en un navegador web moderno.

Tambien se puede abrir desde la ruta local del proyecto:

```text
rework-flow-generator/index.html
```

## Como usar la aplicacion

1. Elegir un ejemplo desde la biblioteca o capturar un proceso propio.
2. Capturar el nombre del proceso principal.
3. Agregar los pasos principales con su posicion.
4. Crear uno o varios flujos de retrabajo.
5. Agregar pasos a cada flujo de retrabajo.
6. Crear reglas indicando paso afectado, reason, flujo, paso de retrabajo y paso de retorno.
7. Hacer click en un flujo de retrabajo para ver su distribucion.
8. Presionar `Generar output`.
9. Revisar la tabla final.
10. Usar `Copiar output` para llevar el texto generado a otro documento.

La biblioteca de ejemplos carga automaticamente procesos completos. El boton `Limpiar datos` borra la informacion guardada en el navegador.

## Ejemplo de output

Para el paso `Empacar Lata`, el output esperado del ejemplo es:

```text
GoToFlowPath[Retrabajar Leche/Hervir Leche] ReturnStep[Empacar Lata] Reason[Leche Podrida]; GoToFlowPath[Retrabajar Empaque/Desempacar] ReturnStep[Empacar Lata] Reason[Empaque Dañado];
```

## Conclusion

El proyecto cumple con el objetivo de convertir reglas de retrabajo en un formato estructurado y repetible. La aplicacion permite capturar informacion de negocio, transformarla en relaciones logicas y generar automaticamente la pseudonomenclatura requerida.

Esta solucion muestra como un requerimiento parcialmente explicado puede analizarse, modelarse y convertirse en una herramienta funcional para apoyar un proceso productivo.

## Posibles mejoras futuras

- Permitir editar pasos, flujos y reglas existentes.
- Exportar el output a archivo `.txt` o `.csv`.
- Importar procesos desde archivos JSON.
- Agregar validacion para evitar nombres duplicados.
- Mejorar la vista grafica del flujo principal y sus retrabajos.
- Agregar soporte para multiples procesos principales.
