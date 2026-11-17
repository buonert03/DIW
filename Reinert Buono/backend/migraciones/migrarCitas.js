import mongoose from "mongoose";

const ESTADOS_CITA = new Set(["pendente", "realizada", "cancelada"]);

export async function migrarCitas() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB non está conectado; non se poden migrar as citas");
  }

  const doctores = await db
    .collection("doctores")
    .find({}, { projection: { _id: 1, iddoc: 1 } })
    .toArray();
  const doctorPorDni = new Map();
  const dnisDuplicados = new Set();
  for (const doctor of doctores) {
    if (typeof doctor.iddoc !== "string") continue;
    const dni = doctor.iddoc.trim().toUpperCase();
    if (doctorPorDni.has(dni)) {
      dnisDuplicados.add(dni);
    } else {
      doctorPorDni.set(dni, doctor._id);
    }
  }

  const citas = db.collection("citas");
  const citasAntigas = await citas
    .find({
      $or: [
        { pacienteDNI: { $in: [null, ""] } },
        { doctorId: null },
        { motivo: { $in: [null, ""] } },
      ],
    })
    .toArray();
  const actualizaciones = [];

  for (const cita of citasAntigas) {
    const pacienteDNI =
      typeof cita.pacienteDNI === "string"
        ? cita.pacienteDNI.trim().toUpperCase()
        : typeof cita.dnipac === "string"
          ? cita.dnipac.trim().toUpperCase()
          : "";
    const doctorId = mongoose.isObjectIdOrHexString(cita.doctorId)
      ? new mongoose.Types.ObjectId(cita.doctorId)
      : typeof cita.iddoc === "string"
        ? doctorPorDni.get(cita.iddoc.trim().toUpperCase())
        : null;
    const motivo =
      typeof cita.motivo === "string" && cita.motivo.trim()
        ? cita.motivo.trim()
        : "No especificado";
    const observacions =
      typeof cita.observacions === "string"
        ? cita.observacions
        : typeof cita.diagnostico === "string"
          ? cita.diagnostico
          : "";
    const estado =
      typeof cita.estado === "string" ? cita.estado.trim().toLowerCase() : "";
    const estadoNormalizado = ESTADOS_CITA.has(estado) ? estado : "pendente";

    if (
      !pacienteDNI ||
      !doctorId ||
      typeof cita.fecha !== "string" ||
      !cita.fecha ||
      typeof cita.hora !== "string" ||
      !cita.hora ||
      dnisDuplicados.has(String(cita.iddoc ?? "").trim().toUpperCase())
    ) {
      throw new Error(
        `Non se puido migrar a cita ${cita._id}; revisa as referencias e os datos obrigatorios`
      );
    }

    actualizaciones.push({
      updateOne: {
        filter: { _id: cita._id },
        update: {
          $set: {
            pacienteDNI,
            doctorId,
            motivo,
            observacions,
            estado: estadoNormalizado,
          },
        },
      },
    });
  }

  if (actualizaciones.length) {
    await citas.bulkWrite(actualizaciones);
  }
  return actualizaciones.length;
}
