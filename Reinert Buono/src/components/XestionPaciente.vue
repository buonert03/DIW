<template>
  <div class="xestion-pacientes">
    <h3>👥  Xestión de pacientes</h3>
    <form @submit.prevent="guardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <div class="dni-cabecera">
            <label for="dni">DNI/NIE:<span class="obrigatorio" aria-hidden="true">*</span></label>
            <div class="dni-acciones">
              <button type="button" @click="buscarPaciente" :disabled="editando" title="Buscar" aria-label="Buscar paciente por DNI">🔍</button>
              <button type="button" @click="limpiarFormpac" title="Limpar formulario" aria-label="Limpar formulario">🧹</button>
            </div>
          </div>
          <input
            id="dni"
            v-model="novoPaciente.dnipac"
            type="text"
            required
            autocomplete="off"
            class="centrado"
            :class="{ 'campo-erro': documentoInvalido }"
            :aria-invalid="documentoInvalido"
            aria-describedby="dni-erro"
            :disabled="editando"
            @focus="limparComprobacionDocumento"
            @input="limparComprobacionDocumento"
            @blur="aoPerderFocoDocumento"/>
          <!-- :disabled="editando" → cando cargamos un paciente (✏️ ou 🔍) o DNI vese pero non se pode cambiar; 🧹 desbloquéao -->
          <span v-if="documentoInvalido" id="dni-erro" class="mensaxe-erro" role="alert">DNI/NIE non válido</span>
          <Transition name="aviso-dni">
            <span
              v-if="comprobacionDocumento"
              :class="['mensaxe-dni', `mensaxe-dni--${comprobacionDocumento}`]"
              role="status"
            >
              {{ textoComprobacionDocumento }}
            </span>
          </Transition>
        </div>
        <div class="campo campo-apellido">
          <label for="apelido">Apelido:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="apelido" v-model="novoPaciente.apelpac" type="text" required autocomplete="family-name"
          @blur="novoPaciente.apelpac = formatearNome(novoPaciente.apelpac)"/>
        </div>
        <div class="campo campo-nome">
          <label for="nome">Nome:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input id="nome" v-model="novoPaciente.nomepac" type="text" required autocomplete="given-name"
          @blur="novoPaciente.nomepac = formatearNome(novoPaciente.nomepac)"/>
        </div>
      </div>
      <div class="fila">
        <div class="campo campo-nacimiento">
          <label for="nacemento">Fecha nacemento:</label>
          <input id="nacemento" v-model="novoPaciente.nacipac" type="date" autocomplete="bday" class="centrado" />
        </div>
        <div class="campo campo-correo">
          <label for="correo">Correo:</label>
          <input
            id="correo"
            v-model="novoPaciente.mailpac"
            type="email"
            autocomplete="email"
            :class="{ 'campo-erro': correoInvalido }"
            :aria-invalid="correoInvalido"
            aria-describedby="correo-erro"
            @focus="correoInvalido = false"
            @blur="validarCorreo"
          />
          <span v-if="correoInvalido" id="correo-erro" class="mensaxe-erro" role="alert">Correo non válido</span>
        </div>
        <div class="campo campo-telefono">
          <label for="telefono">Telefono:<span class="obrigatorio" aria-hidden="true">*</span></label>
          <input
            id="telefono"
            v-model="novoPaciente.movilpac"
            type="tel"
            inputmode="numeric"
            required
            maxlength="9"
            autocomplete="tel"
            class="centrado"
            :class="{ 'campo-erro': telefonoIncorrecto }"
            :aria-invalid="telefonoIncorrecto"
            aria-describedby="telefono-erro"
            @focus="telefonoIncorrecto = false"
            @blur="validarTelefono"
          />
          <span v-if="telefonoIncorrecto" id="telefono-erro" class="mensaxe-erro" role="alert">Telefono non válido</span>
        </div>
      </div>
      <div class="fila">
        <div class="campo">
          <label for="direccion">Dirección:</label>
          <input id="direccion" v-model="novoPaciente.dirpac" type="text" autocomplete="street-address" />
        </div>
        <div class="campo campo-provincia">
          <label for="provincia">Provincia:</label>
          <!-- @change: ao cambiar de provincia baleiramos o municipio (se non, quedaría gardado o da provincia anterior) e cargamos os novos municipios -->
          <select id="provincia" v-model="novoPaciente.propac" @change="novoPaciente.munipac = ''; cargarMunicipios()">
            <option value="">Selecciona una provincia</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.nm">
              {{ provincia.nm }}
            </option>
          </select>
        </div>
        <div class="campo campo-municipio">
          <label for="municipio">Municipio:</label>
          <select id="municipio" v-model="novoPaciente.munipac">
            <option value="">Selecciona un municipio</option>
            <option v-for="municipio in municipios" :key="municipio.id" :value="municipio.nm">
              {{ municipio.nm }}
            </option>
          </select>
        </div>
      </div>
      <div class="fila fila-gardar">
        <label>
          <input v-model="novoPaciente.lopdpac" type="checkbox" />Acceptar a 
          <a :href="$router.resolve({ name: 'PoliticaPrivacidad'}).href" target="_blank" rel="noopener noreferrer">
            Politica de privacidade e confidencialidade.
          </a>
        </label>

        <button
          type="submit"
          class="btn-guardar"
          :disabled="
            novoPaciente.dnipac === '' || 
              novoPaciente.nomepac === '' ||
              novoPaciente.apelpac === '' ||
              novoPaciente.movilpac === '' ||
              !novoPaciente.lopdpac "
        >
          {{ editando ? "Gardar cambios" : "Gardar" }}
        </button>
        <button
          v-if="editando"
          type="button"
          class="btn-cancelar"
          @click="limpiarFormpac"
        >
          Cancelar edición
        </button>
        <p class="nota-obrigatorio"><span aria-hidden="true">*</span> campo obrigatorio</p>
      </div>
    </form>
    <button
      v-if="editando"
      type="button"
      class="btn-ver-citas"
      @click="abrirCitas(novoPaciente)"
    >
      Ver citas deste paciente
    </button>
    <div class="listaxe-cabecera">
      <h3>📋 Listaxe de pacientes</h3>
    </div>
    <div v-if="pacientes.length > 0" class="tabla-contenedor" role="region" aria-label="Listaxe de pacientes" tabindex="0">
      <table>
        <caption>Listaxe de pacientes</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">DNI/NIE</th>
            <th scope="col">Apelido</th>
            <th scope="col">Nome</th>
            <th scope="col">Fecha nacemento</th>
            <th scope="col">Telefono</th>
            <th scope="col">Correo</th>
            <th scope="col">Dirección</th>
            <th scope="col">Provincia</th>
            <th scope="col">Municipio</th>
            <th scope="col">Accións</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in pacientes" :key="p._id">
            <!-- números (nº, DNI, data, teléfono) centrados; o texto queda á esquerda -->
            <td class="centrado">{{ index + 1 }}</td>
            <td class="centrado">{{ p.dnipac }}</td>
            <td>{{ p.apelpac }}</td>
            <td>{{ p.nomepac }}</td>
            <td class="centrado">{{ p.nacipac }}</td>
            <td class="centrado">{{ p.movilpac }}</td>
            <td>{{ p.mailpac }}</td>
            <td>{{ p.dirpac }}</td>
            <td>{{ p.propac }}</td>
            <td>{{ p.munipac }}</td>
            <td class="centrado">
              <button @click="editarUsuario(index)" title="Editar" :aria-label="`Editar a ${p.nomepac} ${p.apelpac}`">✏️</button>
              <button @click="abrirCitas(p)" title="Ver citas" :aria-label="`Ver as citas de ${p.nomepac} ${p.apelpac}`">📅</button>
              <button @click="eliminarPaciente(index)" title="Eliminar" :aria-label="`Eliminar a ${p.nomepac} ${p.apelpac}`">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Non hai pacientes cargados.</p>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { obtenerMunicipios, obtenerProvincias } from "../api/municipios.js";
import { usePacienteStore } from "../store/pacienteStore.js";
import {
  getPacientes,
  savePaciente,
  deletePaciente,
  modifyPaciente,
  getPacienteByDni,
} from "../api/pacientes.js";

// Datos visibles en la tabla y opciones de los selectores de localización.
const pacientes = ref([]);
const provincias = ref([]);
const municipios = ref([]);
const router = useRouter();

// Estado de validación y modo de edición del formulario.
const documentoInvalido = ref(false)
const comprobacionDocumento = ref("");
const correoInvalido = ref(false)
const telefonoIncorrecto = ref(false)
const editando = ref(false);
let solicitudeComprobacionDocumento = 0;

// Letras de control utilizadas para validar DNI y NIE.
const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE"

// Valores ligados a los campos del formulario.
const novoPaciente = reactive({
  dnipac: "",
  nomepac: "",
  apelpac: "",
  nacipac: "",
  mailpac: "",
  movilpac: "",
  dirpac: "",
  propac: "",
  munipac: "",
  lopdpac: false
});

// Carga los catálogos y los pacientes cuando se monta la vista.
onMounted(async () => {
  provincias.value = await obtenerProvincias();
  pacientes.value = await getPacientes();
});

// Comparte la selección actual con otros componentes mediante Pinia.
function seleccionarPaciente(paciente) {
  const pacienteStore = usePacienteStore();
  pacienteStore.seleccionarPaciente(paciente);
}

// Actualiza las opciones de municipio según la provincia seleccionada.
async function cargarMunicipios() {
  if (novoPaciente.propac === "") {
    municipios.value = [];
    return;
  }

  const provincia = provincias.value.find((p) => p.nm === novoPaciente.propac);
  municipios.value = await obtenerMunicipios(provincia.id);
}

// Valida los campos obligatorios y crea o actualiza el paciente.
async function guardarPaciente() {
  // También se valida aquí porque enviar el formulario con Enter puede saltarse el blur.
  validarDocumento();
  validarTelefono();
  if (documentoInvalido.value || telefonoIncorrecto.value) {
    return;
  }

  try {
    if (editando.value) {
      const pacienteModificado = await modifyPaciente(novoPaciente.dnipac, novoPaciente);
      const index = pacientes.value.findIndex(
        (p) => p.dnipac === novoPaciente.dnipac
      );

      if (index !== -1) {
        pacientes.value[index] = pacienteModificado;
      }
      console.log("Paciente modificado correctamente");
    } else {
      const pacienteGuardado = await savePaciente(novoPaciente);
      pacientes.value.push(pacienteGuardado);
      console.log("Paciente gardado correctamente");
      seleccionarPaciente(novoPaciente);
    }
    limpiarFormpac();
  } catch (error) {
    console.error("Error ao gardar paciente:", error);
  }
  pacientes.value = await getPacientes();
}

// Pide confirmación, elimina el paciente y lo quita de la tabla.
async function eliminarPaciente(index) {
  const p = pacientes.value[index];
  if (!confirm(`Seguro que queres eliminar a ${p.nomepac} ${p.apelpac}?`)) {
    return;
  }

  try {
    await deletePaciente(p.dnipac);
    pacientes.value.splice(index, 1);
    console.log("Paciente eliminado correctamente");
  } catch (error) {
    console.error("Error ao eliminar paciente:", error);
  }
}

// Carga en el formulario un paciente de la tabla y activa el modo edición.
async function editarUsuario(index) {
  const paciente = pacientes.value[index];
  Object.assign(novoPaciente, paciente);
  // El identificador de MongoDB no es un campo editable del formulario.
  delete novoPaciente._id;
  editando.value = true;
  await cargarMunicipios();
  seleccionarPaciente(paciente);
}

// Abre a xestión de citas co paciente escollido como contexto.
function abrirCitas(paciente) {
  seleccionarPaciente(paciente);
  router.push({ name: "XestionCitas" });
}

// Valida el formato y la letra de control de un DNI.
function validarDNI(valor) {
  if (!/^\d{8}[A-Z]$/.test(valor)) return false;
  const numero = parseInt(valor.slice(0, 8), 10);
  return valor.charAt(8) === LETRAS_DNI[numero % 23];
}

// Valida el formato y la letra de control de un NIE.
function validarNIE(valor) {
  if (!/^[XYZ]\d{7}[A-Z]$/.test(valor)) return false;
  const prefixo = { X: "0", Y: "1", Z: "2" }[valor.charAt(0)];
  const numero = parseInt(prefixo + valor.slice(1, 8), 10);
  return valor.charAt(8) === LETRAS_DNI[numero % 23];
}

// Normaliza el documento a mayúsculas y muestra un error si no es válido.
function validarDocumento() {
  const valor = novoPaciente.dnipac.trim().toUpperCase();
  const esValido = validarDNI(valor) || validarNIE(valor);

  documentoInvalido.value = valor !== "" && !esValido;

  if (esValido) {
    novoPaciente.dnipac = valor;
  } else {
    novoPaciente.dnipac = "";
  }
}

const textoComprobacionDocumento = computed(() => {
  const mensaxes = {
    existe: "Este DNI ya está registrado.",
    libre: "Este DNI no está registrado.",
    erro: "No se pudo comprobar el DNI. Inténtalo de nuevo.",
  };
  return mensaxes[comprobacionDocumento.value] || "";
});

function limparComprobacionDocumento() {
  solicitudeComprobacionDocumento += 1;
  comprobacionDocumento.value = "";
  documentoInvalido.value = false;
}

// Comproba ao saír do campo se o documento xa pertence a un paciente.
async function aoPerderFocoDocumento() {
  validarDocumento();
  if (documentoInvalido.value || !novoPaciente.dnipac) {
    return;
  }

  const dni = novoPaciente.dnipac;
  const solicitude = ++solicitudeComprobacionDocumento;
  try {
    await getPacienteByDni(dni);
    if (solicitude === solicitudeComprobacionDocumento && novoPaciente.dnipac === dni) {
      comprobacionDocumento.value = "existe";
    }
  } catch (error) {
    if (solicitude !== solicitudeComprobacionDocumento || novoPaciente.dnipac !== dni) {
      return;
    }
    if (error.response?.status === 404) {
      comprobacionDocumento.value = "libre";
    } else {
      comprobacionDocumento.value = "erro";
      console.error("Error ao comprobar o DNI:", error);
    }
  }
}

// Normaliza el correo y marca el campo si no tiene un formato válido.
function validarCorreo() {
  const valor = novoPaciente.mailpac.trim().toLowerCase();
  correoInvalido.value = valor !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  if (correoInvalido.value) {
    novoPaciente.mailpac = "";
  } else {
    novoPaciente.mailpac = valor;
  }
}

// Normaliza el teléfono y comprueba que tenga nueve cifras y empiece por 6 o 7.
function validarTelefono() {
  const valor = novoPaciente.movilpac.trim();
  telefonoIncorrecto.value = valor !== "" && !/^[67]\d{8}$/.test(valor);

  if (telefonoIncorrecto.value) {
    novoPaciente.movilpac = "";
  } else {
    novoPaciente.movilpac = valor;
  }
}

// Pone en mayúscula la primera letra de cada palabra y recorta espacios sobrantes.
function formatearNome(valor) {
  return valor
    .trim()
    .split(/\s+/)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

// Reinicia campos, validaciones y opciones dependientes del formulario.
const limpiarFormpac = () => {
  Object.keys(novoPaciente).forEach((key) => {
    if (typeof novoPaciente[key] === "boolean") {
      novoPaciente[key] = false;
    } else {
      novoPaciente[key] = "";
    }
  });
  editando.value = false;
  documentoInvalido.value = false;
  correoInvalido.value = false;
  telefonoIncorrecto.value = false;
  limparComprobacionDocumento();
  municipios.value = [];
};

// Busca por DNI y carga el resultado en el formulario para editarlo.
async function buscarPaciente() {
  validarDocumento();
  if (documentoInvalido.value || !novoPaciente.dnipac) {
    return;
  }

  try {
    const dni = novoPaciente.dnipac;
    const paciente = await getPacienteByDni(dni);
    Object.assign(novoPaciente, paciente);
    // El identificador de MongoDB no es un campo editable del formulario.
    delete novoPaciente._id;
    editando.value = true;
    await cargarMunicipios();
    seleccionarPaciente(paciente);
    console.log("Paciente encontrad", paciente);
  } catch (error) {
    if (error.response?.status === 404) {
      // El siguiente guardado debe crear el registro en vez de actualizar uno inexistente.
      editando.value = false;
      console.log("Paciente no encontrad");
    } else {
      console.log("Error al buscar paciente:", error);
    }
  }
}

</script>

<style scoped>
.xestion-pacientes {
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

.campo label {
  font-weight: 500;
}

.campo input {
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #767676; /* contraste mínimo 3:1 para que se vexa o campo */
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

.dni-acciones {
  display: flex;
  gap: 0.4rem;
}

.btn-ver-citas {
  display: block;
  margin: -1rem auto 2rem;
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

/* ---------- fila de gardar: checkbox enriba do botón, centrados; nota á dereita ---------- */
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
.tabla-contenedor {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 60vh;
  overscroll-behavior-x: contain;
}

.tabla-contenedor:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

table {
  width: 100%;
  min-width: 70rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  border-collapse: collapse;
}

th,
td {
  border: 1px solid var(--border);
  padding: 0.7rem;
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
  .xestion-pacientes {
    padding: 1rem;
  }

  .listaxe-cabecera {
    gap: 0.5rem;
  }
}
</style>
