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
exports.mqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const mqttModles_1 = __importDefault(require("../models/mqttModles"));
exports.mqttClient = mqtt_1.default.connect('mqtt://localhost:1883');
// Przechowywanie wiadomości w pamięci (na potrzeby przykładu)
exports.mqttClient.on('connect', () => {
    console.log("Połączono z brokerem MQTT");
    exports.mqttClient.subscribe('test', { qos: 1 }, (error) => {
        if (error) {
            console.error("Błąd subskrypcji:", error);
        }
    });
});
exports.mqttClient.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageStr = yield message.toString();
        const newMessage = yield new mqttModles_1.default({ topic, message: messageStr });
        const saveDoc = yield newMessage.save();
        console.log("Zapisano wiadomość:", saveDoc);
    }
    catch (error) {
        console.error("Błąd zapisu wiadomości:", error);
    }
    ;
}));
exports.mqttClient.on('error', (error) => {
    console.error("Błąd połączenia z brokerem MQTT:", error);
});
