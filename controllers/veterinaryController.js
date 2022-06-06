import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import veterinaryModel from "../models/Veterinary.js";



//with this function we signUp a new veterinary with the data send by the user
export const signUp = async (req, res) => {
    
    const {email} = req.body;

    //avoid duplicate veterinaries
    const userExist = await veterinaryModel.findOne({
        email:email
    });
    
    if(userExist) {
        const error = new Error("El usuario ya existe");

        return res.status(400).json({msg: error.message});
    }

    try {

        //save a new veterinary
        const veterinary = new veterinaryModel(req.body);

        const veterinarySaved = await veterinary.save();

        //response
        res.json(veterinarySaved)
    } catch (error) {
        console.log(error);
    }
    
};

export const profile = (req, res) => {
    const { veterinary } = req;
    res.json({ profile: veterinary})
};

//with this function we check if the user get into the url with a valid token
//if it is a valid token so the account get confirmed and the token is deleted.
export const confirm = async (req, res) => {
    const { token } = req.params;

    const confirmUser = await veterinaryModel.findOne( {token} ); //we search the token in the db

    if(!confirmUser) {
        const error = new Error("Token is not valid!");
        return res.status(404).json({msg: error.message});
    }

    try {
        confirmUser.token = null;
        confirmUser.confirmed = true;
        await confirmUser.save();
        res.json({msg: "User is now active!!"})
    } catch (error) {
        console.log(error)
    }

    console.log(confirmUser);
    res.json({msg: "Confirming the account...."})
}

//with this we autheticate the user, first check if the email exist
//then check if it is confirmed, then check if the password is correct
//then we generate a json web token to storage the session.
export const authenticateUser = async (req, res) => {
    const {email, password} = req.body;

    //check if the user exist
    const user = await veterinaryModel.findOne({email});

    if(!user) {
        const error = new Error("User does not exist!");
        return res.status(403).json({msg: error.message});
    }

    //check if the user is confirmed
    if(!user.confirmed) {
        const error = new Error("User is not confirmed!");
        return res.status(403).json({msg: error.message});
    }

    //check if the password is correct
    if(await user.checkPassword(password)) {
        console.log("contraseña correcta")
    } else {
        const error = new Error("Password is incorrect, try again!");
        return res.status(403).json({msg: error.message});
    }

    //here we generate a json web token with the user id.
    res.json( {token: generateJWT(user.id)});

    res.json({msg:"User exist and is confirmed!!"})
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const veterinaryExist = await veterinaryModel.findOne({email});

    if(!veterinaryExist) {
        const error = new Error("User does not exist!");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinaryExist.token = generateToken();
        await veterinaryExist.save();

        res.json({msg: "We sent an email with the info" })
    } catch (error) {
        console.log(error)
    }
}

export const checkTokenPassword = async (req, res) => {
    const {token} = req.params;

    const validToken = await veterinaryModel.findOne({token});

    if(validToken) {
        res.json({msg: "Token is valid and the user exist"});

    } else {
        const error = new Error("Token is not valid!");
        return res.status(400).json({msg: error.message});
    }
}

export const newPassword = async (req, res) => {

    const {token} = req.params; //we get the token again.
    const {password} = req.body; //we get the new password from the form

    const veterinary = await veterinaryModel.findOne({token});

    if(!veterinary) {
        const error = new Error("Token is not valid!");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinary.token = null; //we eliminate the token
        veterinary.password = password;
        await veterinary.save();

        res.json({msg: "Password change successful"});
        
    } catch (error) {
        console.log(error)
    }
}