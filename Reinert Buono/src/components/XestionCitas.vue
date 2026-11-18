<template>
  <main class="xestion-citas">
    <h2>Solicitude de citas</h2>
    <!-- Avisa de que esta pantalla de prácticas no autentica a quien consulta el DNI. -->
    <p class="aviso">
      Modo de prácticas: o DNI úsase para asociar e consultar as citas, sen verificar a identidade.
    </p>

    <!-- Muestra los datos del paciente cuando la navegación llega desde su ficha. -->
    <section v-if="paciente" class="paciente-seleccionado">
      <h3>Paciente seleccionado</h3>
      <p><strong>Nome:</strong> {{ paciente.nomepac }} {{ paciente.apelpac }}</p>
      <p><strong>DNI/NIE:</strong> {{ paciente.dnipac }}</p>
      <p v-if="paciente.movilpac"><strong>Teléfono:</strong> {{ paciente.movilpac }}</p>
      <p v-if="paciente.mailpac"><strong>Correo:</strong> {{ paciente.mailpac }}</p>
    </section>

    <!-- El formulario sirve tanto para crear una cita como para editar la seleccionada. -->
    <form class="formulario-cita" @submit.prevent="gardarCitaFormulario">
      <div class="campos">
        <div class="campo">
          <label for="id-cita">ID Cita</label>
          <input id="id-cita" :value="novaCita._id || 'Xerarase ao gardar'" type="text" disabled>
        </div>
        <div class="campo">
          <label for="dni">DNI Paciente<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input
            id="dni"
            v-model.trim="novaCita.pacienteDNI"
            type="text"
            autocomplete="off"
            required
            :readonly="Boolean(paciente)"
            @input="cambiarDni"
          >
        </div>
        <div class="campo">
          <label for="doctor">Nome Doctor<span class="obrigatorio" aria-hidden="true">*</span></label>
          <select
            id="doctor"
            v-model="novaCita.doctorId"
            required
          >
            <option value="">Selecciona un doutor</option>
            <option v-for="doctor in doctores" :key="doctor._id" :value="doctor._id">
              {{ doctor.nomedoc }} {{ doctor.apeldoc }}
            </option>
          </select>
        </div>
        <div class="campo">
          <label for="id-doctor">ID Doctor</label>
          <input id="id-doctor" :value="novaCita.doctorId" type="text" disabled>
        </div>
        <div class="campo">
          <label for="fecha">Fecha<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="fecha" v-model="novaCita.fecha" type="date" :min="hoxe" required>
        </div>
        <div class="campo">
          <label for="hora">Hora<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="hora" v-model="novaCita.hora" type="time" required>
        </div>
        <div class="campo campo-motivo">
          <label for="motivo">Motivo de la cita<span class="obrigatorio" aria-hidden="true">*</span></label>
          <textarea id="motivo" v-model.trim="novaCita.motivo" rows="2" required></textarea>
        </div>
        <div class="campo campo-diagnostico">
          <label for="observacions">Observaciones</label>
          <textarea id="observacions" v-model.trim="novaCita.observacions" rows="2"></textarea>
        </div>
        <div class="campo">
          <label for="estado">Estado<span class="obrigatorio" aria-hidden="true">*</span></label>
          <select id="estado" v-model="novaCita.estado" required>
            <option value="pendente">Pendiente</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>
      <p class="nota-obrigatorio"><span aria-hidden="true">*</span> campo obligatorio</p>

      <div class="acciones">
        <button type="submit" :disabled="cargando || !doctores.length">
          {{ cargando ? "Gardando..." : editandoCita ? "Gardar cambios" : "Solicitar cita" }}
        </button>
        <button type="button" class="secundario" :disabled="cargando" @click="limparFormulario">
          {{ editandoCita ? "Cancelar edición" : "Limpiar" }}
        </button>
        <button
          v-if="!paciente"
          type="button"
          :class="[
            'secundario',
            { 'boton-seleccionado': editandoCita && novaCita._id === cita._id },
          ]"
          :disabled="cargando || !novaCita.pacienteDNI"
          @click="consultarCitas"
        >
          Ver citas
        </button>
      </div>
    </form>

    <p v-if="mensaxe" :class="['mensaxe', { erro }]" :role="erro ? 'alert' : 'status'">
      {{ mensaxe }}
    </p>
    <!-- La lista aparece al consultar o guardar citas y permite filtrar y administrar registros. -->
    <div v-if="citas.length" class="listaxe">
      <div class="listaxe-filtros">
        <select v-model="estadoSeleccionado" aria-label="Estado para filtrar citas">
          <option value="">Selecciona un estado</option>
          <option value="pendente">Pendiente</option>
          <option value="realizada">Realizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <button
          type="button"
          class="secundario"
          :disabled="!estadoSeleccionado || cargando"
          @click="filtrarCitasPorEstado"
        >
          Filtrar
        </button>
        <button
          type="button"
          class="secundario"
          :disabled="(!estadoSeleccionado && !estadoFiltroAplicado) || cargando"
          @click="restablecerTablaCitas"
        >
          Restablecer
        </button>
        <button
          type="button"
          class="secundario"
          :disabled="!pacienteIdentificado || cargando"
          @click="imprimirCitas"
        >
          Imprimir
        </button>
      </div>
      <!-- La tabla usa citasVisibles para aplicar el estado filtrado sin perder los datos originales. -->
      <div class="listaxe-cabecera">
        <h3>Listaxe de citas de <span class="nome-paciente-listaxe">{{ nomePacienteCitas }}</span></h3>
      </div>
      <div class="tabla-contenedor" role="region" aria-label="Citas do paciente" tabindex="0">
        <table>
          <caption>Citas de {{ nomePacienteCitas }}</caption>
          <thead>
            <tr>
              <th scope="col">ID Cita</th>
              <th scope="col">DNI Paciente</th>
              <th scope="col">Doctor</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Motivo de la cita</th>
              <th scope="col">Observaciones</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cita in citasVisibles" :key="cita._id">
              <td>{{ cita._id }}</td>
              <td>{{ cita.pacienteDNI }}</td>
              <td>{{ nomeDoctor(cita) }}</td>
              <td>{{ cita.fecha }}</td>
              <td>{{ cita.hora }}</td>
              <td>{{ cita.motivo || "—" }}</td>
              <td>{{ cita.observacions || "—" }}</td>
              <td>{{ textoEstado(cita.estado) }}</td>
              <td class="celda-acciones">
                <div class="acciones-cita">
                  <button
                    type="button"
                    class="secundario"
                    :disabled="cargando || (editandoCita && novaCita._id === cita._id)"
                    :title="editandoCita && novaCita._id === cita._id ? 'Cita seleccionada para editar' : 'Editar cita'"
                    @click="editarCita(cita)"
                  >
                    {{ editandoCita && novaCita._id === cita._id ? "✓" : "Editar" }}
                  </button>
                  <button
                    type="button"
                    class="boton-eliminar"
                    :disabled="cargando"
                    @click="borrarCita(cita)"
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!citasVisibles.length">
              <td colspan="10">No hay citas en este estado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p v-else-if="dniConsultado && !cargando">Non hai citas rexistradas para este DNI.</p>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { getDoctores } from "../api/doctores.js";
import { getPacienteByDni } from "../api/pacientes.js";
import { descargarTablaPdf } from "../utils/pdf.js";
import {
  actualizarCita,
  borrarCita as borrarCitaApi,
  gardarCita,
  obterCitas,
} from "../api/citas.js";
import { usePacienteStore } from "../store/pacienteStore.js";

const pacienteStore = usePacienteStore();
// Sincroniza el contexto de la vista con la selección compartida desde pacientes.
const paciente = computed(() => pacienteStore.pacienteSeleccionado);
const pacienteConsultado = ref(null);
// El nombre se obtiene de la ficha seleccionada o de la consultada por DNI.
const nomePacienteCitas = computed(() => {
  const datosPaciente = paciente.value?.dnipac === dniConsultado.value
    ? paciente.value
    : pacienteConsultado.value;
  return [datosPaciente?.nomepac, datosPaciente?.apelpac].filter(Boolean).join(" ")
    || dniConsultado.value;
});
const doctores = ref([]);
const citas = ref([]);
// Se conserva por separado el valor del selector y el filtro aplicado a la tabla.
const estadoSeleccionado = ref("");
const estadoFiltroAplicado = ref("");
const dniConsultado = ref("");
const citasVisibles = computed(() =>
  estadoFiltroAplicado.value
    ? citas.value.filter((cita) => cita.estado === estadoFiltroAplicado.value)
    : citas.value
);
const pacienteIdentificado = computed(() =>
  Boolean(
    dniConsultado.value &&
      (paciente.value?.dnipac === dniConsultado.value ||
        pacienteConsultado.value?.dnipac === dniConsultado.value)
  )
);
// Estado de carga, mensajes y modo de edición usados por el formulario y sus botones.
const cargando = ref(false);
const mensaxe = ref("");
const erro = ref(false);
const editandoCita = ref(false);
const hoxe = computed(() => new Date().toISOString().slice(0, 10));

const novaCita = reactive({
  _id: "",
  pacienteDNI: "",
  doctorId: "",
  fecha: "",
  hora: "",
  motivo: "",
  observacions: "",
  estado: "pendente",
});

function nomeDoctor(cita) {
  const doctor = cita.doctorId && typeof cita.doctorId === "object"
    ? cita.doctorId
    : doctores.value.find((item) => item._id === cita.doctorId);
  return [doctor?.nomedoc, doctor?.apeldoc].filter(Boolean).join(" ") || "—";
}

function textoEstado(estado) {
  return {
    pendente: "Pendiente",
    realizada: "Realizada",
    cancelada: "Cancelada",
  }[estado] || estado;
}

// Exporta a PDF las citas visibles, conservando el filtro activo en el subtítulo.
function imprimirCitas() {
  const identificadorPaciente = dniConsultado.value;
  const estado = estadoFiltroAplicado.value;

  descargarTablaPdf({
    titulo: `Citas de ${nomePacienteCitas.value}`,
    subtitulo: estado ? `Estado: ${estado}` : "Todos los estados",
    nombreArchivo: `citas-${identificadorPaciente}.pdf`,
    columnas: [
      "ID Cita",
      "DNI Paciente",
      "Doctor",
      "ID Doctor",
      "Fecha",
      "Hora",
      "Motivo de la cita",
      "Observaciones",
      "Estado",
    ],
    filas: citasVisibles.value.map((cita) => [
      cita._id || "",
      cita.pacienteDNI || "",
      nomeDoctor(cita),
      cita.doctorId?._id || cita.doctorId || "",
      cita.fecha || "",
      cita.hora || "",
      cita.motivo || "—",
      cita.observacions || "—",
      textoEstado(cita.estado),
    ]),
  });
}

// Al abrir la vista carga doctores y, si hay paciente seleccionado, sus citas.
onMounted(async () => {
  try {
    doctores.value = await getDoctores();
    if (paciente.value?.dnipac) {
      novaCita.pacienteDNI = paciente.value.dnipac;
      await cargarCitas(paciente.value.dnipac);
    }
  } catch (error) {
    amosarErro(error, "Non se puideron cargar os doutores ou as citas");
  }
});

// Normaliza el DNI escrito y descarta resultados anteriores asociados a otro documento.
function cambiarDni() {
  novaCita.pacienteDNI = novaCita.pacienteDNI.replace(/\s+/g, "").toUpperCase();
  citas.value = [];
  restablecerTablaCitas();
  dniConsultado.value = "";
  pacienteConsultado.value = null;
  mensaxe.value = "";
  erro.value = false;
}

// Carga ficha y citas para un DNI; reutiliza la ficha del store cuando coincide.
async function cargarCitas(dni) {
  if (dniConsultado.value && dniConsultado.value !== dni) {
    restablecerTablaCitas();
  }
  pacienteConsultado.value = paciente.value?.dnipac === dni
    ? paciente.value
    : null;
  if (!pacienteConsultado.value) {
    try {
      pacienteConsultado.value = await getPacienteByDni(dni);
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
    }
  }

  citas.value = await obterCitas(dni);
  dniConsultado.value = dni;
}

// Aplica el estado elegido sin modificar la colección completa de citas.
function filtrarCitasPorEstado() {
  estadoFiltroAplicado.value = estadoSeleccionado.value;
}

// Quita la selección y el filtro aplicado a la tabla.
function restablecerTablaCitas() {
  estadoSeleccionado.value = "";
  estadoFiltroAplicado.value = "";
}

// Consulta citas del DNI del formulario y centraliza los errores mostrados al usuario.
async function consultarCitas() {
  const dni = novaCita.pacienteDNI.trim().toUpperCase();
  if (!dni) return;

  cargando.value = true;
  mensaxe.value = "";
  erro.value = false;
  try {
    await cargarCitas(dni);
  } catch (error) {
    amosarErro(error, "Non se puideron cargar as citas");
  } finally {
    cargando.value = false;
  }
}

// Crea o actualiza la cita según el modo actual y recarga la lista tras guardar.
async function gardarCitaFormulario() {
  cargando.value = true;
  mensaxe.value = "";
  erro.value = false;
  const estabaEditando = editandoCita.value;
  try {
    const datosCita = {
      ...novaCita,
      pacienteDNI: novaCita.pacienteDNI.trim().toUpperCase(),
    };
    const cita = editandoCita.value
      ? await actualizarCita(novaCita._id, datosCita)
      : await gardarCita(datosCita);
    await cargarCitas(cita.pacienteDNI);
    limparCamposCita();
    mensaxe.value = estabaEditando
      ? "Os cambios da cita gardáronse correctamente."
      : "A solicitude de cita gardouse correctamente.";
  } catch (error) {
    amosarErro(error, estabaEditando ? "Non se puideron gardar os cambios da cita" : "Non se puido gardar a cita");
  } finally {
    cargando.value = false;
  }
}

// Copia una fila al formulario para editarla y desplaza la página hasta el formulario.
function editarCita(cita) {
  novaCita._id = cita._id;
  novaCita.pacienteDNI = cita.pacienteDNI;
  novaCita.doctorId = cita.doctorId?._id || cita.doctorId;
  novaCita.fecha = cita.fecha;
  novaCita.hora = cita.hora;
  novaCita.motivo = cita.motivo || "";
  novaCita.observacions = cita.observacions || "";
  novaCita.estado = cita.estado;
  editandoCita.value = true;
  mensaxe.value = "";
  erro.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Pide confirmación, elimina la cita y actualiza la lista del paciente.
async function borrarCita(cita) {
  const identificador = cita._id;
  if (!window.confirm("Seguro que queres borrar esta cita?")) return;

  cargando.value = true;
  mensaxe.value = "";
  erro.value = false;
  try {
    await borrarCitaApi(identificador);
    await cargarCitas(cita.pacienteDNI);
    if (editandoCita.value && novaCita._id === identificador) {
      limparCamposCita();
    }
    mensaxe.value = "A cita borrouse correctamente.";
  } catch (error) {
    amosarErro(error, "Non se puido borrar a cita");
  } finally {
    cargando.value = false;
  }
}

// Restablece los campos de la cita sin borrar el paciente contextual.
function limparCamposCita() {
  novaCita._id = "";
  novaCita.pacienteDNI = paciente.value?.dnipac || "";
  novaCita.doctorId = "";
  novaCita.fecha = "";
  novaCita.hora = "";
  novaCita.motivo = "";
  novaCita.observacions = "";
  novaCita.estado = "pendente";
  editandoCita.value = false;
}

// Limpia toda la vista y también la selección global del paciente.
function limparFormulario() {
  limparCamposCita();
  novaCita.pacienteDNI = "";
  citas.value = [];
  dniConsultado.value = "";
  pacienteConsultado.value = null;
  pacienteStore.limpiarPaciente();
  restablecerTablaCitas();
  mensaxe.value = "";
  erro.value = false;
}

// Convierte errores HTTP y de red en mensajes adecuados para mostrar en la interfaz.
function amosarErro(error, mensaxePorDefecto) {
  erro.value = true;
  const resposta = error.response?.data;
  if (error.response?.status === 404 && typeof resposta === "string") {
    mensaxe.value = "A ruta de citas non está dispoñible. Reinicia o servidor backend.";
    return;
  }
  mensaxe.value = resposta?.mensaje || mensaxePorDefecto;
}
</script>

<style scoped>
/* Contenedor principal, formulario y ficha del paciente. */
.xestion-citas {
  width: 100%;
  text-align: left;
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

h2 {
  margin: 0 0 1rem;
  padding: 0.5rem;
  font-weight: 600;
  text-align: center;
  background-color: var(--heading-bg);
  color: var(--text-h);
}

.aviso {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  background: var(--surface-muted);
  border-left: 4px solid var(--accent);
  line-height: 1.5;
}

.paciente-seleccionado,
.formulario-cita {
  margin: 1rem 0 1.5rem;
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.paciente-seleccionado {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 1rem;
}

.paciente-seleccionado h3 {
  flex-basis: 100%;
  margin: 0 0 0.5rem;
  padding: 0.4rem 0.6rem;
  color: var(--text-h);
  background: var(--heading-bg);
}

.paciente-seleccionado p {
  margin: 0.35rem 0;
}

.campos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.campo {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
}

.campo label {
  font-weight: 500;
}

.obrigatorio,
.nota-obrigatorio span {
  color: #b00020;
}

.obrigatorio {
  margin-left: 0.15rem;
}

.nota-obrigatorio {
  margin: -0.5rem 0 1rem;
  text-align: right;
  font-size: 0.8rem;
}

input,
select,
textarea {
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  box-sizing: border-box;
  border: 1px solid #767676;
  border-radius: 6px;
  font: inherit;
}

.campo textarea {
  resize: vertical;
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

td.celda-acciones {
  white-space: nowrap;
}

.acciones-cita {
  display: flex;
  gap: 0.4rem;
}

/* Controles compartidos, mensajes de estado y acciones principales. */
button {
  padding: 0.45rem 1rem;
  border: 0;
  border-radius: 6px;
  color: white;
  background: var(--accent);
  cursor: pointer;
}

button:disabled {
  cursor: wait;
  opacity: 0.7;
}

button.secundario.boton-seleccionado {
  min-width: 4.5rem;
  color: #198754;
  font-size: 1.1em;
  font-weight: 700;
  opacity: 1;
  cursor: default;
}

button.secundario {
  color: var(--text-h);
  background: var(--accent-soft);
}

button.boton-eliminar {
  background: #b00020;
}

.mensaxe {
  color: var(--accent-dark);
}

.mensaxe.erro {
  color: #b00020;
}

.listaxe {
  margin-top: 2rem;
}

/* Filtros, encabezado y tabla con desplazamiento para pantallas estrechas. */
.listaxe-filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.listaxe-filtros select {
  min-width: 12rem;
  max-width: 100%;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  background: white;
}

.listaxe-cabecera {
  width: 100%;
  margin: 1rem 0 0.75rem;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background: var(--heading-bg);
  border-bottom: 2px solid var(--accent);
}

.listaxe-cabecera h3 {
  margin: 0;
  text-align: center;
}

.nome-paciente-listaxe {
  color: #b00020;
}

.tabla-contenedor {
  width: 100%;
  max-width: 100%;
  max-height: 60vh;
  overflow: auto;
  overscroll-behavior: contain;
}

.tabla-contenedor:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

table {
  width: 100%;
  min-width: 64rem;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid var(--border);
}

th,
td {
  border: 1px solid var(--border);
  padding: 0.7rem;
  text-align: left;
}

th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--accent-soft);
}

td:last-child {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .xestion-citas {
    padding: 1rem;
  }

  .paciente-seleccionado,
  .formulario-cita {
    padding: 1rem;
  }

  .tabla-contenedor {
    max-height: 60vh;
  }
}
</style>
