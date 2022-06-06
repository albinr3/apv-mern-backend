import mongoose from "mongoose";
import dotenv from "dotenv";

//

dotenv.config();
const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(url);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDb;