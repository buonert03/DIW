import axios from 'axios'

// Endpoint que proporciona el catálogo de especialidades.
const URL = 'http://localhost:3000/api/especialidades'

// Devuelve únicamente el arreglo de especialidades incluido en la respuesta.
export async function obtenerEspecialidades() {
    const respuesta = await axios.get(URL)
    return respuesta.data.especialidades
}