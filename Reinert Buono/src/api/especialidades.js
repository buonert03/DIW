import axios from 'axios'

// Endpoint que fornece as especialidades dispoñibles.
const URL = 'http://localhost:3000/api/especialidades'

// Obtén da resposta da API só a lista de especialidades.
export async function obtenerEspecialidades() {
    const respuesta = await axios.get(URL)
    return respuesta.data.especialidades
}