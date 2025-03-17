import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/IBM';


const connectDB = async () => {
    // Jeśli istnieje aktywne połączenie, rozłączamy się
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URI as string, {
        connectTimeoutMS: 1000,          // Ustawia czas oczekiwania na połączenie na 1 sekundę
        serverSelectionTimeoutMS: 1000,  // Ustawia czas oczekiwania na wybór serwera na 1 sekundę
      });
      console.log("✅ Połączono z MongoDB!");


    } catch (error) {
        console.error({ success: false, message: "Błąd połączenia z bazą danych", error });

        // W testach rzucamy błąd, ale w normalnym środowisku wyłączamy aplikację
        if (process.env.NODE_ENV === "test") {
            throw new Error("Błąd połączenia z MongoDB");
        } else {
            process.exit(1);
        }
    }
};

export default connectDB;





