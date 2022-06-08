import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import veterinaryRouter from "./routes/veterinaryRoutes.js";
import patientRouter from "./routes/patientRoutes.js";
import cors from "cors";


const app = express();
const port = process.env.PORT || 4000;

//connect the database
connectDb();

//we need this to get the data from the request body on register veterinary
app.use(express.json());

const allowUrl = [process.env.FRONTEND_URL ];

const corsOptions = {
    origin: function(origin, callback){
        if(allowUrl.indexOf(origin) !== -1){
            //the origin of the request is allowed.
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
})

// veterinary url
app.use("/api/veterinaries", veterinaryRouter);

// patient url
app.use("/api/patients", patientRouter);


