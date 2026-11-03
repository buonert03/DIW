<template>
  <div class="xestion-pacientes">
    <h3>👥  Xestión de pacientes</h3>
    <form @submit.prevent="guardarPaciente">
      <div class="fila">
        <div class="campo campo-dni">
          <label for="dni">DNI/NIE:<span class="obrigatorio" aria-hidden="true">*</span></label>
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
            @focus="documentoInvalido = false"
            @blur="validarDocumento"/>
          <!-- :disabled="editando" → cando cargamos un paciente (✏️ ou 🔍) o DNI vese pero non se pode cambiar; 🧹 desbloquéao -->
          <!-- type="button" para que non envíe o formulario ao pulsalo -->
          <!-- 🔍 tamén se bloquea mentres editamos: co DNI bloqueado só volvería cargar o mesmo paciente -->
          <button type="button" @click="buscarPaciente" :disabled="editando" title="Buscar" aria-label="Buscar paciente por DNI">🔍</button>
          <button type="button" @click="limpiarFormpac" title="Limpar formulario" aria-label="Limpar formulario">🧹</button>
          <span v-if="documentoInvalido" id="dni-erro" class="mensaxe-erro" role="alert">DNI/NIE non válido</span>
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
          Gardar
        </button>
        <p class="nota-obrigatorio"><span aria-hidden="true">*</span> campo obrigatorio</p>
      </div>
    </form>
    <h3>📋 Listaxe de pacientes</h3>
    <table v-if="pacientes.length > 0">
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
            <button @click="eliminarPaciente(index)" title="Eliminar" :aria-label="`Eliminar a ${p.nomepac} ${p.apelpac}`">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Non hai pacientes cargados.</p>
  </div>
</template>

<script setup>

/// Zona de declaracións

import { ref, reactive, onMounted } from "vue";
import { obtenerMunicipios, obtenerProvincias } from "../api/municipios.js";
import { 
  getPacientes, 
  savePaciente, 
  deletePaciente, 
  modifyPaciente, 
  getPacienteByDni 
} from "../api/pacientes.js";


const pacientes = ref([]); //almacena la lista de pacientes e os seus cambios
const provincias = ref([]); //almacena a lista de provincias e os seus cambios
const municipios = ref([]);

const documentoInvalido = ref(false)
const correoInvalido = ref(false)
const telefonoIncorrecto = ref(false)
const editando = ref(false);

const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE"

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

/// Zona de ciclo de vida

// ao abrir a páxina: carga as provincias e a lista de pacientes
onMounted(async() => {
  //sempre se cargan estos pacientes de exemplo ao iniciar o componente
  provincias.value = await obtenerProvincias(); //carga a lista de provincias desde a API
  pacientes.value = await getPacientes();   //carga los usuarios guardados
});

// carga os municipios da provincia elixida no selector (ou baleira a lista se non hai provincia)
async function cargarMunicipios() {
  if (novoPaciente.propac === "") {
    municipios.value=[];
    return;
  }

  const provincia = provincias.value.find(
    p => p.nm === novoPaciente.propac
  );

//obtener los municipios de la provincia seleccionada
municipios.value = await obtenerMunicipios(provincia.id); 
}

/// Zona de métodos ou funcións

// botón Gardar: modifica o paciente se estamos editando, se non créao novo
async function guardarPaciente() {
  // validamos DNI e teléfono tamén aquí: se se preme Enter dentro dun campo, o @blur non se executa
  // e o dato sen validar chegaría á BD. Se algún non vale, mostramos o erro e non gardamos.
  validarDocumento();
  validarTelefono();
  if (documentoInvalido.value || telefonoIncorrecto.value) {
    return;
  }

  try {
        if (editando.value){
          const pacienteModificado = await modifyPaciente(novoPaciente.dnipac, novoPaciente);
          const index = pacientes.value.findIndex (
            (p) => p.dnipac === novoPaciente.dnipac
          );

          if (index !== -1){
            pacientes.value[index] =pacienteModificado;
          }
          console.log("Paciente modificado correctamente")
        } else {
          const pacienteGuardado = await savePaciente(novoPaciente);
          pacientes.value.push(pacienteGuardado);
          console.log("Paciente gardado correctamente");
        }
            limpiarFormpac();  //baleira o formulario e sae do modo edición
  } catch (error) {
    console.error("Error ao gardar paciente:", error);
  }
  pacientes.value = await getPacientes();
}

// botón 🗑️: borra o paciente da BD e da táboa
async function eliminarPaciente(index) {
  // pide confirmación antes de borrar; se o usuario preme Cancelar non se fai nada
  const p = pacientes.value[index];
  if (!confirm(`Seguro que queres eliminar a ${p.nomepac} ${p.apelpac}?`)) {
    return;
  }

  try {
    await deletePaciente(pacientes.value[index].dnipac); //elimina o paciente da base de datos
    pacientes.value.splice(index, 1); //elimina o paciente da lista
    console.log("Paciente eliminado correctamente");
    getPacientes(); // Actualiza la lista de pacientes después de eliminar
  } catch (error) {
    console.error("Error ao eliminar paciente:", error);
  }
}

// botón ✏️: carga o paciente da táboa no formulario e activa o modo edición
async function editarUsuario(index){
  const paciente=pacientes.value[index];
  Object.assign(novoPaciente, paciente);
  //evitar que se carge el _id n el formulasrio de MongoDB
  delete novoPaciente._id;
  editando.value = true;
  await cargarMunicipios();

}

// Zona de funcións auxiliares

// comproba que un DNI (8 números + letra) ten a letra correcta
function validarDNI(valor) {
  if (!/^\d{8}[A-Z]$/.test(valor)) return false
  const numero = parseInt(valor.slice(0, 8), 10)
  return valor.charAt(8) === LETRAS_DNI[numero % 23]
}

// comproba que un NIE (X/Y/Z + 7 números + letra) ten a letra correcta
function validarNIE(valor) {
  if (!/^[XYZ]\d{7}[A-Z]$/.test(valor)) return false
  const prefixo = { X: "0", Y: "1", Z: "2" }[valor.charAt(0)]
  const numero = parseInt(prefixo + valor.slice(1, 8), 10)
  return valor.charAt(8) === LETRAS_DNI[numero % 23]
}

// ao saír do campo DNI: valida DNI/NIE, mostra o erro e baleira o campo se non vale
function validarDocumento() {
  const valor = novoPaciente.dnipac.trim().toUpperCase()
  const esValido = validarDNI(valor) || validarNIE(valor)

  documentoInvalido.value = valor !== "" && !esValido

  if (esValido) {
    novoPaciente.dnipac = valor
  } else {
    novoPaciente.dnipac = ""
  }
  
}

// ao saír do campo Correo: valida o formato e baleira o campo se non vale
function validarCorreo() {
  const valor = novoPaciente.mailpac.trim().toLowerCase()
  correoInvalido.value = valor !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)

  if (correoInvalido.value) {
    novoPaciente.mailpac = ""
  } else {
    novoPaciente.mailpac = valor
  }
}

// ao saír do campo Teléfono: valida que sexa un móbil de 9 cifras (6 ou 7 ao principio)
function validarTelefono() {
  const valor = novoPaciente.movilpac.trim()
  telefonoIncorrecto.value = valor !== "" && !/^[67]\d{8}$/.test(valor)
  
  if (telefonoIncorrecto.value) {
    novoPaciente.movilpac = ""
  } else {
    novoPaciente.movilpac = valor
  }
}

// pon en maiúscula a primeira letra de cada palabra (ex: "ana maría" → "Ana María")
function formatearNome(valor) {
  return valor
    .trim()        // quita os espazos do principio e do final (un nome só con espazos queda baleiro e Gardar desactívase)
    .split(/\s+/)  // separa polas palabras aínda que haxa varios espazos seguidos entre elas
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ")
}

// botón 🧹: baleira o formulario, sae do modo edición e quita as mensaxes de erro
const limpiarFormpac = () => {
  Object.keys(novoPaciente).forEach((key) => {
    if (typeof novoPaciente[key] === "boolean"){
      novoPaciente[key] = false;   //reinicia los booleanos a false
    } else {
      novoPaciente[key] = ""; //reinicia el resto
    }
  })
  editando.value = false;
  documentoInvalido.value = false;
  correoInvalido.value = false;
  telefonoIncorrecto.value = false;
  municipios.value = []; // baleira tamén a lista de municipios da provincia anterior
};

// botón 🔍: busca o paciente polo DNI na BD e cárgao no formulario para editalo
async function buscarPaciente() {
  try {
    const dni = novoPaciente.dnipac.trim();
    if (!dni) {
      console.log ("introduce un dni!");
      return ;
    }
    const paciente= await getPacienteByDni(dni);
    Object.assign(novoPaciente, paciente);
    //evitar que se carge el _id de MongoDB no formulario
    delete novoPaciente._id;
    editando.value = true;
    await cargarMunicipios();

    console.log("Paciente encontrad", paciente);
  } catch(error){
      if (error.response?.status === 404 ){
        // non existe: saímos do modo edición para que Gardar cree un paciente novo en vez de modificar un que non existe
        // (co DNI e 🔍 bloqueados ao editar isto xa non debería pasar desde o formulario, pero queda como seguridade)
        editando.value = false;
        console.log("Paciente no encontrad");
      } else {
        console.log("Error al buscar paciente:",error)
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

/* DNI: só o ancho que precisa (9 caracteres), o resto da fila queda para nome e apelido */
.campo-dni {
  flex: 0 0 auto;
}

.campo-dni input {
  flex: none;
  width: 9em;
}

/* teléfono (9 cifras) e data: ancho fixo, non encollen; o espazo que sobra vai para os campos de texto */
.campo-telefono,
.campo-nacimiento {
  flex: 0 0 auto;
}

.campo-telefono input {
  flex: none;
  width: 11em; /* sitio para 13 caracteres (prefixo internacional: 0034612345678) */
}

.campo-nacimiento input {
  flex: none;
}

.campo-correo {
  flex: 2;
}

/* os selectores só ocupan o que miden, o resto queda para a dirección */
.campo-provincia,
.campo-municipio {
  flex: 0 0 auto;
  padding: 0.5rem 0;
}

/* ancho fixo para que o select non cambie de tamaño ao elixir outra opción */

/* provincia: cabe o texto máis longo ("Selecciona una provincia") */
#provincia {
  width: 14.5em;
}

/* municipio: cabe o 99% dos nomes; os ~20 máis longos (ex. "San Vicente del Raspeig/Sant Vicent del Raspeig")
   córtanse só co select pechado, na lista despregada vense enteiros */
#municipio {
  width: 16em;
}

.campo label {
  min-width: 80px; /* ancho fixo para aliñar */
  font-weight: 500;
}

.campo-nacimiento label {
  white-space: nowrap;
}

.campo input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #767676; /* contraste mínimo 3:1 para que se vexa o campo */
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

/* ---------- fila de gardar: checkbox enriba do botón, centrados; nota á dereita ---------- */
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
  .xestion-pacientes {
    padding: 1rem;
  }

  /* apila os campos verticalmente en móbiles */
  .fila {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
