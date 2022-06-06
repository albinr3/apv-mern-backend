import jwt from "jsonwebtoken";
import veterinaryModel from "../models/Veterinary.js";

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            //here we get the token that is created when we authenthicate
            token = req.headers.authorization.split(" ")[1]; //we eliminate the "bearer" word
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //we decode the toke to get the user id
            //with this we will get the user who has that id and will get the info less the password
            req.veterinary = await veterinaryModel.findById(decoded.id).select("-password -token -confirmed"); //we storage the info in express
            
            return next();

        } catch (error) {
            const e = new Error("token is not valid!!");
            return res.status(403).json({msg: e.message});
        }

    } else {
        const error = new Error("Token does not exist!");
        return res.status(403).json({msg: error.message});
    }

    next();
}

export default checkAuth;