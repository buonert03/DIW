import express from "express";
import Cita from "../modelos/Cita.js";
import Doctor from "../modelos/Doctor.js";

const router = express.Router();
const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";

// Normaliza y valida DNI/NIE comprobando que su letra corresponda al número.
function normalizarDni(valor) {
    if (typeof valor !== "string") return "";
    const dni = valor.trim().toUpperCase();
    if (/^\d{8}[A-Z]$/.test(dni)) {
        return dni[8] === LETRAS_DNI[Number(dni.slice(0, 8)) % 23] ? dni : "";
    }
    if (/^[XYZ]\d{7}[A-Z]$/.test(dni)) {
        const prefixo = { X: "0", Y: "1", Z: "2" }[dni[0]];
        return dni[8] === LETRAS_DNI[Number(prefixo + dni.slice(1, 8)) % 23] ? dni : "";
    }
    return "";
}

// Elimina el doctor identificado por su DNI.
router.delete("/:iddoc", async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndDelete({ iddoc: req.params.iddoc });
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


// Valida el DNI, evita duplicados y crea el doctor con los datos recibidos.
router.post("/", async (req, res) => {
    try {
        const iddoc = normalizarDni(req.body?.iddoc);
        if (!iddoc) {
            return res.status(400).json({ mensaje: "Introduce un DNI ou NIE válido" });
        }

        const doctorExistente = await Doctor.findOne({
            iddoc: { $regex: new RegExp(`^${iddoc}$`, "i") },
        });
        if (doctorExistente) {
            return res.status(409).json({
                mensaje: "Xa existe un doutor con este DNI",
            });
        }

        const datos = { ...req.body, iddoc };
        delete datos._id;
        delete datos.__v;
        const doctor = new Doctor(datos);
        const nuevoDoctor = await doctor.save();
        res.status(201).json(nuevoDoctor);
    } catch (error) {
        console.error("ERRO AO CREAR O DOUTOR", error);
        res.status(500).json({
            mensaje: "Non se puido crear o doutor",
        });
    }
});

// Busca un doctor usando el DNI normalizado y una comparación sin distinguir mayúsculas.
router.get("/dni/:iddoc", async (req, res) => {
    try {
        const iddoc = normalizarDni(req.params.iddoc);
        if (!iddoc) {
            return res.status(400).json({ mensaje: "Introduce un DNI ou NIE válido" });
        }

        const doctor = await Doctor.findOne({
            iddoc: { $regex: new RegExp(`^${iddoc}$`, "i") },
        });
        if (!doctor) {
            return res.status(404).json({ mensaje: "Doctor no encontrado" });
        }
        res.json(doctor);
    } catch (error) {
        console.error("ERRO AO BUSCAR O DOUTOR", error);
        res.status(500).json({ mensaje: "Non se puido buscar o doutor" });
    }
});


// Devuelve todos los doctores registrados.
router.get("/", async (req, res) => {
    try {
        const doctores = await Doctor.find();
        res.json(doctores);
    } catch (error) {
        console.error("ERROR AL OBTENER DOCTORES", error);
        res.status(500).json({ mensaje: "Error al obtener los doctores", error: error.message });    };
});

// Actualiza un doctor; si cambia su DNI, también actualiza las citas relacionadas.
router.put("/:iddoc", async (req, res) => {
    try {
        const iddocAnterior = req.params.iddoc.trim().toUpperCase();
        const iddoc = normalizarDni(req.body?.iddoc);
        if (!iddoc) {
            return res.status(400).json({ mensaje: "Introduce un DNI ou NIE válido" });
        }

        const duplicado = await Doctor.findOne({
            iddoc: { $regex: new RegExp(`^${iddoc}$`, "i") },
        });
        if (duplicado && duplicado.iddoc.trim().toUpperCase() !== iddocAnterior) {
            return res.status(409).json({ mensaje: "Xa existe un doutor con este DNI" });
        }

        const datos = { ...req.body, iddoc };
        delete datos._id;
        delete datos.__v;
        const doctor = await Doctor.findOneAndUpdate(
            { iddoc: { $regex: new RegExp(`^${iddocAnterior}$`, "i") } },
            datos,
            { new: true, runValidators: true }
        );
        if (!doctor) {
            return res.status(404).json({ mensaje: "Doctor no encontrado" });
        }
        if (iddoc !== iddocAnterior) {
            await Cita.updateMany(
                { iddoc: iddocAnterior },
                { $set: { iddoc, nomedoc: `${doctor.nomedoc} ${doctor.apeldoc}`.trim() } }
            );
        }
        res.json(doctor);
    } catch (error) {
        console.error("ERROR AL MODIFICAR DOCTOR", error);
        res.status(500).json({ mensaje: "Error al modificar el doctor", error: error.message });
    }
});


// Devuelve los doctores que pertenecen a la especialidad indicada.
router.get("/:especialidad", async (req, res) => {
    try {
        const doctores = await Doctor.find({ espedoc: req.params.especialidad });
        res.json(doctores);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener doctores", error });
    };
});

export default router;