import mongoose from "mongoose";

//modelo Doctor
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

export default mongoose.model("Doctor", DoctorSchema);