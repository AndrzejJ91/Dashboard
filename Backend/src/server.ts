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


dotenv.config(); // Ładowanie zmiennych z .env

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






// Funkcja startująca serwer
const startServer = async () => {
    try {
        await connectDB(); // Połączenie z bazą danych
        console.log("✅ Połączono z bazą MongoDB");
            
        
        // Uruchamiamy konsumpcję wiadomości RabbitMQ
        consumeAndSaveRabbitMessages().catch(err => console.error("Błąd RabbitMQ:", err));

        app.listen(PORT, () => {
            console.log(`✅ Serwer działa na porcie: ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Błąd podczas uruchamiania serwera:", error);
        process.exit(1); // Zatrzymanie aplikacji w razie błędu
    }
};

// Start serwera
startServer();
