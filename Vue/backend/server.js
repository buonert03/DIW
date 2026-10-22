import express from 'express'
import fs from 'fs'
import cors from 'cors'
import "dotenv/config";
import mongoose from "mongoose"
import pacientesRutas from './rutas/pacientes.rutas.js';
import doctoresRutas from './rutas/doctores.rutas.js'

//creamos la aplicación de express
const app = express()
app.use(cors());
app.use(express.json());
app.use('/api/pacientes', pacientesRutas);
app.use('/api/doctores', doctoresRutas);


//usa el port devinido en las variables del entorno y si no coge el 3000
const PORT = process.env.PORT || 3000;

//url connexion con mongodb
const MONGO_URI = process.env.MONGO_URI;

//creamos el cliente mongoDB (la cadena de connexion)
//const client = new MongoClient(MONGO_URI);        creo que ya no hace falta

//ruta de la api para obtener provincias y municipios
app.get('/api/municipios', (req, res) => {
    console.log('Petición recibida')
        //leemos el fichero Json
        const datos = fs.readFileSync(
            './backend/data/municipios.json', 
            'utf-8'
        )
    //convertimos el texto JSON en un objecto JavaScript
    const datosJson = JSON.parse(datos)
    //enviamos los datos comorespuesta al cliente
    res.json(datosJson)
})

//ruta de la api para obtener ESPECIALIDADES
app.get('/api/especialidades', (req, res) => {
    console.log('Petición recibida')
    //leemos el fichero Json
        const datos = fs.readFileSync(
            './backend/data/especialidades.json', 
            'utf-8'
        )
    //convertimos el texto JSON en un objecto JavaScript
    const datosJson = JSON.parse(datos)
    //enviamos los datos comorespuesta al cliente web
    res.json(datosJson)
})

//ponemos el servidor a escuchar en el puerto 3000
async function iniciaServer() {
    try {
        //conncetamos con mongo db
        await mongoose.connect(MONGO_URI);
        console.log("Connectado a MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
            });
        }
    catch(error){
        console.error("Error de connexion", error);
    }
}

iniciaServer();
