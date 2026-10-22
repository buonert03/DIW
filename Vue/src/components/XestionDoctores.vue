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
          <!-- type="button" para que non envíe o formulario ao pulsalo -->
          <button type="button" @click="limpiarFormdoc" title="Limpar formulario" aria-label="Limpar formulario">
            🧹
          </button>
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
    <h3>📋 Listaxe de doctores</h3>
    <table v-if="doctores.length > 0">
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
    <p v-else>Non hai doctores cargados.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { obtenerEspecialidades } from "../api/especialidades";
import {
  getDoctores,
  saveDoctor,
  deleteDoctor,
  getDoctorByEspecialidad,
  modifyDoctor,
} from "../api/doctores.js";

const doctores = ref([]);
const especialidades = ref([]);

const editando = ref(false);
const correoInvalido = ref(false);
const telefonoIncorrecto = ref(false);

const novoDoctor = reactive({
  iddoc: "",
  apeldoc: "",
  nomedoc: "",
  maildoc: "",
  movildoc: "",
  coledoc: false,
  espedoc: "",
});

onMounted(async () => {
  doctores.value = await getDoctores();
  especialidades.value = await obtenerEspecialidades();
});

//=============== FUNCIONES PRINCIPALES de BBDD ==================

//=============== FUNCIONES AUXILIARES ==================

// pon en maiúscula a primeira letra de cada palabra (ex: "ana maría" → "Ana María")
function formatearNome(valor) {
  return valor
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(),
    )
    .join(" ");
}

// ao saír do campo Correo: valida o formato e baleira o campo se non vale
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

// ao saír do campo Teléfono: valida que sexa un móbil de 9 cifras (6 ou 7 ao principio)
function validarTelefono() {
  const valor = novoDoctor.movildoc.trim();
  telefonoIncorrecto.value = valor !== "" && !/^[67]\d{8}$/.test(valor);

  if (telefonoIncorrecto.value) {
    novoDoctor.movildoc = "";
  } else {
    novoDoctor.movildoc = valor;
  }
}

// botón 🧹: baleira o formulario, sae do modo edición e quita as mensaxes de erro
const limpiarFormdoc = () => {
  Object.keys(novoDoctor).forEach((key) => {
    if (typeof novoDoctor[key] === "boolean") {
      novoDoctor[key] = false; //reinicia los booleanos a false
    } else {
      novoDoctor[key] = ""; //reinicia el resto
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
  display: flex;
  gap: 1rem;
}

/* label e input na mesma liña; por defecto cada campo ocupa 1 parte da fila */
.campo {
  flex: 1;
  min-width: 0; /* deixa encoller o campo e o seu input (por defecto un input mide ~20 caracteres) para que a fila non se saia do panel */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* campos máis anchos */
.campo-nome,
.campo-apellido {
  flex: 3;
}

/* ID: curto, como o DNI en pacientes */
.campo-id {
  flex: 0 0 auto;
}

.campo-id input {
  flex: none;
  width: 9em;
}

/* teléfono (9 cifras): ancho fixo, non encolle; o espazo que sobra vai para o correo */
.campo-telefono {
  flex: 0 0 auto;
}

.campo-telefono input {
  flex: none;
  width: 11em; /* sitio para 13 caracteres (prefixo internacional: 0034612345678) */
}

.campo-correo {
  flex: 2;
}

/* o selector só ocupa o que mide */
.campo-especialidade {
  flex: 0 0 auto;
  padding: 0.5rem 0;
}

/* ancho fixo = o da especialidade máis longa ("Medicina Preventiva y Salud Pública") */
#especialidade {
  width: 19.5em;
}

.campo label {
  min-width: 80px;
  /* ancho fixo para aliñar */
  font-weight: 500;
}

/* a label "ID:" só ocupa o que mide (sen o ancho mínimo de 80px das outras, que deixaba un oco);
   vai despois de .campo label para gañarlle */
.campo-id label {
  min-width: auto;
}

.campo input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #767676;
  /* contraste mínimo 3:1 para que se vexa o campo */
  border-radius: 6px;
  box-sizing: border-box;
}

/* os select coa mesma altura que os input */
.campo select {
  padding: 0.5rem;
}

/* botóns de icona (🔍 🧹 ✏️ 🗑️): mesmo ancho, e o alto igual ao ancho (cadrados) */
.campo button,
td button {
  aspect-ratio: 1;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* o fieldset dos radio sen o marco por defecto do navegador; só ocupa o que miden Si/Non */
.campo-colexiado {
  flex: 0 0 auto;
  border: none;
  margin: 0;
  padding: 0;
}

.campo-colexiado legend {
  float: left;
  /* a legend na mesma liña que os radio */
  min-width: 80px;
  font-weight: 500;
}

/* Si / Non non necesitan o ancho fixo das outras labels (vai despois de .campo label para gañarlle) */
.campo-colexiado label {
  min-width: auto;
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
table {
  width: 100%;
  margin-top: 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--border);
}

th,
td {
  border: 1px solid var(--border);
  padding: 0.7rem;
}

th {
  background-color: var(--accent-soft);
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

  /* apila os campos verticalmente en móbiles */
  .fila {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
