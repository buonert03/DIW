import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const CitaSchema = new mongoose.Schema(
  {
    idcita: { type: Number, required: true, unique: true },
    dnipac: { type: String, required: true, index: true },
    nomedoc: { type: String, required: true, maxlength: 150 },
    iddoc: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    motivo: { type: String, default: "", maxlength: 500 },
    estado: { type: String, enum: ["Pendiente"], default: "Pendiente" },
  },
  {
    collection: "citas",
    timestamps: true,
  }
);

const SecuenciaSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    valor: { type: Number, required: true, default: 0 },
  },
  { collection: "secuencias", versionKey: false }
);

const Cita = mongoose.models.Cita || mongoose.model("Cita", CitaSchema);
const Secuencia = mongoose.models.Secuencia || mongoose.model("Secuencia", SecuenciaSchema);

export async function inicializarIdsCita() {
  const documentos = await Cita.collection
    .find({}, { projection: { _id: 1, idcita: 1, createdAt: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray();
  const necesitanMigracion = documentos.some(
    ({ idcita }) => !Number.isSafeInteger(idcita) || idcita < 1
  );

  if (necesitanMigracion) {
    for (const documento of documentos) {
      await Cita.collection.updateOne(
        { _id: documento._id },
        { $set: { idcita: `migracion-${randomUUID()}` } }
      );
    }

    for (const [indice, documento] of documentos.entries()) {
      await Cita.collection.updateOne(
        { _id: documento._id },
        { $set: { idcita: indice + 1 } }
      );
    }
  }

  const idMaximo = necesitanMigracion
    ? documentos.length
    : documentos.reduce((maximo, { idcita }) => Math.max(maximo, idcita), 0);
  await Secuencia.updateOne(
    { _id: "citas" },
    { $max: { valor: idMaximo } },
    { upsert: true }
  );
}

export async function seguinteIdCita() {
  const secuencia = await Secuencia.findOneAndUpdate(
    { _id: "citas" },
    { $inc: { valor: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return secuencia.valor;
}

export default Cita;
