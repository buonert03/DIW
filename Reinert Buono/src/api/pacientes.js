import axios from "axios"

// URL base de la API de pacientes.
const API_URL = "http://localhost:3000/api"

// Crea un paciente y devuelve el registro creado por la API.
export async function savePaciente(paciente){
    const res = await axios.post(`${API_URL}/pacientes`, paciente);
    return res.data;
    }

// Obtiene todos los pacientes y ordena la respuesta por apellido.
export async function getPacientes() {
    const res = await axios.get(`${API_URL}/pacientes`);
    res.data.sort((a,b)=>
        a.apelpac.localeCompare(b.apelpac, "es", {sensitivity: "base"}));
    return res.data;
}

// Elimina el paciente identificado por su DNI.
export async function deletePaciente(dni) {
    const res = await axios.delete(`${API_URL}/pacientes/${dni}`);
    return res.data;
}

// Actualiza los datos del paciente identificado por su DNI.
export async function modifyPaciente(dni, paciente) {
    const res = await axios.put(`${API_URL}/pacientes/${dni}`, paciente);
    return res.data;
}

// Busca y devuelve un paciente por DNI.
export async function getPacienteByDni(dni) {
    const res = await axios.get(`${API_URL}/pacientes/${dni}`);
    return res.data;
}