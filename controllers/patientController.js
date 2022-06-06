import patientModel from "../models/Patient.js"



export const showPatients = async (req, res) => {
    const patients = await patientModel.find().where("veterinary").equals(req.veterinary);

    res.json(patients);
}

export const addPatients = async (req, res) => {
    const patient = new patientModel(req.body);
    patient.veterinary = req.veterinary._id;
    try {
        const savedPatient = await patient.save();
        res.json(savedPatient)
    } catch (error) {
        console.log(error)
    }
}

export const showPatient = async (req, res) => {
    //here we get the patient from the id in the url
    const patient = await patientModel.findById(req.params.id);

    //we verify that there is a pacient with that id
    if(!patient) {
       return res.status(404).json({msg:"User can not be found"})
    }
    
    //here we verify that the patient found is from the logged veterinary
    if(patient.veterinary.toString() !== req.veterinary.id.toString()) {
        return res.json({msg: "The action is not valid"});
    } 

    res.json(patient); 
}

export const editPatient = async (req, res) => {
    const patient = await patientModel.findById(req.params.id);

    if(!patient) {
        return res.status(404).json({msg:"User can not be found"})
     }
     
     if(patient.veterinary.toString() !== req.veterinary.id.toString()) {
         return res.json({msg: "The action is not valid"});
     } 
     
     //update patient
     patient.name = req.body.name || patient.name;
     patient.owner = req.body.owner || patient.owner;
     patient.date = req.body.date || patient.date;
     patient.email = req.body.email || patient.email;
     patient.symptoms = req.body.symptoms || patient.symptoms;

     try {
         const updatedPatient = await patient.save();
         res.json(updatedPatient);
     } catch (error) {
         console.log(error);
     }
}

export const deletePatient = async (req, res) => {
    const patient = await patientModel.findById(req.params.id);

    if(!patient) {
        return res.status(404).json({msg:"User can not be found"})
     }
     
     if(patient.veterinary.toString() !== req.veterinary.id.toString()) {
         return res.json({msg: "The action is not valid"});
     } 
     
     //delete patient
    try {
        await patient.deleteOne();
        res.json({msg: `Patient ${patient.name} deleted!`})
    } catch (error) {
        console.log(error);
    }
}