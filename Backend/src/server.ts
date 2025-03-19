import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from './middleware/corsConfig';
import connectDB from "./config/db";
import mqttRoutes from "./routes/mqttRoutes";
import rabbitMqRoutes  from './routes/rabbitMqRoutes';
import {consumeAndSaveRabbitMessages} from './config/rabbitmq';
import authMiddleware from "./middleware/auth";
import authRoutes from "./routes/authRoutes";
import "./config/mqtt";
import "./websocket";


dotenv.config(); // Loading variables from .env

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware

app.use(express.json());
app.use(cors(corsOptions))



//Routers

app.use('/api/auth',authRoutes);

app.use('/api/mqtt-messages',authMiddleware, mqttRoutes);
app.use(`/api/mqtt-messages/:id/read`,authMiddleware, mqttRoutes);
app.use('/api/rabbit-messages',authMiddleware, rabbitMqRoutes);






// Function to start the server
const startServer = async () => {
    try {
        await connectDB(); // Database connection
        console.log("✅ Connected to MongoDB database");
            
        
        // Start consuming RabbitMQ messages
        consumeAndSaveRabbitMessages().catch(err => console.error("RabbitMQ error:", err));

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error while starting the server:", error);
        process.exit(1); // Stop the application in case of an error
    }
};

// Start serwera
startServer();
