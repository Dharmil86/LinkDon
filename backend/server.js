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
    const connectDB = await mongoose.connect(process.env.MONGO_URL);
    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}

start();


