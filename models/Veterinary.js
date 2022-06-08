import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateToken from "../helpers/generateToken.js";


const veterinarySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true, //to delete empty spaces
        required: true //to add validation to the database
    },

    password: {
        type: String,
        required: true //to add validation to the database
    },

    email: {
        type: String,
        trim: true, //to delete empty spaces
        required: true, //to add validation to the database
        unique: true //only one email per database
    },

    tel: {
        type: String,
        trim: true, //to delete empty spaces
        default: null //to add validation to the database
    },

    web: {
        type: String,
        trim: true, //to delete empty spaces
        default: null //to add validation to the database
    },
    token: {
        type: String,
        default: generateToken()
    },

    confirmed: { //check if the user is confirmed
        type: Boolean,
        default: false 
    }
});

//with this we hash the password before save the data
veterinarySchema.pre("save", async function (next) {
    //we check if the password is being modified
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//here we create a new method for the veterinarymodel to check if the password 
//we insert into the form is the same as the hash password
veterinarySchema.methods.checkPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
}

const veterinaryModel = mongoose.model("veterinaries", veterinarySchema); //the first parameter is the colletion name

export default veterinaryModel;