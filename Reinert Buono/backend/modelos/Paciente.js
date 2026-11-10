import mongoose from "mongoose";

// Define os campos e a colección MongoDB dos pacientes.
const PacienteSchema = new mongoose.Schema({
    dnipac: { type: String, required: true },
    nomepac: { type: String, required: true },
    apelpac: { type: String, required: true },
    nacipac: { type: String, required: false },
    mailpac: { type: String, required: false },
    movilpac: { type: String, required: true },
    dirpac: { type: String, required: false },
    propac: { type: String, required: false },
    munipac: { type: String, required: false },
    lopdpac: { type: Boolean, required: true }
    },
    {
    collection: "pacientes"
    }
);

export default mongoose.model("Paciente", PacienteSchema);