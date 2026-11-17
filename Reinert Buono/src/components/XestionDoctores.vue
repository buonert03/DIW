<template>
  <div class="xestion-doctores">
    <h3>🩺 Xestión de doctores</h3>
    <!-- El formulario cambia entre alta y edición según el doctor cargado. -->
    <form @submit.prevent="guardarDoctor">
      <!-- fila 1: identificador, apelido, nome e colexiado -->
      <div class="fila">
        <div class="campo campo-id">
          <label for="id-doctor">ID Doctor</label>
          <div class="dni-cabecera">
            <input id="id-doctor" :value="idDoctorEditado || 'Xerarase ao gardar'" type="text" disabled>
            <button type="button" @click="limpiarFormdoc" title="Limpar formulario" aria-label="Limpar formulario">
              🧹
            </button>
          </div>
        </div>
        <div class="campo campo-apellido">
          <label for="apelido">Apelido:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="apelido" v-model="novoDoctor.apeldoc" type="text" required autocomplete="family-name"
            @blur="novoDoctor.apeldoc = formatearNome(novoDoctor.apeldoc)" />
        </div>
        <div class="campo campo-nome">
          <label for="nome">Nome:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="nome" v-model="novoDoctor.nomedoc" type="text" required autocomplete="given-name"
            @blur="novoDoctor.nomedoc = formatearNome(novoDoctor.nomedoc)" />
        </div>
        <!-- fieldset + legend: os lectores de pantalla len "Colexiado" antes de Si/Non -->
        <fieldset class="campo campo-colexiado">
          <legend>
            Colexiado:<span class="obrigatorio" aria-hidden="true">*</span>
          </legend>
          <label><input v-model="novoDoctor.coledoc" type="radio" name="coledoc" :value="true" />
            Si</label>
          <label><input v-model="novoDoctor.coledoc" type="radio" name="coledoc" :value="false" />
            Non</label>
        </fieldset>
      </div>
      <!-- fila 2: teléfono, correo e especialidade -->
      <div class="fila">
        <div class="campo campo-telefono">
          <label for="telefono">Telefono:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="telefono" v-model="novoDoctor.movildoc" type="tel" inputmode="numeric" required maxlength="9"
            autocomplete="tel" class="centrado" :class="{ 'campo-erro': telefonoIncorrecto }"
            :aria-invalid="telefonoIncorrecto" aria-describedby="telefono-erro" @focus="telefonoIncorrecto = false"
            @blur="validarTelefono" />
          <span v-if="telefonoIncorrecto" id="telefono-erro" class="mensaxe-erro" role="alert">Telefono non
            válido</span>
        </div>
        <div class="campo campo-correo">
          <label for="correo">Correo:</label>
          <input id="correo" v-model="novoDoctor.maildoc" type="email" autocomplete="email"
            :class="{ 'campo-erro': correoInvalido }" :aria-invalid="correoInvalido" aria-describedby="correo-erro"
            @focus="correoInvalido = false" @blur="validarCorreo" />
          <span v-if="correoInvalido" id="correo-erro" class="mensaxe-erro" role="alert">Correo non válido</span>
        </div>
        <div class="campo campo-especialidade">
          <div class="especialidade-cabecera">
            <label for="especialidade">Especialidade:<span class="obrigatorio" aria-hidden="true">*</span></label>
            <div class="especialidade-acciones">
              <button
                type="button"
                class="btn-buscar-especialidade"
                :disabled="!novoDoctor.espedoc || buscandoEspecialidade"
                :aria-label="`Buscar doctores de ${novoDoctor.espedoc || 'la especialidad seleccionada'}`"
                title="Buscar doctores por especialidad"
                @click="buscarPorEspecialidade"
              >
                {{ buscandoEspecialidade ? "…" : "🔍" }}
              </button>
              <button
                type="button"
                class="btn-restablecer-especialidade"
                :disabled="!especialidadeBuscada || buscandoEspecialidade"
                aria-label="Mostrar todos los doctores"
                title="Restablecer tabla"
                @click="restablecerTablaDoctores"
              >
                ↺
              </button>
            </div>
          </div>
          <select id="especialidade" v-model="novoDoctor.espedoc" required>
            <option value="">Selecciona unha especialidade</option>
            <option v-for="especialidade in especialidades" :key="especialidade.id" :value="especialidade.nm">
              {{ especialidade.nm }}
            </option>
          </select>
        </div>
      </div>
      <div class="fila fila-gardar">
        <button type="submit" class="btn-guardar" :disabled="novoDoctor.nomedoc === '' ||
          novoDoctor.apeldoc === '' ||
          novoDoctor.movildoc === '' ||
          novoDoctor.espedoc === ''
          ">
          {{ editando ? "Gardar cambios" : "Gardar" }}
        </button>
        <button v-if="editando" type="button" class="btn-cancelar" @click="limpiarFormdoc">
          Cancelar edición
        </button>
        <p class="nota-obrigatorio">
          <span aria-hidden="true">*</span> campo obrigatorio
        </p>
      </div>
    </form>
    <!-- La tabla refleja todos los doctores o el resultado de filtrar por especialidad. -->
    <div class="listaxe-cabecera">
      <h3>📋 Listaxe de doctores</h3>
      <button type="button" class="btn-imprimir" @click="imprimirDoctores">Imprimir</button>
    </div>
    <div v-if="doctores.length > 0" class="tabla-contenedor" role="region" aria-label="Listaxe de doctores"
      tabindex="0">
      <table>
        <caption>
          Listaxe de doctores
        </caption>
        <colgroup>
          <col class="col-numero">
          <col class="col-id">
          <col class="col-apelido">
          <col class="col-nome">
          <col class="col-colexiado">
          <col class="col-telefono">
          <col class="col-especialidade">
          <col class="col-acciones">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Nº</th>
            <th scope="col">ID</th>
            <th scope="col">Apelido</th>
            <th scope="col">Nome</th>
            <th scope="col">Colexiado</th>
            <th scope="col">Telefono</th>
            <th scope="col">Especialidade</th>
            <th scope="col">Accións</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in doctores" :key="index">
            <!-- números (nº, ID, teléfono) centrados; o texto queda á esquerda -->
            <td class="centrado">{{ index + 1 }}</td>
            <td class="centrado">{{ d._id }}</td>
            <td>{{ d.apeldoc }}</td>
            <td>{{ d.nomedoc }}</td>
            <td>{{ d.coledoc ? "Si" : "Non" }}</td>
            <td class="centrado">{{ d.movildoc }}</td>
            <td>{{ d.espedoc }}</td>
            <td class="centrado">
              <div class="acciones-doctor">
                <button
                  :class="{ 'boton-seleccionado': editando && idDoctorEditado === d._id }"
                  :disabled="editando && idDoctorEditado === d._id"
                  :title="editando && idDoctorEditado === d._id ? 'Doctor seleccionado para editar' : 'Editar'"
                  :aria-label="editando && idDoctorEditado === d._id ? `Doctor ${d.nomedoc} ${d.apeldoc} seleccionado para editar` : `Editar a ${d.nomedoc} ${d.apeldoc}`"
                  @click="editarDoctor(index)"
                >
                  {{ editando && idDoctorEditado === d._id ? "✓" : "✏️" }}
                </button>
                <button @click="eliminarDoctor(index)" title="Eliminar"
                  :aria-label="`Eliminar a ${d.nomedoc} ${d.apeldoc}`">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="especialidadeBuscada">Non hai doctores de {{ especialidadeBuscada }}.</p>
    <p v-else>Non hai doctores cargados.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { obtenerEspecialidades } from "../api/especialidades.js";
import { descargarTablaPdf } from "../utils/pdf.js";
import { useDoctorStore } from "../store/doctorStore.js";
import {
  getDoctores,
  getDoctorByEspecialidad,
  saveDoctor,
  deleteDoctor,
  modifyDoctor,
} from "../api/doctores.js";

// Registros e opcións que se amosan na táboa e no selector.
const doctores = ref([]);
const especialidades = ref([]);

// Estado de edición e erros de validación do formulario.
const editando = ref(false);
const correoInvalido = ref(false);
const telefonoIncorrecto = ref(false);
const buscandoEspecialidade = ref(false);
const especialidadeBuscada = ref("");
const idDoctorEditado = ref("");

// Valores ligados aos controis do formulario.
const novoDoctor = reactive({
  apeldoc: "",
  nomedoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: false,
  espedoc: "",
});

// Exporta el listado actual; el nombre del archivo incluye la especialidad si hay filtro.
function imprimirDoctores() {
  const especialidad = especialidadeBuscada.value;
  const sufijo = especialidad
    ? `-${especialidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
    : "";

  descargarTablaPdf({
    titulo: especialidad ? `Doctores de ${especialidad}` : "Listaxe de doctores",
    nombreArchivo: `doctores${sufijo}.pdf`,
    columnas: ["Nº", "ID", "Apelido", "Nome", "Colexiado", "Telefono", "Especialidade"],
    filas: doctores.value.map((doctor, index) => [
      index + 1,
      doctor._id || "",
      doctor.apeldoc || "",
      doctor.nomedoc || "",
      doctor.coledoc ? "Si" : "Non",
      doctor.movildoc || "",
      doctor.espedoc || "",
    ]),
  });
}

// Carga los doctores y el catálogo de especialidades al abrir la vista.
onMounted(async () => {
  doctores.value = await getDoctores();
  especialidadeBuscada.value = "";
  especialidades.value = await obtenerEspecialidades();
});

// Consulta la API con la especialidad seleccionada y conserva ese filtro visible.
async function buscarPorEspecialidade() {
  const especialidad = novoDoctor.espedoc;
  if (!especialidad || buscandoEspecialidade.value) return;

  buscandoEspecialidade.value = true;
  try {
    doctores.value = await getDoctorByEspecialidad(especialidad);
    especialidadeBuscada.value = especialidad;
  } catch (error) {
    console.error("Erro ao buscar doutores por especialidade:", error);
    window.alert(error.response?.data?.mensaje || "Non se puideron buscar os doutores.");
  } finally {
    buscandoEspecialidade.value = false;
  }
}

// Vuelve a cargar todos los doctores y elimina el filtro de especialidad aplicado.
async function restablecerTablaDoctores() {
  if (!especialidadeBuscada.value || buscandoEspecialidade.value) return;

  buscandoEspecialidade.value = true;
  try {
    doctores.value = await getDoctores();
    especialidadeBuscada.value = "";
  } catch (error) {
    console.error("Erro ao restablecer a listaxe de doutores:", error);
    window.alert(error.response?.data?.mensaje || "Non se puido restablecer a listaxe.");
  } finally {
    buscandoEspecialidade.value = false;
  }
}

// Comparte la selección actual mediante el store de Pinia.
function seleccionarDoctor(doctor) {
  const doctorStore = useDoctorStore();
  doctorStore.seleccionarDoctor(doctor);
}

// Normaliza el uso de mayúsculas en cada palabra del nombre o apellido.
function formatearNome(valor) {
  return valor
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
}

// Normaliza el correo y marca el campo si no tiene un formato válido.
function validarCorreo() {
  const valor = novoDoctor.maildoc.trim().toLowerCase();
  correoInvalido.value =
    valor !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  if (correoInvalido.value) {
    novoDoctor.maildoc = "";
  } else {
    novoDoctor.maildoc = valor;
  }
}

// Comprueba que el teléfono tenga nueve cifras y empiece por 6 o 7.
function validarTelefono() {
  const valor = novoDoctor.movildoc.trim();
  telefonoIncorrecto.value = valor !== "" && !/^[67]\d{8}$/.test(valor);

  if (telefonoIncorrecto.value) {
    novoDoctor.movildoc = "";
  } else {
    novoDoctor.movildoc = valor;
  }
}

// Reinicia los campos, los errores de validación y el modo de edición.
const limpiarFormdoc = () => {
  Object.keys(novoDoctor).forEach((key) => {
    if (typeof novoDoctor[key] === "boolean") {
      novoDoctor[key] = false;
    } else {
      novoDoctor[key] = "";
    }
  });
  editando.value = false;
  idDoctorEditado.value = "";
  correoInvalido.value = false;
  telefonoIncorrecto.value = false;
};

// Valida datos y crea o actualiza el doctor; luego recarga el listado.
async function guardarDoctor() {
  validarTelefono();
  validarCorreo();
  if (
    telefonoIncorrecto.value ||
    correoInvalido.value ||
    !novoDoctor.nomedoc ||
    !novoDoctor.apeldoc ||
    !novoDoctor.espedoc
  ) {
    return;
  }

  const datosDoctor = { ...novoDoctor };
  try {
    if (editando.value) {
      await modifyDoctor(idDoctorEditado.value, datosDoctor);
    } else {
      await saveDoctor(datosDoctor);
    }
    doctores.value = await getDoctores();
    especialidadeBuscada.value = "";
    limpiarFormdoc();
  } catch (error) {
    console.error("Erro ao gardar o doutor:", error);
    window.alert(error.response?.data?.mensaje || "Non se puido gardar o doutor.");
  }
}

// Copia un elemento de la tabla al formulario y activa el modo de edición.
function editarDoctor(index) {
  Object.assign(novoDoctor, doctores.value[index]);
  delete novoDoctor._id;
  delete novoDoctor.__v;
  editando.value = true;
  idDoctorEditado.value = doctores.value[index]._id;
  correoInvalido.value = false;
  telefonoIncorrecto.value = false;
  seleccionarDoctor(doctores.value[index]);
}

// Solicita confirmación antes de eliminar y actualiza la lista tras la respuesta.
async function eliminarDoctor(index) {
  const doctor = doctores.value[index];
  if (!window.confirm(`Seguro que queres eliminar a ${doctor.nomedoc} ${doctor.apeldoc}?`)) {
    return;
  }

  try {
    await deleteDoctor(doctor._id);
    doctores.value = await getDoctores();
    especialidadeBuscada.value = "";
    if (idDoctorEditado.value === doctor._id) {
      limpiarFormdoc();
    }
  } catch (error) {
    console.error("Erro ao eliminar o doutor:", error);
    window.alert(error.response?.data?.mensaje || "Non se puido eliminar o doutor.");
  }
}
</script>

<style scoped>
/* Contenedor y reglas de distribución del formulario adaptable. */
.xestion-doctores {
  width: 100%;
  text-align: left; /* #app centra todo; aquí o texto vai á esquerda (táboa incluída) */
  background: white;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

h3 {
  margin-bottom: 1rem;
  font-weight: 600;
  background-color: var(--heading-bg);
  color: var(--text-h); /* texto escuro: o branco sobre este verde só tiña contraste 2:1 */
  text-align: center;
}

/* ---------- formulario ---------- */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fila {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.campo {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
}

.dni-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.especialidade-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.especialidade-acciones {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-buscar-especialidade,
.btn-restablecer-especialidade {
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-h);
  background: var(--accent-soft);
  cursor: pointer;
}

.btn-buscar-especialidade:disabled,
.btn-restablecer-especialidade:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.campo label {
  font-weight: 500;
}

.campo > input {
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #767676;
  /* contraste mínimo 3:1 para que se vexa o campo */
  border-radius: 6px;
  box-sizing: border-box;
}

/* os select coa mesma altura que os input */
.campo select {
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  box-sizing: border-box;
}

/* botóns de icona (🔍 🧹 ✏️ 🗑️): mesmo ancho, e o alto igual ao ancho (cadrados) */
.dni-acciones button,
td button {
  aspect-ratio: 1;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.campo-colexiado {
  /* A lenda ocupa a primeira fila; as dúas opcións comparten a segunda. */
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-content: start;
  justify-content: start;
  column-gap: 1rem;
  row-gap: 0.35rem;
  min-width: 0;
  border: none;
  margin: 0;
  padding: 0;
}

.campo-colexiado legend {
  grid-column: 1 / -1;
  font-weight: 500;
}

.campo-colexiado > label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.campo-colexiado input {
  width: auto;
}

/* ---------- validación ---------- */
input.campo-erro {
  border-color: #b00020;
  background-color: #ffe6e6;
}

.mensaxe-erro {
  font-size: 0.8rem;
  color: #b00020;
}

.mensaxe-dni {
  font-size: 0.85rem;
  font-weight: 500;
}

.mensaxe-dni--existe,
.mensaxe-dni--erro {
  color: #b00020;
}

.mensaxe-dni--libre {
  color: #237a3b;
}

.aviso-dni-enter-active,
.aviso-dni-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.aviso-dni-enter-from,
.aviso-dni-leave-to {
  opacity: 0;
  transform: translateY(-0.3rem);
}

/* asterisco de campo obrigatorio */
.obrigatorio {
  color: #b00020;
  margin-left: 0.15rem;
}

/* ---------- fila de gardar: botón centrado, nota á dereita ---------- */
.fila-gardar {
  position: relative;
  display: flex;
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.btn-guardar {
  background-color: var(--accent);
  color: white;
  border: none;
  padding: 0.4rem 1.5rem;
  cursor: pointer;
}

.btn-cancelar {
  padding: 0.4rem 1rem;
  border: 0;
  border-radius: 6px;
  color: var(--text-h);
  background: var(--accent-soft);
  cursor: pointer;
}

.btn-guardar:hover:enabled {
  background-color: var(--accent-dark);
}

.btn-guardar:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

.nota-obrigatorio {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 0;
  font-size: 0.7rem;
}

/* ---------- táboa ---------- */
.listaxe-cabecera {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  box-sizing: border-box;
  background-color: var(--heading-bg);
}

.listaxe-cabecera h3 {
  flex: 1;
  margin: 0;
  background: transparent;
}

.btn-imprimir {
  padding: 0.45rem 1rem;
  border: 0;
  border-radius: 6px;
  color: white;
  background: var(--accent);
  cursor: pointer;
}

.dni-acciones {
  display: flex;
  gap: 0.4rem;
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
  min-width: 46rem;
  table-layout: fixed;
  margin-top: 1rem;
  font-size: 0.78rem;
  border: 1px solid var(--border);
  border-collapse: collapse;
}

.col-numero { width: 5%; }
.col-id { width: 19%; }
.col-apelido { width: 14%; }
.col-nome { width: 12%; }
.col-colexiado { width: 10%; }
.col-telefono { width: 13%; }
.col-especialidade { width: 15%; }
.col-acciones { width: 12%; }

th,
td {
  border: 1px solid var(--border);
  padding: 0.55rem;
}

th {
  background-color: var(--accent-soft);
  position: sticky;
  top: 0;
  z-index: 1;
}

td:last-child {
  white-space: nowrap;
}

.col-id,
.col-especialidade {
  overflow-wrap: anywhere;
}

.acciones-doctor {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.boton-seleccionado {
  color: #198754;
  font-size: 1.25em;
  font-weight: 700;
  opacity: 1;
  cursor: default;
}

/* o caption só o len os lectores de pantalla (xa hai un título visible enriba) */
caption {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .xestion-doctores {
    padding: 1rem;
  }

  .listaxe-cabecera {
    gap: 0.5rem;
  }
}
</style>
