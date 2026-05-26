const STORAGE_KEY = "reworkFlowGeneratorData";

let mainFlow = {
  name: "",
  steps: []
};

let reworkFlows = [];
let rules = [];
let activeExampleId = "milk";
let selectedReworkFlowId = null;

const elements = {
  processNameInput: document.getElementById("processNameInput"),
  mainStepForm: document.getElementById("mainStepForm"),
  mainStepNameInput: document.getElementById("mainStepNameInput"),
  mainStepPositionInput: document.getElementById("mainStepPositionInput"),
  mainStepsTableBody: document.getElementById("mainStepsTableBody"),
  exampleGallery: document.getElementById("exampleGallery"),
  reworkFlowForm: document.getElementById("reworkFlowForm"),
  reworkFlowNameInput: document.getElementById("reworkFlowNameInput"),
  reworkStepForm: document.getElementById("reworkStepForm"),
  reworkFlowSelect: document.getElementById("reworkFlowSelect"),
  reworkStepNameInput: document.getElementById("reworkStepNameInput"),
  reworkStepPositionInput: document.getElementById("reworkStepPositionInput"),
  reworkFlowsContainer: document.getElementById("reworkFlowsContainer"),
  flowSelectorContainer: document.getElementById("flowSelectorContainer"),
  flowDistributionContainer: document.getElementById("flowDistributionContainer"),
  ruleForm: document.getElementById("ruleForm"),
  ruleMainStepSelect: document.getElementById("ruleMainStepSelect"),
  ruleReasonInput: document.getElementById("ruleReasonInput"),
  ruleReworkFlowSelect: document.getElementById("ruleReworkFlowSelect"),
  ruleReworkStepSelect: document.getElementById("ruleReworkStepSelect"),
  ruleReturnStepSelect: document.getElementById("ruleReturnStepSelect"),
  rulesTableBody: document.getElementById("rulesTableBody"),
  outputTableBody: document.getElementById("outputTableBody"),
  outputTextArea: document.getElementById("outputTextArea"),
  generateOutputButton: document.getElementById("generateOutputButton"),
  generateOutputButtonTop: document.getElementById("generateOutputButtonTop"),
  copyOutputButton: document.getElementById("copyOutputButton"),
  loadExampleButton: document.getElementById("loadExampleButton"),
  clearDataButton: document.getElementById("clearDataButton"),
  messageBox: document.getElementById("messageBox")
};

let messageTimeoutId = null;

const PROCESS_EXAMPLES = {
  milk: {
    title: "Envasado de leche",
    description: "Caso base con leche podrida y empaque dañado.",
    mainFlow: {
      name: "Proceso Envasado Leche",
      steps: [
        { id: 1, name: "Crear Lata", position: 1 },
        { id: 2, name: "Llenar Lata", position: 2 },
        { id: 3, name: "Empacar Lata", position: 3 },
        { id: 4, name: "Enviar Lata", position: 4 }
      ]
    },
    reworkFlows: [
      {
        id: 1,
        name: "Retrabajar Leche",
        steps: [
          { id: 1, name: "Hervir Leche", position: 1 },
          { id: 2, name: "Analizar Leche", position: 2 }
        ]
      },
      {
        id: 2,
        name: "Retrabajar Empaque",
        steps: [
          { id: 1, name: "Desempacar", position: 1 },
          { id: 2, name: "Cambiar Empaque", position: 2 },
          { id: 3, name: "Reetiquetar", position: 3 }
        ]
      }
    ],
    rules: [
      {
        id: 1,
        mainStepId: 3,
        reason: "Leche Podrida",
        reworkFlowId: 1,
        reworkStepId: 1,
        returnStepId: 3
      },
      {
        id: 2,
        mainStepId: 3,
        reason: "Empaque Dañado",
        reworkFlowId: 2,
        reworkStepId: 1,
        returnStepId: 3
      }
    ]
  },
  auto: {
    title: "Ensamblaje de auto",
    description: "Incluye motor, sistema electrico, pintura y carroceria.",
    mainFlow: {
      name: "Proceso Ensamblaje de Auto",
      steps: [
        { id: 1, name: "Recibir Chasis", position: 1 },
        { id: 2, name: "Instalar Motor", position: 2 },
        { id: 3, name: "Ensamblar Carroceria", position: 3 },
        { id: 4, name: "Instalar Sistema Electrico", position: 4 },
        { id: 5, name: "Pintar Auto", position: 5 },
        { id: 6, name: "Inspeccion Final", position: 6 },
        { id: 7, name: "Entregar Auto", position: 7 }
      ]
    },
    reworkFlows: [
      {
        id: 1,
        name: "Retrabajar Motor",
        steps: [
          { id: 1, name: "Diagnosticar Motor", position: 1 },
          { id: 2, name: "Ajustar Montaje", position: 2 },
          { id: 3, name: "Prueba de Encendido", position: 3 }
        ]
      },
      {
        id: 2,
        name: "Retrabajar Sistema Electrico",
        steps: [
          { id: 1, name: "Revisar Arnes", position: 1 },
          { id: 2, name: "Cambiar Conector", position: 2 },
          { id: 3, name: "Probar Circuitos", position: 3 }
        ]
      },
      {
        id: 3,
        name: "Retrabajar Pintura",
        steps: [
          { id: 1, name: "Lijar Superficie", position: 1 },
          { id: 2, name: "Repintar Panel", position: 2 },
          { id: 3, name: "Curar Pintura", position: 3 }
        ]
      },
      {
        id: 4,
        name: "Retrabajar Carroceria",
        steps: [
          { id: 1, name: "Alinear Puerta", position: 1 },
          { id: 2, name: "Ajustar Panel", position: 2 },
          { id: 3, name: "Validar Cierre", position: 3 }
        ]
      }
    ],
    rules: [
      { id: 1, mainStepId: 2, reason: "Motor No Enciende", reworkFlowId: 1, reworkStepId: 1, returnStepId: 2 },
      { id: 2, mainStepId: 4, reason: "Cableado Incorrecto", reworkFlowId: 2, reworkStepId: 1, returnStepId: 4 },
      { id: 3, mainStepId: 5, reason: "Pintura Rayada", reworkFlowId: 3, reworkStepId: 1, returnStepId: 5 },
      { id: 4, mainStepId: 6, reason: "Puerta Desalineada", reworkFlowId: 4, reworkStepId: 1, returnStepId: 6 }
    ]
  },
  avocado: {
    title: "Empaquetado de aguacate",
    description: "Controla madurez, calidad, clasificacion y empaque.",
    mainFlow: {
      name: "Proceso Empaquetado de Aguacate",
      steps: [
        { id: 1, name: "Recepcionar Aguacate", position: 1 },
        { id: 2, name: "Lavar Aguacate", position: 2 },
        { id: 3, name: "Clasificar Tamaño", position: 3 },
        { id: 4, name: "Inspeccionar Calidad", position: 4 },
        { id: 5, name: "Empacar Caja", position: 5 },
        { id: 6, name: "Enfriar Producto", position: 6 },
        { id: 7, name: "Enviar Pedido", position: 7 }
      ]
    },
    reworkFlows: [
      {
        id: 1,
        name: "Reclasificar Aguacate",
        steps: [
          { id: 1, name: "Separar Por Madurez", position: 1 },
          { id: 2, name: "Reasignar Categoria", position: 2 },
          { id: 3, name: "Reintegrar Lote", position: 3 }
        ]
      },
      {
        id: 2,
        name: "Retrabajar Calidad",
        steps: [
          { id: 1, name: "Retirar Fruta Dañada", position: 1 },
          { id: 2, name: "Revisar Lote", position: 2 },
          { id: 3, name: "Reponer Peso", position: 3 }
        ]
      },
      {
        id: 3,
        name: "Rehacer Empaque",
        steps: [
          { id: 1, name: "Abrir Caja", position: 1 },
          { id: 2, name: "Cambiar Material", position: 2 },
          { id: 3, name: "Sellar Caja", position: 3 }
        ]
      }
    ],
    rules: [
      { id: 1, mainStepId: 3, reason: "Tamaño Incorrecto", reworkFlowId: 1, reworkStepId: 1, returnStepId: 3 },
      { id: 2, mainStepId: 4, reason: "Fruta Golpeada", reworkFlowId: 2, reworkStepId: 1, returnStepId: 4 },
      { id: 3, mainStepId: 5, reason: "Caja Mal Sellada", reworkFlowId: 3, reworkStepId: 1, returnStepId: 5 }
    ]
  },
  soda: {
    title: "Fabricacion de refresco",
    description: "Cubre mezcla, carbonatacion, llenado y etiquetado.",
    mainFlow: {
      name: "Proceso Fabricacion de Refresco",
      steps: [
        { id: 1, name: "Preparar Jarabe", position: 1 },
        { id: 2, name: "Mezclar Bebida", position: 2 },
        { id: 3, name: "Carbonatar", position: 3 },
        { id: 4, name: "Llenar Botella", position: 4 },
        { id: 5, name: "Tapar Botella", position: 5 },
        { id: 6, name: "Etiquetar", position: 6 },
        { id: 7, name: "Empacar", position: 7 }
      ]
    },
    reworkFlows: [
      {
        id: 1,
        name: "Ajustar Mezcla",
        steps: [
          { id: 1, name: "Medir Brix", position: 1 },
          { id: 2, name: "Ajustar Concentrado", position: 2 },
          { id: 3, name: "Validar Sabor", position: 3 }
        ]
      },
      {
        id: 2,
        name: "Recarbonatar Bebida",
        steps: [
          { id: 1, name: "Medir CO2", position: 1 },
          { id: 2, name: "Ajustar Carbonatacion", position: 2 },
          { id: 3, name: "Liberar Tanque", position: 3 }
        ]
      },
      {
        id: 3,
        name: "Retrabajar Botella",
        steps: [
          { id: 1, name: "Vaciar Botella", position: 1 },
          { id: 2, name: "Lavar Botella", position: 2 },
          { id: 3, name: "Rellenar Botella", position: 3 }
        ]
      },
      {
        id: 4,
        name: "Reetiquetar Botella",
        steps: [
          { id: 1, name: "Retirar Etiqueta", position: 1 },
          { id: 2, name: "Colocar Etiqueta Nueva", position: 2 },
          { id: 3, name: "Inspeccionar Lote", position: 3 }
        ]
      }
    ],
    rules: [
      { id: 1, mainStepId: 2, reason: "Sabor Fuera de Especificacion", reworkFlowId: 1, reworkStepId: 1, returnStepId: 2 },
      { id: 2, mainStepId: 3, reason: "Bajo Gas", reworkFlowId: 2, reworkStepId: 1, returnStepId: 3 },
      { id: 3, mainStepId: 4, reason: "Nivel Incorrecto", reworkFlowId: 3, reworkStepId: 1, returnStepId: 4 },
      { id: 4, mainStepId: 6, reason: "Etiqueta Torcida", reworkFlowId: 4, reworkStepId: 1, returnStepId: 6 }
    ]
  },
  medicine: {
    title: "Fabricacion de medicamento",
    description: "Ejemplo con formula, compresion, recubrimiento y blister.",
    mainFlow: {
      name: "Proceso Fabricacion de Medicamento",
      steps: [
        { id: 1, name: "Pesar Materias Primas", position: 1 },
        { id: 2, name: "Mezclar Formula", position: 2 },
        { id: 3, name: "Granular", position: 3 },
        { id: 4, name: "Comprimir Tabletas", position: 4 },
        { id: 5, name: "Recubrir Tabletas", position: 5 },
        { id: 6, name: "Empacar Blister", position: 6 },
        { id: 7, name: "Liberar Lote", position: 7 }
      ]
    },
    reworkFlows: [
      {
        id: 1,
        name: "Reajustar Formula",
        steps: [
          { id: 1, name: "Revisar Pesaje", position: 1 },
          { id: 2, name: "Corregir Proporcion", position: 2 },
          { id: 3, name: "Mezclar Nuevamente", position: 3 }
        ]
      },
      {
        id: 2,
        name: "Retrabajar Tabletas",
        steps: [
          { id: 1, name: "Separar Tabletas", position: 1 },
          { id: 2, name: "Recalibrar Prensa", position: 2 },
          { id: 3, name: "Recomprimir", position: 3 }
        ]
      },
      {
        id: 3,
        name: "Retrabajar Recubrimiento",
        steps: [
          { id: 1, name: "Retirar Lote", position: 1 },
          { id: 2, name: "Ajustar Recubrimiento", position: 2 },
          { id: 3, name: "Secar Nuevamente", position: 3 }
        ]
      },
      {
        id: 4,
        name: "Retrabajar Empaque Farmaceutico",
        steps: [
          { id: 1, name: "Retirar Blister", position: 1 },
          { id: 2, name: "Cambiar Folio", position: 2 },
          { id: 3, name: "Sellar Blister", position: 3 }
        ]
      }
    ],
    rules: [
      { id: 1, mainStepId: 2, reason: "Formula Fuera de Rango", reworkFlowId: 1, reworkStepId: 1, returnStepId: 2 },
      { id: 2, mainStepId: 4, reason: "Tableta Quebrada", reworkFlowId: 2, reworkStepId: 1, returnStepId: 4 },
      { id: 3, mainStepId: 5, reason: "Recubrimiento Irregular", reworkFlowId: 3, reworkStepId: 1, returnStepId: 5 },
      { id: 4, mainStepId: 6, reason: "Lote Mal Codificado", reworkFlowId: 4, reworkStepId: 1, returnStepId: 6 }
    ]
  }
};

// Persistencia centralizada para que cada cambio quede guardado al recargar.
function saveData() {
  const data = {
    mainFlow,
    reworkFlows,
    rules,
    activeExampleId,
    selectedReworkFlowId
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    renderAll();
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);
    mainFlow = parsedData.mainFlow || mainFlow;
    reworkFlows = parsedData.reworkFlows || [];
    rules = parsedData.rules || [];
    activeExampleId = parsedData.activeExampleId || activeExampleId;
    selectedReworkFlowId = parsedData.selectedReworkFlowId || selectedReworkFlowId;
  } catch (error) {
    showMessage("No se pudieron cargar los datos guardados.", "error");
  }

  renderAll();
}

function renderAll() {
  ensureSelectedReworkFlow();
  renderExampleGallery();
  elements.processNameInput.value = mainFlow.name;
  renderMainSteps();
  renderReworkFlows();
  renderFlowDistribution();
  renderRules();
  renderOutputTable();
  updateFormOptions();
}

function renderExampleGallery() {
  elements.exampleGallery.innerHTML = "";

  Object.entries(PROCESS_EXAMPLES).forEach(([exampleId, example]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `example-option${exampleId === activeExampleId ? " active" : ""}`;
    button.dataset.action = "load-example";
    button.dataset.exampleId = exampleId;
    button.innerHTML = `
      <strong>${escapeHtml(example.title)}</strong>
      <span>${escapeHtml(example.description)}</span>
    `;
    elements.exampleGallery.appendChild(button);
  });
}

// Renderiza las tablas principales a partir del estado actual en memoria.
function renderMainSteps() {
  const steps = getSortedSteps(mainFlow.steps);
  elements.mainStepsTableBody.innerHTML = "";

  if (steps.length === 0) {
    elements.mainStepsTableBody.appendChild(createEmptyRow(3, "No hay pasos principales registrados."));
    return;
  }

  steps.forEach((step) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${step.position}</td>
      <td>${escapeHtml(step.name)}</td>
      <td>
        <button class="button danger small" type="button" data-action="delete-main-step" data-id="${step.id}">Eliminar</button>
      </td>
    `;
    elements.mainStepsTableBody.appendChild(row);
  });
}

function renderReworkFlows() {
  elements.reworkFlowsContainer.innerHTML = "";

  if (reworkFlows.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "flow-card muted-row";
    emptyState.textContent = "No hay flujos de retrabajo registrados.";
    elements.reworkFlowsContainer.appendChild(emptyState);
    return;
  }

  reworkFlows.forEach((flow) => {
    const card = document.createElement("article");
    card.className = `flow-card${Number(flow.id) === Number(selectedReworkFlowId) ? " active" : ""}`;

    const rows = getSortedSteps(flow.steps).map((step) => `
      <tr>
        <td>${step.position}</td>
        <td>${escapeHtml(step.name)}</td>
        <td>
          <button class="button danger small" type="button" data-action="delete-rework-step" data-flow-id="${flow.id}" data-step-id="${step.id}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    card.innerHTML = `
      <div class="flow-card-header">
        <div>
          <h3 class="flow-card-title">${escapeHtml(flow.name)}</h3>
          <span class="tag">${flow.steps.length} paso(s)</span>
        </div>
        <div class="flow-card-actions">
          <button class="button secondary small" type="button" data-action="select-rework-flow" data-id="${flow.id}">Ver distribucion</button>
          <button class="button danger small" type="button" data-action="delete-rework-flow" data-id="${flow.id}">Eliminar flujo</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Posicion</th>
              <th>Paso</th>
              <th class="action-column">Accion</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td class="muted-row" colspan="3">Este flujo no tiene pasos registrados.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    elements.reworkFlowsContainer.appendChild(card);
  });
}

function renderFlowDistribution() {
  renderFlowSelector();

  const selectedFlow = findReworkFlow(selectedReworkFlowId);

  if (!selectedFlow) {
    elements.flowDistributionContainer.innerHTML = `<p class="muted-row">Agrega o selecciona un flujo de retrabajo para ver su distribucion.</p>`;
    return;
  }

  const flowRules = rules.filter((rule) => Number(rule.reworkFlowId) === Number(selectedFlow.id));
  const sortedSteps = getSortedSteps(selectedFlow.steps);
  const timeline = sortedSteps.map((step) => {
    const markers = flowRules
      .filter((rule) => Number(rule.reworkStepId) === Number(step.id))
      .map((rule) => {
        const mainStep = findMainStep(rule.mainStepId);
        const returnStep = findMainStep(rule.returnStepId);
        return `<span class="marker">Entrada: ${escapeHtml(mainStep?.name || "Paso no encontrado")} / Retorno: ${escapeHtml(returnStep?.name || "Paso no encontrado")}</span>`;
      })
      .join("");

    return `
      <div class="timeline-step">
        <span class="timeline-number">${step.position}</span>
        <div class="timeline-content">
          <strong>${escapeHtml(step.name)}</strong>
          <div class="marker-list">${markers || `<span class="marker">Paso del flujo</span>`}</div>
        </div>
      </div>
    `;
  }).join("");

  const ruleSummaries = flowRules.map((rule) => {
    const mainStep = findMainStep(rule.mainStepId);
    const reworkStep = findReworkStep(rule.reworkFlowId, rule.reworkStepId);
    const returnStep = findMainStep(rule.returnStepId);

    return `
      <li class="rule-summary-item">
        <strong>${escapeHtml(rule.reason)}</strong>: sale desde ${escapeHtml(mainStep?.name || "Paso no encontrado")},
        entra en ${escapeHtml(reworkStep?.name || "Paso no encontrado")} y regresa a ${escapeHtml(returnStep?.name || "Paso no encontrado")}.
      </li>
    `;
  }).join("");

  elements.flowDistributionContainer.innerHTML = `
    <div class="distribution-title">
      <div>
        <h4>${escapeHtml(selectedFlow.name)}</h4>
        <p>${sortedSteps.length} paso(s) de retrabajo y ${flowRules.length} regla(s) asociada(s).</p>
      </div>
      <span class="tag">Flujo seleccionado</span>
    </div>
    <div class="timeline">${timeline || `<p class="muted-row">Este flujo todavia no tiene pasos.</p>`}</div>
    <ul class="rule-summary-list">
      ${ruleSummaries || `<li class="muted-row">Este flujo todavia no tiene reglas asociadas.</li>`}
    </ul>
  `;
}

function renderFlowSelector() {
  elements.flowSelectorContainer.innerHTML = "";

  if (reworkFlows.length === 0) {
    elements.flowSelectorContainer.innerHTML = `<span class="muted-row">No hay flujos disponibles.</span>`;
    return;
  }

  reworkFlows.forEach((flow) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `flow-selector-button${Number(flow.id) === Number(selectedReworkFlowId) ? " active" : ""}`;
    button.dataset.action = "select-rework-flow";
    button.dataset.id = flow.id;
    button.textContent = flow.name;
    elements.flowSelectorContainer.appendChild(button);
  });
}

function renderRules() {
  elements.rulesTableBody.innerHTML = "";

  if (rules.length === 0) {
    elements.rulesTableBody.appendChild(createEmptyRow(5, "No hay reglas de retrabajo registradas."));
    return;
  }

  rules.forEach((rule) => {
    const mainStep = findMainStep(rule.mainStepId);
    const reworkFlow = findReworkFlow(rule.reworkFlowId);
    const reworkStep = findReworkStep(rule.reworkFlowId, rule.reworkStepId);
    const returnStep = findMainStep(rule.returnStepId);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(mainStep?.name || "No encontrado")}</td>
      <td>${escapeHtml(rule.reason)}</td>
      <td>${escapeHtml(reworkFlow?.name || "No encontrado")}/${escapeHtml(reworkStep?.name || "No encontrado")}</td>
      <td>${escapeHtml(returnStep?.name || "No encontrado")}</td>
      <td>
        <button class="button danger small" type="button" data-action="delete-rule" data-id="${rule.id}">Eliminar</button>
      </td>
    `;

    elements.rulesTableBody.appendChild(row);
  });
}

function generateOutput() {
  if (!mainFlow.name.trim()) {
    showMessage("Captura el nombre del proceso principal antes de generar el output.", "warning");
    return [];
  }

  const sortedMainSteps = getSortedSteps(mainFlow.steps);

  if (sortedMainSteps.length === 0) {
    showMessage("Agrega al menos un paso principal antes de generar el output.", "warning");
    return [];
  }

  const outputRows = sortedMainSteps.map((step) => {
    const stepRules = rules.filter((rule) => Number(rule.mainStepId) === Number(step.id));
    const reworks = stepRules
      .map(createRuleOutput)
      .filter(Boolean)
      .join(" ");

    return {
      position: step.position,
      stepName: step.name,
      reworks
    };
  });

  renderOutputTable(outputRows);
  elements.outputTextArea.value = outputRows
    .filter((row) => row.reworks)
    .map((row) => row.reworks)
    .join("\n");

  saveData();
  showMessage("Output generado correctamente.", "success");
  return outputRows;
}

// Carga un caso completo de la biblioteca de ejemplos.
function loadExample(exampleId = activeExampleId) {
  const example = PROCESS_EXAMPLES[exampleId] || PROCESS_EXAMPLES.milk;
  activeExampleId = PROCESS_EXAMPLES[exampleId] ? exampleId : "milk";
  mainFlow = cloneData(example.mainFlow);
  reworkFlows = cloneData(example.reworkFlows);
  rules = cloneData(example.rules);
  selectedReworkFlowId = reworkFlows[0]?.id || null;

  saveData();
  renderAll();
  generateOutput();
  showMessage(`Ejemplo cargado: ${example.title}.`, "success");
}

function clearData() {
  const confirmed = window.confirm("¿Deseas borrar todos los datos guardados?");

  if (!confirmed) {
    return;
  }

  mainFlow = { name: "", steps: [] };
  reworkFlows = [];
  rules = [];
  activeExampleId = "milk";
  selectedReworkFlowId = null;
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
  showMessage("Datos limpiados correctamente.", "success");
}

async function copyOutput() {
  if (!elements.outputTextArea.value.trim()) {
    generateOutput();
  }

  const output = elements.outputTextArea.value.trim();

  if (!output) {
    showMessage("No hay output disponible para copiar.", "warning");
    return;
  }

  try {
    await navigator.clipboard.writeText(output);
    showMessage("Output copiado al portapapeles.", "success");
  } catch (error) {
    const copied = copyTextFallback(output);
    showMessage(
      copied ? "Output copiado usando el metodo alternativo." : "El navegador bloqueo la copia automatica. Selecciona el texto para copiarlo manualmente.",
      copied ? "success" : "warning"
    );
  }
}

// Validaciones de captura para evitar reglas incompletas o sin relacion.
function addMainStep(event) {
  event.preventDefault();
  mainFlow.name = elements.processNameInput.value.trim();
  const stepName = elements.mainStepNameInput.value.trim();

  if (!mainFlow.name) {
    showMessage("El nombre del proceso principal no puede estar vacio.", "warning");
    elements.processNameInput.focus();
    return;
  }

  if (!stepName) {
    showMessage("El paso principal debe tener nombre.", "warning");
    elements.mainStepNameInput.focus();
    return;
  }

  mainFlow.steps.push({
    id: getNextId(mainFlow.steps),
    name: stepName,
    position: getRequestedPosition(elements.mainStepPositionInput.value, mainFlow.steps)
  });

  elements.mainStepNameInput.value = "";
  elements.mainStepPositionInput.value = "";
  saveData();
  renderAll();
  showMessage("Paso principal agregado.", "success");
}

function addReworkFlow(event) {
  event.preventDefault();
  const flowName = elements.reworkFlowNameInput.value.trim();

  if (!flowName) {
    showMessage("El flujo de retrabajo debe tener nombre.", "warning");
    elements.reworkFlowNameInput.focus();
    return;
  }

  const newFlow = {
    id: getNextId(reworkFlows),
    name: flowName,
    steps: []
  };

  reworkFlows.push(newFlow);

  if (!selectedReworkFlowId) {
    selectedReworkFlowId = newFlow.id;
  }

  elements.reworkFlowNameInput.value = "";
  saveData();
  renderAll();
  showMessage("Flujo de retrabajo agregado.", "success");
}

function addReworkStep(event) {
  event.preventDefault();
  const flowId = Number(elements.reworkFlowSelect.value);
  const stepName = elements.reworkStepNameInput.value.trim();
  const flow = findReworkFlow(flowId);

  if (!flow) {
    showMessage("Selecciona un flujo de retrabajo.", "warning");
    elements.reworkFlowSelect.focus();
    return;
  }

  if (!stepName) {
    showMessage("El paso de retrabajo debe tener nombre.", "warning");
    elements.reworkStepNameInput.focus();
    return;
  }

  flow.steps.push({
    id: getNextId(flow.steps),
    name: stepName,
    position: getRequestedPosition(elements.reworkStepPositionInput.value, flow.steps)
  });

  elements.reworkStepNameInput.value = "";
  elements.reworkStepPositionInput.value = "";
  saveData();
  renderAll();
  showMessage("Paso de retrabajo agregado.", "success");
}

function addRule(event) {
  event.preventDefault();
  const mainStepId = Number(elements.ruleMainStepSelect.value);
  const reason = elements.ruleReasonInput.value.trim();
  const reworkFlowId = Number(elements.ruleReworkFlowSelect.value);
  const reworkStepId = Number(elements.ruleReworkStepSelect.value);
  const returnStepId = Number(elements.ruleReturnStepSelect.value);

  if (!mainStepId) {
    showMessage("Selecciona el paso principal afectado.", "warning");
    elements.ruleMainStepSelect.focus();
    return;
  }

  if (!reason) {
    showMessage("La regla debe tener una razon de retrabajo.", "warning");
    elements.ruleReasonInput.focus();
    return;
  }

  if (!reworkFlowId) {
    showMessage("Selecciona el flujo de retrabajo.", "warning");
    elements.ruleReworkFlowSelect.focus();
    return;
  }

  if (!reworkStepId) {
    showMessage("Selecciona el paso inicial de retrabajo.", "warning");
    elements.ruleReworkStepSelect.focus();
    return;
  }

  if (!returnStepId) {
    showMessage("Selecciona el paso de retorno.", "warning");
    elements.ruleReturnStepSelect.focus();
    return;
  }

  rules.push({
    id: getNextId(rules),
    mainStepId,
    reason,
    reworkFlowId,
    reworkStepId,
    returnStepId
  });

  elements.ruleReasonInput.value = "";
  saveData();
  renderAll();
  generateOutput();
  showMessage("Regla agregada correctamente.", "success");
}

function renderOutputTable(outputRows = null) {
  const rows = outputRows || getSortedSteps(mainFlow.steps).map((step) => ({
    position: step.position,
    stepName: step.name,
    reworks: ""
  }));

  elements.outputTableBody.innerHTML = "";

  if (rows.length === 0) {
    elements.outputTableBody.appendChild(createEmptyRow(3, "El output aparecera despues de capturar pasos principales."));
    elements.outputTextArea.value = "";
    return;
  }

  rows.forEach((rowData) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rowData.position}</td>
      <td>${escapeHtml(rowData.stepName)}</td>
      <td class="rework-output">${escapeHtml(rowData.reworks)}</td>
    `;
    elements.outputTableBody.appendChild(row);
  });
}

function updateFormOptions() {
  populateSelect(elements.reworkFlowSelect, reworkFlows, "Selecciona un flujo");
  populateSelect(elements.ruleMainStepSelect, getSortedSteps(mainFlow.steps), "Selecciona un paso");
  populateSelect(elements.ruleReworkFlowSelect, reworkFlows, "Selecciona un flujo");
  populateSelect(elements.ruleReturnStepSelect, getSortedSteps(mainFlow.steps), "Selecciona un paso");
  updateRuleReworkStepOptions();
}

function updateRuleReworkStepOptions() {
  const flowId = Number(elements.ruleReworkFlowSelect.value);
  const flow = findReworkFlow(flowId);
  populateSelect(elements.ruleReworkStepSelect, flow ? getSortedSteps(flow.steps) : [], "Selecciona un paso");
}

function populateSelect(selectElement, options, placeholder) {
  const currentValue = selectElement.value;
  selectElement.innerHTML = `<option value="">${placeholder}</option>`;

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.id;
    optionElement.textContent = option.name;
    selectElement.appendChild(optionElement);
  });

  if ([...selectElement.options].some((option) => option.value === currentValue)) {
    selectElement.value = currentValue;
  }
}

// Construye una regla en la pseudonomenclatura solicitada por el cliente.
function createRuleOutput(rule) {
  const reworkFlow = findReworkFlow(rule.reworkFlowId);
  const reworkStep = findReworkStep(rule.reworkFlowId, rule.reworkStepId);
  const returnStep = findMainStep(rule.returnStepId);

  if (!reworkFlow || !reworkStep || !returnStep || !rule.reason.trim()) {
    return "";
  }

  return `GoToFlowPath[${reworkFlow.name}/${reworkStep.name}] ReturnStep[${returnStep.name}] Reason[${rule.reason}];`;
}

function handleTableActions(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "delete-main-step") {
    deleteMainStep(id);
  }

  if (action === "load-example") {
    loadExample(button.dataset.exampleId);
  }

  if (action === "select-rework-flow") {
    selectReworkFlow(id);
  }

  if (action === "delete-rework-flow") {
    deleteReworkFlow(id);
  }

  if (action === "delete-rework-step") {
    deleteReworkStep(Number(button.dataset.flowId), Number(button.dataset.stepId));
  }

  if (action === "delete-rule") {
    deleteRule(id);
  }
}

function deleteMainStep(stepId) {
  mainFlow.steps = mainFlow.steps.filter((step) => Number(step.id) !== Number(stepId));
  rules = rules.filter((rule) => Number(rule.mainStepId) !== Number(stepId) && Number(rule.returnStepId) !== Number(stepId));
  saveData();
  renderAll();
  showMessage("Paso principal eliminado.", "success");
}

function deleteReworkFlow(flowId) {
  reworkFlows = reworkFlows.filter((flow) => Number(flow.id) !== Number(flowId));
  rules = rules.filter((rule) => Number(rule.reworkFlowId) !== Number(flowId));
  ensureSelectedReworkFlow();
  saveData();
  renderAll();
  showMessage("Flujo de retrabajo eliminado.", "success");
}

function deleteReworkStep(flowId, stepId) {
  const flow = findReworkFlow(flowId);

  if (!flow) {
    return;
  }

  flow.steps = flow.steps.filter((step) => Number(step.id) !== Number(stepId));
  rules = rules.filter((rule) => !(Number(rule.reworkFlowId) === Number(flowId) && Number(rule.reworkStepId) === Number(stepId)));
  saveData();
  renderAll();
  showMessage("Paso de retrabajo eliminado.", "success");
}

function deleteRule(ruleId) {
  rules = rules.filter((rule) => Number(rule.id) !== Number(ruleId));
  saveData();
  renderAll();
  generateOutput();
  showMessage("Regla eliminada.", "success");
}

function selectReworkFlow(flowId) {
  if (!findReworkFlow(flowId)) {
    return;
  }

  selectedReworkFlowId = flowId;
  saveData();
  renderAll();
  showMessage("Distribucion actualizada.", "success");
}

function findMainStep(stepId) {
  return mainFlow.steps.find((step) => Number(step.id) === Number(stepId));
}

function findReworkFlow(flowId) {
  return reworkFlows.find((flow) => Number(flow.id) === Number(flowId));
}

function findReworkStep(flowId, stepId) {
  const flow = findReworkFlow(flowId);
  return flow?.steps.find((step) => Number(step.id) === Number(stepId));
}

function getSortedSteps(steps) {
  return [...steps].sort((a, b) => Number(a.position) - Number(b.position) || Number(a.id) - Number(b.id));
}

function getNextId(items) {
  return items.length ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1;
}

function getRequestedPosition(positionValue, steps) {
  const requestedPosition = Number(positionValue);

  if (Number.isInteger(requestedPosition) && requestedPosition > 0) {
    return requestedPosition;
  }

  return steps.length ? Math.max(...steps.map((step) => Number(step.position))) + 1 : 1;
}

function ensureSelectedReworkFlow() {
  const selectedExists = reworkFlows.some((flow) => Number(flow.id) === Number(selectedReworkFlowId));
  selectedReworkFlowId = selectedExists ? selectedReworkFlowId : reworkFlows[0]?.id || null;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function createEmptyRow(colspan, text) {
  const row = document.createElement("tr");
  row.innerHTML = `<td class="muted-row" colspan="${colspan}">${text}</td>`;
  return row;
}

function showMessage(text, type = "success") {
  window.clearTimeout(messageTimeoutId);
  elements.messageBox.textContent = text;
  elements.messageBox.className = `message visible ${type}`;
  messageTimeoutId = window.setTimeout(() => {
    elements.messageBox.className = "message";
  }, 3200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function copyTextFallback(text) {
  const temporaryTextArea = document.createElement("textarea");
  temporaryTextArea.value = text;
  temporaryTextArea.setAttribute("readonly", "");
  temporaryTextArea.style.position = "fixed";
  temporaryTextArea.style.left = "-9999px";
  temporaryTextArea.style.top = "0";
  document.body.appendChild(temporaryTextArea);
  temporaryTextArea.focus();
  temporaryTextArea.select();
  temporaryTextArea.setSelectionRange(0, temporaryTextArea.value.length);

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(temporaryTextArea);
  return copied;
}

function registerEvents() {
  elements.processNameInput.addEventListener("input", () => {
    mainFlow.name = elements.processNameInput.value.trim();
    saveData();
  });

  elements.mainStepForm.addEventListener("submit", addMainStep);
  elements.reworkFlowForm.addEventListener("submit", addReworkFlow);
  elements.reworkStepForm.addEventListener("submit", addReworkStep);
  elements.ruleForm.addEventListener("submit", addRule);
  elements.ruleReworkFlowSelect.addEventListener("change", updateRuleReworkStepOptions);
  elements.generateOutputButton.addEventListener("click", generateOutput);
  elements.generateOutputButtonTop.addEventListener("click", generateOutput);
  elements.copyOutputButton.addEventListener("click", copyOutput);
  elements.loadExampleButton.addEventListener("click", () => loadExample(activeExampleId));
  elements.clearDataButton.addEventListener("click", clearData);
  document.addEventListener("click", handleTableActions);
}

registerEvents();
loadData();
