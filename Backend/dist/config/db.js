"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/IBM';
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Jeśli istnieje aktywne połączenie, rozłączamy się
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 1000, // Ustawia czas oczekiwania na połączenie na 1 sekundę
            serverSelectionTimeoutMS: 1000, // Ustawia czas oczekiwania na wybór serwera na 1 sekundę
        });
        console.log("✅ Połączono z MongoDB!");
    }
    catch (error) {
        console.error({ success: false, message: "Błąd połączenia z bazą danych", error });
        // W testach rzucamy błąd, ale w normalnym środowisku wyłączamy aplikację
        if (process.env.NODE_ENV === "test") {
            throw new Error("Błąd połączenia z MongoDB");
        }
        else {
            process.exit(1);
        }
    }
});
exports.default = connectDB;
/*

import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// Użyj zmiennej środowiskowej MONGO_URI, jeśli jest ustawiona, w przeciwnym wypadku domyślnie połącz się z lokalną bazą
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/IBM';


const connectDB = async () => {

    try {
        await mongoose.connect(mongoUri);
      

    }catch (error) {
        console.error({success: false, message: "Błąd połączenia z bazą danych", error});
        throw new Error("Błąd połączenia z MongoDB"); // 👈 Rzucamy błąd dla testów
        

    };

};

export default connectDB;

*/ 
