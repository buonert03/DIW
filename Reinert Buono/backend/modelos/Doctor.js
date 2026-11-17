import mongoose from "mongoose";

// Define los campos, validaciones y colección MongoDB de los doctores.
const DoctorSchema = new mongoose.Schema({
    iddoc: { type: String, required: true, unique: true },
    nomedoc: { type: String, required: true },
    apeldoc: { type: String, required: true },
    coledoc: { type: Boolean, required: true },
    maildoc: { type: String, required: false },
    movildoc: { type: String, required: true },
    espedoc: { type: String, required: true }
    },
    {
    collection: "doctores"
    }
);

// Exporta el modelo reutilizando la colección "doctores".
export default mongoose.model("Doctor", DoctorSchema);