import axios from "axios"

// URL base dos endpoints de doutores.
const API_URL = "http://localhost:3000/api";

// Crea un doutor e devolve o rexistro creado pola API.
export async function saveDoctor(doctor) {
    const res = await axios.post(`${API_URL}/doctores`, doctor);
    return res.data;
}

// Devolve todos os doutores ordenados alfabeticamente polo apelido.
export async function getDoctores() {
    const res = await axios.get(`${API_URL}/doctores`);
    res.data.sort((a, b) => 
        a.apeldoc.localeCompare(b.apeldoc, "es", { sensitivity: "base" })); 
    return res.data;
}

// Busca doutores pola especialidade indicada.
export async function getDoctorByEspecialidad(especialidad) {
    const res = await axios.get(`${API_URL}/doctores/${especialidad}`);
    return res.data;
} 

// Actualiza o doutor identificado polo ID.
export async function modifyDoctor(id, doctor) {
    const res = await axios.put(`${API_URL}/doctores/${id}`, doctor);
    return res.data;
}   

// Elimina o doutor identificado polo ID.
export async function deleteDoctor(id) {
    const res = await axios.delete(`${API_URL}/doctores/${id}`);
    return res.data;
}