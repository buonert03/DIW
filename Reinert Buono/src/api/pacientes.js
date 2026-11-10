import axios from "axios"

// URL base dos endpoints de pacientes.
const API_URL = "http://localhost:3000/api"

// Crea un paciente e devolve o rexistro creado pola API.
export async function savePaciente(paciente){
    const res = await axios.post(`${API_URL}/pacientes`, paciente);
    return res.data;
    }

// Devolve todos os pacientes ordenados alfabeticamente polo apelido.
export async function getPacientes() {
    const res = await axios.get(`${API_URL}/pacientes`);
    res.data.sort((a,b)=>
        a.apelpac.localeCompare(b.apelpac, "es", {sensitivity: "base"}));
    return res.data;
}

// Elimina o paciente identificado polo DNI.
export async function deletePaciente(dni) {
    const res = await axios.delete(`${API_URL}/pacientes/${dni}`);
    return res.data;
}

// Actualiza os datos do paciente identificado polo DNI.
export async function modifyPaciente(dni, paciente) {
    const res = await axios.put(`${API_URL}/pacientes/${dni}`, paciente);
    return res.data;
}

// Busca un paciente polo DNI.
export async function getPacienteByDni(dni) {
    const res = await axios.get(`${API_URL}/pacientes/${dni}`);
    return res.data;
}