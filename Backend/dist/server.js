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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
require("./config/mqtt");
const mqttRoutes_1 = __importDefault(require("./routes/mqttRoutes"));
const rabbitMqRoutes_1 = __importDefault(require("./routes/rabbitMqRoutes"));
const rabbitmq_1 = require("./config/rabbitmq");
const console_1 = require("console");
dotenv_1.default.config(); // Ładowanie zmiennych z .env
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Routers
//mqtt
app.use('/api/mqtt-messages', mqttRoutes_1.default);
app.use(`/api/mqtt-messages/:id/read`, mqttRoutes_1.default);
//rabbitMQ
app.use('/api/rabbit-messages', rabbitMqRoutes_1.default);
// Funkcja startująca serwer
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)(); // Połączenie z bazą danych
        console.log("✅ Połączono z bazą MongoDB");
        // Uruchamiamy konsumpcję wiadomości RabbitMQ
        (0, rabbitmq_1.consumeAndSaveRabbitMessages)().catch(console_1.error);
        app.listen(PORT, () => {
            console.log(`✅ Serwer działa na porcie: ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Błąd podczas uruchamiania serwera:", error);
        process.exit(1); // Zatrzymanie aplikacji w razie błędu
    }
});
// Start serwera
startServer();
