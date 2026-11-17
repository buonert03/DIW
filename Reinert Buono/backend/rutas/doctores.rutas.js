import express from "express";
import mongoose from "mongoose";
import Cita from "../modelos/Cita.js";
import Doctor from "../modelos/Doctor.js";

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: "El ID del doctor no es válido" });
    }

    const tieneCitas = await Cita.exists({ doctorId: req.params.id });
    if (tieneCitas) {
      return res.status(409).json({
        mensaje: "No se puede eliminar un doctor que tiene citas asociadas",
      });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ mensaje: "Doctor no encontrado" });
    }
    res.json({ mensaje: "Doctor eliminado" });
  } catch (error) {
    console.error("ERROR AL ELIMINAR DOCTOR", error);
    res.status(500).json({ mensaje: "No se pudo eliminar el doctor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const datos = { ...req.body };
    delete datos._id;
    delete datos.__v;
    delete datos.iddoc;

    const doctor = await new Doctor(datos).save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error("ERRO AO CREAR O DOUTOR", error);
    const status = ["ValidationError", "CastError"].includes(error.name) ? 400 : 500;
    res.status(status).json({
      mensaje: "Non se puido crear o doutor",
      error: error.message,
    });
  }
});

router.get("/", async (_req, res) => {
  try {
    const doctores = await Doctor.find();
    res.json(doctores);
  } catch (error) {
    console.error("ERROR AL OBTENER DOCTORES", error);
    res.status(500).json({ mensaje: "Error al obtener los doctores" });
  }
});

router.get("/especialidad/:especialidad", async (req, res) => {
  try {
    const doctores = await Doctor.find({ espedoc: req.params.especialidad });
    res.json(doctores);
  } catch (error) {
    console.error("ERROR AL BUSCAR DOCTORES POR ESPECIALIDAD", error);
    res.status(500).json({ mensaje: "Error al obtener doctores" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ mensaje: "El ID del doctor no es válido" });
    }

    const datos = { ...req.body };
    delete datos._id;
    delete datos.__v;
    delete datos.iddoc;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      datos,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ mensaje: "Doctor no encontrado" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("ERROR AL MODIFICAR DOCTOR", error);
    const status = ["ValidationError", "CastError"].includes(error.name) ? 400 : 500;
    res.status(status).json({
      mensaje: "Error al modificar el doctor",
      error: error.message,
    });
  }
});

export default router;
