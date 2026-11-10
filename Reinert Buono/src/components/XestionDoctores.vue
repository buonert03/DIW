<template>
  <div class="xestion-doctores">
    <h3>🩺 Xestión de doctores</h3>
    <form @submit.prevent="guardarDoctor">
      <!-- fila 1: ID, apelido, nome e colexiado -->
      <div class="fila">
        <div class="campo campo-id">
          <label for="id">ID:</label>
          <!-- o ID non se edita: só se mostra cando cargamos un doctor -->
          <input id="id" v-model="novoDoctor.iddoc" type="text" disabled class="centrado" />
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
          <label for="especialidade">Especialidade:<span class="obrigatorio" aria-hidden="true">*</span></label>
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
          Gardar
        </button>
        <p class="nota-obrigatorio">
          <span aria-hidden="true">*</span> campo obrigatorio
        </p>
      </div>
    </form>
    <div class="listaxe-cabecera">
      <h3>📋 Listaxe de doctores</h3>
      <div class="listaxe-acciones">
        <button type="button" @click="limpiarFormdoc" title="Limpar formulario" aria-label="Limpar formulario">
          🧹
        </button>
      </div>
    </div>
    <div v-if="doctores.length > 0" class="tabla-contenedor" role="region" aria-label="Listaxe de doctores"
      tabindex="0">
      <table>
        <caption>
          Listaxe de doctores
        </caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Codigo</th>
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
            <td class="centrado">{{ d.iddoc }}</td>
            <td>{{ d.apeldoc }}</td>
            <td>{{ d.nomedoc }}</td>
            <td>{{ d.coledoc ? "Si" : "Non" }}</td>
            <td class="centrado">{{ d.movildoc }}</td>
            <td>{{ d.espedoc }}</td>
            <td class="centrado">
              <button @click="editarDoctor(index)" title="Editar" :aria-label="`Editar a ${d.nomedoc} ${d.apeldoc}`">
                ✏️
              </button>
              <button @click="eliminarDoctor(index)" title="Eliminar"
                :aria-label="`Eliminar a ${d.nomedoc} ${d.apeldoc}`">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Non hai doctores cargados.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { obtenerEspecialidades } from "../api/especialidades.js";
import { useDoctorStore } from "../store/doctorStore.js";
import {
  getDoctores,
  saveDoctor,
  deleteDoctor,
  getDoctorByEspecialidad,
  modifyDoctor,
} from "../api/doctores.js";

// Registros e opcións que se amosan na táboa e no selector.
const doctores = ref([]);
const especialidades = ref([]);

// Estado de edición e erros de validación do formulario.
const editando = ref(false);
const correoInvalido = ref(false);
const telefonoIncorrecto = ref(false);

// Valores ligados aos controis do formulario.
const novoDoctor = reactive({
  iddoc: "",
  apeldoc: "",
  nomedoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: false,
  espedoc: "",
});

// Carga os doutores e especialidades ao abrir a vista.
onMounted(async () => {
  doctores.value = await getDoctores();
  especialidades.value = await obtenerEspecialidades();
});

// Comparte a selección actual mediante o store de Pinia.
function seleccionarDoctor(doctor) {
  const doctorStore = useDoctorStore();
  doctorStore.seleccionarDoctor(doctor);
}

// Normaliza o nome e os apelidos antes de gardalos.
function formatearNome(valor) {
  return valor
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
}

// Normaliza o correo e marca o campo se o formato non é válido.
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

// Normaliza o teléfono e comproba que teña nove cifras e comece por 6 ou 7.
function validarTelefono() {
  const valor = novoDoctor.movildoc.trim();
  telefonoIncorrecto.value = valor !== "" && !/^[67]\d{8}$/.test(valor);

  if (telefonoIncorrecto.value) {
    novoDoctor.movildoc = "";
  } else {
    novoDoctor.movildoc = valor;
  }
}

// Reinicia os campos, os erros de validación e o modo de edición.
const limpiarFormdoc = () => {
  Object.keys(novoDoctor).forEach((key) => {
    if (typeof novoDoctor[key] === "boolean") {
      novoDoctor[key] = false;
    } else {
      novoDoctor[key] = "";
    }
  });
  editando.value = false;
  correoInvalido.value = false;
  telefonoIncorrecto.value = false;
};
</script>

<style scoped>
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
.listaxe-acciones button,
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

.listaxe-acciones {
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
  min-width: 50rem;
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
  .xestion-doctores {
    padding: 1rem;
  }

  .listaxe-cabecera {
    gap: 0.5rem;
  }
}
</style>
