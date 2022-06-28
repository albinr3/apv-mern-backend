import emailForgotPassword from "../helpers/emailForgotPassword.js";
import emailSignUp from "../helpers/emailSignUp.js";
import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import veterinaryModel from "../models/Veterinary.js";



//with this function we signUp a new veterinary with the data send by the user
export const signUp = async (req, res) => {
    
    const {email, name} = req.body;

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

        //send the email to confirm the account
        emailSignUp({
            email,
            name,
            token: veterinarySaved.token
        });

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
        console.log("user is active")
    } catch (error) {
        console.log(error)
    }

}

//with this we autheticate the user, first check if the email exist
//then check if it is confirmed, then check if the password is correct
//then we generate a json web token to storage the session.
export const authenticateUser = async (req, res) => {
    const {email, password} = req.body;

    //check if the user exist
    const user = await veterinaryModel.findOne({email});
    console.log(user)
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
        //here we generate a json web token with the user id and we pass the res.
        res.json( {profile: {_id: user._id, token: generateJWT(user.id)}});
    } else {
        const error = new Error("Password is incorrect, try again!");
        return res.status(403).json({msg: error.message});
    }

    
}

//here we write your account email and we get an mail with a link to reset the password
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

        //send the email to reset the password
        emailForgotPassword({
            email,
            token: veterinaryExist.token,
            name: veterinaryExist.name
        });

        res.json({msg: "We sent an email with the info" })
    } catch (error) {
        console.log(error)
    }
}

//here we verify if the token in the url from the email is valid
export const checkTokenPassword = async (req, res) => {
    const {token} = req.params;

    const validToken = await veterinaryModel.findOne({token});

    if(validToken) {
        
        res.json({msg: "Please write a new password"});

    } else {
        const error = new Error("Url is not valid!");
        return res.status(400).json({msg: error.message});
    }
}

//here we get the new password from the form and post it to the database
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

//this function is used to update the veterinary profile info
export const editProfile = async(req, res) => {
    const {id} = req.params;
    const {name, email, tel, web } = req.body.profile
    const veterinary = await veterinaryModel.findById(id);

    if(!veterinary) {
        const error = new Error("Vetirinary is not valid!");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinary.name = name || veterinary.name;
        veterinary.email = email || veterinary.email;
        veterinary.tel = tel || veterinary.tel;
        veterinary.web = web || veterinary.web;

        const updatedVeterinary = await veterinary.save();
        res.json(updatedVeterinary)

    } catch (error) {
        console.log(error)
    }


    console.log(req.body)

}

//this function is used to change the password when you are logged in
export const updatePassword = async(req, res) => {
    const {_id} = req.veterinary;

    const {pass, oldPass} = req.body;

    const veterinary = await veterinaryModel.findById(_id);

    //we check if there is a veterinary with that id
    if(!veterinary){
        const error = new Error("There is no that veterinary, try again!");
        return res.status(403).json({msg: error.message});
    }

    //check if the actual password is correct
    if(await veterinary.checkPassword(oldPass)) {
        console.log("contraseña correcta")
        
        //if the actual password is correct, then we save the new pasword
        veterinary.password = pass;
        await veterinary.save()

        res.json({msg: "Password change successful"});
    } else {
        const error = new Error("Old Password is incorrect, try again!");
        return res.status(403).json({msg: error.message});
    }

}