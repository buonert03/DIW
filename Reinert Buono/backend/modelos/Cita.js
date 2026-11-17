/*import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

// Esquema de las citas; timestamps añade createdAt y updatedAt a cada registro.
const CitaSchema = new mongoose.Schema(
  {
    idcita: { type: Number, required: true, unique: true },
    dnipac: { type: String, required: true, index: true },
    nomedoc: { type: String, required: true, maxlength: 150 },
    iddoc: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    motivo: { type: String, default: "", maxlength: 500 },
    diagnostico: { type: String, default: "", maxlength: 500 },
    estado: { type: String, enum: ["Pendiente", "Realizada", "Cancelada"], default: "Pendiente" },
  },
  {
    collection: "citas",
    timestamps: true,
  }
);

// Contador persistente usado para asignar IDs numéricos únicos aunque se reinicie el servidor.
const SecuenciaSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    valor: { type: Number, required: true, default: 0 },
  },
  { collection: "secuencias", versionKey: false }
);

const Cita = mongoose.models.Cita || mongoose.model("Cita", CitaSchema);
const Secuencia = mongoose.models.Secuencia || mongoose.model("Secuencia", SecuenciaSchema);

// Migra los identificadores antiguos que no sean enteros positivos y sincroniza el contador.
export async function inicializarIdsCita() {
  const documentos = await Cita.collection
    .find({}, { projection: { _id: 1, idcita: 1, createdAt: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray();
  const necesitanMigracion = documentos.some(
    ({ idcita }) => !Number.isSafeInteger(idcita) || idcita < 1
  );

  if (necesitanMigracion) {
    // Los valores temporales evitan colisiones con el índice único durante la renumeración.
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

// Incrementa atómicamente la secuencia en MongoDB y devuelve el nuevo ID.
export async function seguinteIdCita() {
  const secuencia = await Secuencia.findOneAndUpdate(
    { _id: "citas" },
    { $inc: { valor: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return secuencia.valor;
}

export default Cita;
*/
import mongoose from "mongoose";

const CitaSchema = new mongoose.Schema(
    {
        pacienteDNI: {
            type: String,
            required: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        fecha: { type: String, required: true },
        hora: { type: String, required: true },
        motivo: { type: String, required: true },
        observacions: {
            type: String,
            default: ""
        },
        estado: {
            type: String,
            default: "pendente"
        }
    },
    {
        collection: "citas"
    }
);

export default mongoose.model("Cita", CitaSchema);