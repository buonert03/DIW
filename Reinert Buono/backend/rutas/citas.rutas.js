import express from "express";
import mongoose from "mongoose";
import Cita from "../modelos/Cita.js";
import Doctor from "../modelos/Doctor.js";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();
const ESTADOS_CITA = ["pendente", "realizada", "cancelada"];

function datosCitaValidos({ doctorId, fecha, hora, motivo, estado = "pendente" }, pacienteDNI) {
  const fechaValida =
    typeof fecha === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
    !Number.isNaN(new Date(`${fecha}T00:00:00Z`).getTime()) &&
    new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) === fecha &&
    fecha >= new Date().toISOString().slice(0, 10);

  return Boolean(
    pacienteDNI &&
      mongoose.isValidObjectId(doctorId) &&
      fechaValida &&
      typeof hora === "string" &&
      /^\d{2}:\d{2}$/.test(hora) &&
      Number(hora.slice(0, 2)) <= 23 &&
      Number(hora.slice(3, 5)) <= 59 &&
      typeof motivo === "string" &&
      motivo.trim() &&
      ESTADOS_CITA.includes(estado)
  );
}

function idCitaValido(id) {
  return mongoose.isValidObjectId(id);
}

router.get("/:dni", async (req, res) => {
  try {
    const pacienteDNI = req.params.dni.trim().toUpperCase();
    const citas = await Cita.find({ pacienteDNI })
      .populate("doctorId", "nomedoc apeldoc")
      .sort({ fecha: 1, hora: 1 });
    res.json(citas);
  } catch (error) {
    console.error("Erro ao obter as citas:", error);
    res.status(500).json({ mensaje: "Non se puideron cargar as citas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      doctorId,
      fecha,
      hora,
      motivo,
      observacions = "",
      estado = "pendente",
    } = req.body ?? {};
    const pacienteDNI =
      typeof req.body?.pacienteDNI === "string"
        ? req.body.pacienteDNI.trim().toUpperCase()
        : "";

    if (
      !datosCitaValidos(
        { doctorId, fecha, hora, motivo, estado },
        pacienteDNI
      ) ||
      typeof observacions !== "string"
    ) {
      return res.status(400).json({ mensaje: "Revisa os datos da cita" });
    }

    const [pacienteExiste, doctor] = await Promise.all([
      Paciente.exists({ dnipac: pacienteDNI }),
      Doctor.findById(doctorId),
    ]);
    if (!pacienteExiste) {
      return res.status(404).json({ mensaje: "Non existe un paciente con ese DNI" });
    }
    if (!doctor) {
      return res.status(404).json({ mensaje: "Non existe un doutor con ese ID" });
    }

    const cita = await Cita.create({
      pacienteDNI,
      doctorId: doctor._id,
      fecha,
      hora,
      motivo: motivo.trim(),
      observacions: observacions.trim(),
      estado,
    });
    await cita.populate("doctorId", "nomedoc apeldoc");
    res.status(201).json(cita);
  } catch (error) {
    console.error("Erro ao gardar a cita:", error);
    res.status(500).json({ mensaje: "Non se puido gardar a cita" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!idCitaValido(req.params.id)) {
      return res.status(400).json({ mensaje: "O ID da cita non é válido" });
    }

    const {
      doctorId,
      fecha,
      hora,
      motivo,
      observacions = "",
      estado = "pendente",
    } = req.body ?? {};
    const pacienteDNI =
      typeof req.body?.pacienteDNI === "string"
        ? req.body.pacienteDNI.trim().toUpperCase()
        : "";

    if (
      !datosCitaValidos(
        { doctorId, fecha, hora, motivo, estado },
        pacienteDNI
      ) ||
      typeof observacions !== "string"
    ) {
      return res.status(400).json({ mensaje: "Revisa os datos da cita" });
    }

    const [pacienteExiste, doctor] = await Promise.all([
      Paciente.exists({ dnipac: pacienteDNI }),
      Doctor.findById(doctorId),
    ]);
    if (!pacienteExiste) {
      return res.status(404).json({ mensaje: "Non existe un paciente con ese DNI" });
    }
    if (!doctor) {
      return res.status(404).json({ mensaje: "Non existe un doutor con ese ID" });
    }

    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      {
        pacienteDNI,
        doctorId: doctor._id,
        fecha,
        hora,
        motivo: motivo.trim(),
        observacions: observacions.trim(),
        estado,
      },
      { new: true, runValidators: true }
    ).populate("doctorId", "nomedoc apeldoc");

    if (!cita) {
      return res.status(404).json({ mensaje: "Non existe esa cita" });
    }
    res.json(cita);
  } catch (error) {
    console.error("Erro ao actualizar a cita:", error);
    res.status(500).json({ mensaje: "Non se puido actualizar a cita" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!idCitaValido(req.params.id)) {
      return res.status(400).json({ mensaje: "O ID da cita non é válido" });
    }

    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: "Non existe esa cita" });
    }
    res.json({ mensaje: "A cita borrouse correctamente" });
  } catch (error) {
    console.error("Erro ao borrar a cita:", error);
    res.status(500).json({ mensaje: "Non se puido borrar a cita" });
  }
});

export default router;
