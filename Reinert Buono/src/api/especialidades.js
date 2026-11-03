import axios from 'axios'

//direccion de nuestra API. this is where the data is coming from
const URL = 'http://localhost:3000/api/especialidades'

//obtener todas las especialidades
export async function obtenerEspecialidades() {   //this line is an async function that will return a promise. 
    //async function definition: 
    
    const respuesta = await axios.get(URL)   //here axios goes to the url specified and gets all the data. 
    //The await keyword is used to wait for the promise to resolve before continuing.
    
    return respuesta.data.especialidades  // we are only returning the especialidades data by selcting the name of that array (.especialidades).
}