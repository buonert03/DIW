import axios from "axios"

// URL base de la API de doctores.
const API_URL = "http://localhost:3000/api";

// Crea un doctor y devuelve el registro creado por la API.
export async function saveDoctor(doctor) {
    const res = await axios.post(`${API_URL}/doctores`, doctor);
    return res.data;
}

// Obtiene todos los doctores y ordena la respuesta por apellido.
export async function getDoctores() {
    const res = await axios.get(`${API_URL}/doctores`);
    res.data.sort((a, b) => 
        a.apeldoc.localeCompare(b.apeldoc, "es", { sensitivity: "base" })); 
    return res.data;
}

// Filtra por especialidad y ordena los resultados por apellido.
export async function getDoctorByEspecialidad(especialidad) {
    const res = await axios.get(`${API_URL}/doctores/especialidad/${encodeURIComponent(especialidad)}`);
    res.data.sort((a, b) =>
        a.apeldoc.localeCompare(b.apeldoc, "es", { sensitivity: "base" }));
    return res.data;
} 

// Actualiza el doctor identificado por su ID y devuelve el registro guardado.
export async function modifyDoctor(id, doctor) {
    const res = await axios.put(`${API_URL}/doctores/${encodeURIComponent(id)}`, doctor);
    return res.data;
}   

// Elimina el doctor identificado por su ID.
export async function deleteDoctor(id) {
    const res = await axios.delete(`${API_URL}/doctores/${encodeURIComponent(id)}`);
    return res.data;
}