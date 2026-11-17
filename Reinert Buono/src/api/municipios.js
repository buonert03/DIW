import axios from 'axios'

// Endpoint que proporciona los catálogos de provincias y municipios.
const URL = 'http://localhost:3000/api/municipios'

// Devuelve la lista de provincias de la respuesta del servidor.
export async function obtenerProvincias() {
    const respuesta = await axios.get(URL)
    return respuesta.data.provincias
}

// Filtra los municipios cuyo identificador empieza por el código de provincia.
export async function obtenerMunicipios(idProvincia) {
    const respuesta = await axios.get(URL)
    const municipios = respuesta.data.municipios

    return municipios.filter(
        municipio => municipio.id.substring(0, 2) === idProvincia
    )
}