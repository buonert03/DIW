import axios from 'axios'

//direccion de nuestra API. this is where the data is coming from
const URL = 'http://localhost:3000/api/municipios'

//obtener todas las provincias
export async function obtenerProvincias() {   //this line is an async function that will return a promise. 
    //async function definition: 
    
    const respuesta = await axios.get(URL)   //here axios goes to the url specified and gets all the data. 
    //The await keyword is used to wait for the promise to resolve before continuing.
    
    return respuesta.data.provincias  // we are only returning the provinces data by selcting the name of that array (.provincias).
}

//obtener los municipios de una provincia
export async function obtenerMunicipios(idProvincia) {
    const respuesta = await axios.get(URL)
    const municipios = respuesta.data.municipios  // aqui el variable municipios contiene todos los municipios del array en el fichero municipo.json

    return municipios.filter(
        municipio => municipio.id.substring(0,2) === idProvincia  //filtramos los municipios que coinciden los dos primeros numeros de la provincia
    )
}