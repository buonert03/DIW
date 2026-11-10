<template>
  <main class="xestion-citas">
    <h2>Solicitude de citas</h2>
    <p class="aviso">
      Modo de prácticas: o DNI úsase para asociar e consultar as citas, sen verificar a identidade.
    </p>

    <section v-if="paciente" class="paciente-seleccionado">
      <h3>Paciente seleccionado</h3>
      <p><strong>Nome:</strong> {{ paciente.nomepac }} {{ paciente.apelpac }}</p>
      <p><strong>DNI/NIE:</strong> {{ paciente.dnipac }}</p>
      <p v-if="paciente.movilpac"><strong>Teléfono:</strong> {{ paciente.movilpac }}</p>
      <p v-if="paciente.mailpac"><strong>Correo:</strong> {{ paciente.mailpac }}</p>
    </section>

    <form class="formulario-cita" @submit.prevent="gardarCitaFormulario">
      <div class="campos">
        <div class="campo">
          <label for="id-cita">ID Cita</label>
          <input id="id-cita" :value="novaCita.idcita || 'Xerarase ao gardar'" type="text" disabled>
        </div>
        <div class="campo">
          <label for="dni">DNI Paciente</label>
          <input
            id="dni"
            v-model.trim="novaCita.dnipac"
            type="text"
            autocomplete="off"
            required
            :readonly="Boolean(paciente)"
            @input="cambiarDni"
          >
        </div>
        <div class="campo">
          <label for="doctor">Nome Doctor</label>
          <select
            id="doctor"
            v-model="novaCita.iddoc"
            required
            @change="seleccionarDoctor"
          >
            <option value="">Selecciona un doutor</option>
            <option v-for="doctor in doctores" :key="doctor.iddoc" :value="doctor.iddoc">
              {{ doctor.nomedoc }} {{ doctor.apeldoc }}
            </option>
          </select>
        </div>
        <div class="campo">
          <label for="id-doctor">ID Doctor</label>
          <input id="id-doctor" :value="novaCita.iddoc" type="text" disabled>
        </div>
        <div class="campo">
          <label for="fecha">Fecha</label>
          <input id="fecha" v-model="novaCita.fecha" type="date" :min="hoxe" required>
        </div>
        <div class="campo">
          <label for="hora">Hora</label>
          <input id="hora" v-model="novaCita.hora" type="time" required>
        </div>
        <div class="campo campo-motivo">
          <label for="motivo">Motivo de la cita</label>
          <textarea id="motivo" v-model.trim="novaCita.motivo" rows="3" maxlength="500"></textarea>
        </div>
        <div class="campo">
          <label for="estado">Estado</label>
          <select id="estado" v-model="novaCita.estado" required>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

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
          class="secundario"
          :disabled="cargando || !novaCita.dnipac"
          @click="consultarCitas"
        >
          Ver citas
        </button>
      </div>
    </form>

    <p v-if="mensaxe" :class="['mensaxe', { erro }]" :role="erro ? 'alert' : 'status'">
      {{ mensaxe }}
    </p>
    <div v-if="citas.length" class="listaxe">
      <div class="listaxe-cabecera">
        <h3>Listaxe de citas de {{ paciente?.dnipac || dniConsultado }}</h3>
      </div>
      <div class="tabla-contenedor" role="region" aria-label="Citas do paciente" tabindex="0">
        <table>
          <caption>Citas de {{ paciente?.dnipac || dniConsultado }}</caption>
          <thead>
            <tr>
              <th scope="col">ID Cita</th>
              <th scope="col">DNI Paciente</th>
              <th scope="col">Nombre Doctor</th>
              <th scope="col">ID Doctor</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Motivo de la cita</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cita in citas" :key="cita.idcita || cita._id">
              <td>{{ cita.idcita || cita._id }}</td>
              <td>{{ cita.dnipac }}</td>
              <td>{{ cita.nomedoc }}</td>
              <td>{{ cita.iddoc }}</td>
              <td>{{ cita.fecha }}</td>
              <td>{{ cita.hora }}</td>
              <td>{{ cita.motivo || "—" }}</td>
              <td>{{ cita.estado }}</td>
              <td class="celda-acciones">
                <div class="acciones-cita">
                  <button
                    type="button"
                    class="secundario"
                    :disabled="cargando"
                    @click="editarCita(cita)"
                  >
                    Editar
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
import {
  actualizarCita,
  borrarCita as borrarCitaApi,
  gardarCita,
  obterCitas,
} from "../api/citas.js";
import { usePacienteStore } from "../store/pacienteStore.js";

const pacienteStore = usePacienteStore();
const paciente = computed(() => pacienteStore.pacienteSeleccionado);
const doctores = ref([]);
const citas = ref([]);
const dniConsultado = ref("");
const cargando = ref(false);
const mensaxe = ref("");
const erro = ref(false);
const editandoCita = ref(false);
const hoxe = computed(() => new Date().toISOString().slice(0, 10));

const novaCita = reactive({
  idcita: "",
  dnipac: "",
  nomedoc: "",
  iddoc: "",
  fecha: "",
  hora: "",
  motivo: "",
  estado: "Pendiente",
});

onMounted(async () => {
  try {
    doctores.value = await getDoctores();
    if (paciente.value?.dnipac) {
      novaCita.dnipac = paciente.value.dnipac;
      await cargarCitas(paciente.value.dnipac);
    }
  } catch (error) {
    amosarErro(error, "Non se puideron cargar os doutores ou as citas");
  }
});

function seleccionarDoctor() {
  const doctor = doctores.value.find((item) => item.iddoc === novaCita.iddoc);
  novaCita.nomedoc = doctor ? `${doctor.nomedoc} ${doctor.apeldoc}`.trim() : "";
}

function cambiarDni() {
  citas.value = [];
  dniConsultado.value = "";
  mensaxe.value = "";
  erro.value = false;
}

async function cargarCitas(dni) {
  citas.value = await obterCitas(dni);
  dniConsultado.value = dni;
}

async function consultarCitas() {
  const dni = novaCita.dnipac.trim().toUpperCase();
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

async function gardarCitaFormulario() {
  cargando.value = true;
  mensaxe.value = "";
  erro.value = false;
  const estabaEditando = editandoCita.value;
  try {
    const datosCita = {
      ...novaCita,
      dnipac: novaCita.dnipac.trim().toUpperCase(),
    };
    const cita = editandoCita.value
      ? await actualizarCita(novaCita.idcita, datosCita)
      : await gardarCita(datosCita);
    await cargarCitas(cita.dnipac);
    limparFormulario();
    mensaxe.value = estabaEditando
      ? "Os cambios da cita gardáronse correctamente."
      : "A solicitude de cita gardouse correctamente.";
  } catch (error) {
    amosarErro(error, estabaEditando ? "Non se puideron gardar os cambios da cita" : "Non se puido gardar a cita");
  } finally {
    cargando.value = false;
  }
}

function editarCita(cita) {
  novaCita.idcita = cita.idcita || cita._id;
  novaCita.dnipac = cita.dnipac;
  novaCita.nomedoc = cita.nomedoc;
  novaCita.iddoc = cita.iddoc;
  novaCita.fecha = cita.fecha;
  novaCita.hora = cita.hora;
  novaCita.motivo = cita.motivo || "";
  novaCita.estado = cita.estado;
  editandoCita.value = true;
  mensaxe.value = "";
  erro.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function borrarCita(cita) {
  const identificador = cita.idcita || cita._id;
  if (!window.confirm("Seguro que queres borrar esta cita?")) return;

  cargando.value = true;
  mensaxe.value = "";
  erro.value = false;
  try {
    await borrarCitaApi(identificador);
    await cargarCitas(cita.dnipac);
    if (editandoCita.value && novaCita.idcita === identificador) {
      limparFormulario();
    }
    mensaxe.value = "A cita borrouse correctamente.";
  } catch (error) {
    amosarErro(error, "Non se puido borrar a cita");
  } finally {
    cargando.value = false;
  }
}

function limparFormulario() {
  novaCita.idcita = "";
  novaCita.dnipac = paciente.value?.dnipac || "";
  novaCita.nomedoc = "";
  novaCita.iddoc = "";
  novaCita.fecha = "";
  novaCita.hora = "";
  novaCita.motivo = "";
  novaCita.estado = "Pendiente";
  editandoCita.value = false;
  if (!paciente.value) {
    novaCita.dnipac = "";
  }
  mensaxe.value = "";
  erro.value = false;
}

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
.xestion-citas {
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2,
h3 {
  color: var(--text-h);
}

.aviso {
  max-width: 55rem;
}

.paciente-seleccionado,
.formulario-cita {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.paciente-seleccionado {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 1.5rem;
}

.paciente-seleccionado h3 {
  flex-basis: 100%;
  margin-top: 0;
}

.campos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.campo {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.campo-motivo {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  width: 100%;
  min-width: 0;
  padding: 0.65rem;
  box-sizing: border-box;
  border: 1px solid #767676;
  border-radius: 6px;
  font: inherit;
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

td.celda-acciones {
  white-space: nowrap;
}

.acciones-cita {
  display: flex;
  gap: 0.4rem;
}

button {
  padding: 0.6rem 1rem;
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

.listaxe-cabecera {
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background: var(--heading-bg);
}

.listaxe-cabecera h3 {
  margin: 0;
  text-align: center;
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
  font-size: 0.9rem;
}

th,
td {
  padding: 0.7rem;
  border: 1px solid var(--border);
  text-align: left;
}

th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--accent-soft);
}

@media (max-width: 768px) {
  .xestion-citas {
    padding: 1rem;
  }

  .paciente-seleccionado,
  .formulario-cita {
    padding: 1rem;
  }
}
</style>
