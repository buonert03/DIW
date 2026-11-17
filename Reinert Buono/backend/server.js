import express from 'express'
import fs from 'fs'
import cors from 'cors'
import "dotenv/config";
import mongoose from "mongoose"
import pacientesRutas from './rutas/pacientes.rutas.js';
import doctoresRutas from './rutas/doctores.rutas.js'
import citasRutas from './rutas/citas.rutas.js';
import Paciente from './modelos/Paciente.js';
import { inicializarIdsCita } from './modelos/Cita.js';

// Configura Express, los middlewares comunes y las rutas de cada recurso.
const app = express()
app.use(cors());
app.use(express.json());
app.use('/api/pacientes', pacientesRutas);
app.use('/api/doctores', doctoresRutas);
app.use('/api/citas', citasRutas);

// Usa o porto do entorno ou 3000 como valor por defecto.
const PORT = process.env.PORT || 3000;

// URI de conexión a MongoDB, configurada no entorno.
const MONGO_URI = process.env.MONGO_URI;

// Lee y sirve el catálogo estático de provincias y municipios.
app.get('/api/municipios', (req, res) => {
    console.log('Petición recibida')
    const datos = fs.readFileSync(
        './backend/data/municipios.json',
        'utf-8'
    )
    const datosJson = JSON.parse(datos)
    res.json(datosJson)
})

// Lee y sirve el catálogo estático de especialidades médicas.
app.get('/api/especialidades', (req, res) => {
    console.log('Petición recibida')
    const datos = fs.readFileSync(
        './backend/data/especialidades.json',
        'utf-8'
    )
    const datosJson = JSON.parse(datos)
    res.json(datosJson)
})

// Inicializa MongoDB y los datos dependientes antes de empezar a escuchar HTTP.
async function iniciaServer() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'bbdd' });
        await Paciente.init();
        await inicializarIdsCita();
        console.log("Connectado a MongoDB");
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error de connexion", error);
    }
}

iniciaServer();