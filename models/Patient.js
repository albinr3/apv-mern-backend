import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    symptoms: {
        type: String,
        required: true
    },
    veterinary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "veterinaries"
    }
}, {
    timestamps: true
});

const patientModel = mongoose.model("patients", patientSchema);

export default patientModel;
