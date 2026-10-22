import express from "express";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();

//eliminar
router.delete("/:dni", async (req, res) => {
    try {
        const paciente = await Paciente.findOneAndDelete({ dnipac: req.params.dni });
        if (!paciente) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }
        res.json({ mensaje: "Paciente eliminado" });
    } catch (error) {
        console.error("ERROR AL ELIMINAR PACIENTE", error);
        res.status(500).json({
            mensaje: "Error al eliminar el paciente"
        });
    };
});


// Crear 
router.post("/", async (req, res) => {
    try {
        const pacienteExistente = await Paciente.findOne( 
            {dnipac: req.body.dnipac,})
        if (pacienteExistente){
            return res.status(409).json({
                mensaje: "Ya existe un paciente con este DNI",
            })
        }
        
        console.log("Datos Recibidos: ",req.body);
        const paciente = new Paciente(req.body);
        const nuevoPaciente = await paciente.save();
        res.status(201).json(nuevoPaciente);
        
    } catch (error) {
        console.error("ERROR AL CREAR PACIENTE",error);
        res.status(500).json({
            mensaje: "Error al crear el paciente"
        });
    };
});

//Obtener todos
router.get("/", async (req, res) => {
    try {
        const pacientes = await Paciente.find();  //es el select sql
        res.json(pacientes);
    } catch (error) {
        console.error("ERROR AL OBTENER PACIENTES", error);
        res.status(500).json({ mensaje: "Error al obtener los pacientes", error: error.message });
    };
});

//modificar
router.put("/:dni", async (req, res) => {
    try {
        // o DNI non se pode modificar: o paciente identifícase polo DNI da URL,
        // así que borramos dnipac (e o _id de MongoDB) do body aínda que alguén os envíe
        delete req.body.dnipac;
        delete req.body._id;
        const paciente = await Paciente.findOneAndUpdate({ dnipac: req.params.dni }, req.body, { new: true });
        if (!paciente) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }
        res.json(paciente);
    } catch (error) {
        console.error("ERROR AL MODIFICAR PACIENTE", error);
        res.status(500).json({ mensaje: "Error al modificar el paciente", error: error.message });
    };
});


//Obtener un paciente por dni
router.get("/:dni", async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            dnipac: req.params.dni,
        });  //es el select sql
        if (!paciente) {
            return res.status(404).json({
               mensaje: "Paciente no encontrado" ,
            });
        }
        res.json(paciente);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener los pacientes", error });
    };
});

export default router;