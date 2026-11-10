import axios from 'axios'

// Endpoint que fornece provincias e municipios.
const URL = 'http://localhost:3000/api/municipios'

// Devolve a lista de provincias incluída na resposta.
export async function obtenerProvincias() {
    const respuesta = await axios.get(URL)
    return respuesta.data.provincias
}

// Devolve só os municipios cuxo identificador comeza polo código provincial.
export async function obtenerMunicipios(idProvincia) {
    const respuesta = await axios.get(URL)
    const municipios = respuesta.data.municipios

    return municipios.filter(
        municipio => municipio.id.substring(0, 2) === idProvincia
    )
}