import express from "express";
import Cita, { seguinteIdCita } from "../modelos/Cita.js";
import Doctor from "../modelos/Doctor.js";
import Paciente from "../modelos/Paciente.js";

const router = express.Router();

function datosCitaValidos({ iddoc, fecha, hora, motivo = "", diagnostico = "", estado = "Pendiente" }, dni) {
  return Boolean(
    dni &&
      typeof iddoc === "string" &&
      iddoc.trim() &&
      typeof fecha === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
      typeof hora === "string" &&
      /^\d{2}:\d{2}$/.test(hora) &&
      Number(hora.slice(0, 2)) <= 23 &&
      Number(hora.slice(3, 5)) <= 59 &&
      !Number.isNaN(new Date(`${fecha}T00:00:00Z`).getTime()) &&
      new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) === fecha &&
      fecha >= new Date().toISOString().slice(0, 10) &&
      typeof motivo === "string" &&
      motivo.length <= 500 &&
      typeof diagnostico === "string" &&
      diagnostico.length <= 500 &&
      ["Pendiente", "Realizada", "Cancelada"].includes(estado)
  );
}

function consultaCitaPorId(id) {
  return { idcita: Number(id) };
}

function idCitaValido(id) {
  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
}

// Demo para prácticas: el DNI identifica las citas, pero no verifica la identidad.
router.get("/:dni", async (req, res) => {
  try {
    const dni = req.params.dni.trim().toUpperCase();
    const citas = await Cita.find({ dnipac: dni }).sort({ fecha: 1, hora: 1 });
    res.json(citas);
  } catch (error) {
    console.error("Erro ao obter as citas:", error);
    res.status(500).json({ mensaje: "Non se puideron cargar as citas" });
  }
});

// Garda a cita asociándoa co DNI dunha ficha de paciente existente.
router.post("/", async (req, res) => {
  try {
    const { iddoc, fecha, hora, motivo = "", diagnostico = "", estado = "Pendiente" } = req.body ?? {};
    const dni = typeof req.body?.dnipac === "string" ? req.body.dnipac.trim().toUpperCase() : "";
    if (!datosCitaValidos(req.body ?? {}, dni)) {
      return res.status(400).json({ mensaje: "Revisa os datos da cita" });
    }

    const pacienteExiste = await Paciente.exists({ dnipac: dni });
    if (!pacienteExiste) {
      return res.status(404).json({ mensaje: "Non existe un paciente con ese DNI" });
    }

    const doctor = await Doctor.findOne({ iddoc: iddoc.trim() });
    if (!doctor) {
      return res.status(404).json({ mensaje: "Non existe un doutor con ese ID" });
    }

    const cita = await Cita.create({
      idcita: await seguinteIdCita(),
      dnipac: dni,
      iddoc: doctor.iddoc,
      nomedoc: `${doctor.nomedoc} ${doctor.apeldoc}`.trim(),
      fecha,
      hora,
      motivo: motivo.trim(),
      diagnostico: diagnostico.trim(),
      estado,
    });
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

    const { iddoc, fecha, hora, motivo = "", diagnostico = "", estado = "Pendiente" } = req.body ?? {};
    const dni = typeof req.body?.dnipac === "string" ? req.body.dnipac.trim().toUpperCase() : "";
    if (!datosCitaValidos(req.body ?? {}, dni)) {
      return res.status(400).json({ mensaje: "Revisa os datos da cita" });
    }

    const pacienteExiste = await Paciente.exists({ dnipac: dni });
    if (!pacienteExiste) {
      return res.status(404).json({ mensaje: "Non existe un paciente con ese DNI" });
    }

    const doctor = await Doctor.findOne({ iddoc: iddoc.trim() });
    if (!doctor) {
      return res.status(404).json({ mensaje: "Non existe un doutor con ese ID" });
    }

    const cita = await Cita.findOneAndUpdate(
      consultaCitaPorId(req.params.id),
      {
        dnipac: dni,
        iddoc: doctor.iddoc,
        nomedoc: `${doctor.nomedoc} ${doctor.apeldoc}`.trim(),
        fecha,
        hora,
        motivo: motivo.trim(),
        diagnostico: diagnostico.trim(),
        estado,
      },
      { new: true, runValidators: true }
    );
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

    const cita = await Cita.findOneAndDelete(consultaCitaPorId(req.params.id));
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
