import express from "express";
import Doctor from "../modelos/Doctor.js";

const router = express.Router();

//eliminar
router.delete("/:iddoc", async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndDelete({ iddoc: req.params.dni, });
        if (!doctor) {
            return res.status(404).json({ mensaje: "Doctor no encontrado" });
        }
        res.json({ mensaje: "Doctor eliminado" });
    } catch (error) {
        console.error("ERROR AL ELIMINAR PACIENTE", error);
        res.status(500).json({
            mensaje: "Error al crear el doctor"
        });
    };
});


// Crear 
router.post("/", async (req, res) => {
    try {
        const doctorExistente = await doctor.findeOne( 
            {iddoc: req.body.iddoc,})
        if (doctorExistente){
            return res.status(409).json({
                mensaje: "Ya existe un doctor con este DNI",
            })
        }
        
        const doctor = new Doctor(req.body);
        const nuevoDoctor = await doctor.save();
        res.status(201).json(nuevoDoctor);
        console.log("Datos Recibidos: ",req.body);
        
    } catch (error) {
        console.error("ERROR AL CREAR PACIENTE",error);
        res.status(500).json({
            mensaje: "Error al crear el doctor"
        });
    };
});

//Obtener todos
router.get("/", async (req, res) => {
    try {
        const doctores = await Doctor.find();  //es el select sql
        res.json(doctores);
    } catch (error) {
        console.error("ERROR AL OBTENER DOCTORES", error);
        res.status(500).json({ mensaje: "Error al obtener los doctores", error: error.message });    };
});

//modificar
router.put("/:iddoc", async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ iddoc: req.params.dni }, req.body, { new: true });
        if (!doctor) {
            return res.status(404).json({ mensaje: "Doctor no encontrado" });
        }
        res.json(doctor);
    } catch (error) {
        console.error("ERROR AL MODIFICAR DOCTOR", error);
        res.status(500).json({ mensaje: "Error al modificar el doctor", error: error.message });
    };
});


//Obtener doctores por especialidad
router.get("/:especialidad", async (req, res) => {
    try {
        const doctor = await Doctor.find({
            especialidad: req.params.especialidad,
        });  //es el select sql
        if (!doctor) {
            return res.status(404).json({
               mensaje: "No doctor encontrado" ,
            });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener doctores", error });
    };
});

export default router;