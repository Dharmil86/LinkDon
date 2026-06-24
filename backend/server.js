import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postsRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(userRoutes);
app.use(postsRoutes);


const start = async () => {
    const connectDB = await mongoose.connect("mongodb://Dharmil:ypl92cvpp@ac-p98hl0s-shard-00-00.nfgshyy.mongodb.net:27017,ac-p98hl0s-shard-00-01.nfgshyy.mongodb.net:27017,ac-p98hl0s-shard-00-02.nfgshyy.mongodb.net:27017/?ssl=true&replicaSet=atlas-8gnhiw-shard-0&authSource=admin&appName=proconnect");
    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}

start();


