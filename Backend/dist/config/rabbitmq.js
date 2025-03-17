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
exports.publishMessage = exports.consumeAndSaveRabbitMessages = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
const rabbitMQModles_1 = __importDefault(require("../models/rabbitMQModles"));
dotenv_1.default.config();
const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield amqplib_1.default.connect(RABBITMQ_URI);
        console.log('Połączono z RabbitMQ');
        const channel = yield connection.createChannel();
        // Tworzenie kolejki, np. 'testQueue'
        const queue = 'testQueue';
        yield channel.assertQueue(queue, { durable: true });
        return { connection, channel, queue };
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
    ;
});
exports.connectRabbitMQ = connectRabbitMQ;
const consumeAndSaveRabbitMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channel, queue } = yield (0, exports.connectRabbitMQ)();
        channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (msg !== null) {
                const content = msg.content.toString();
                console.log("Otrzymano wiadomość z RabbitMQ:", content);
                if (content.trim() === '') {
                    console.warn("Odebrana wiadomość jest pusta – pomijam zapis");
                    channel.ack(msg);
                    return; // wychodzimy z funkcji dla tej wiadomości
                }
                try {
                    // Tworzymy nowy dokument w MongoDB przy użyciu modelu RabbitModel
                    const newMessage = new rabbitMQModles_1.default({
                        title: "Nowa wiadomość",
                        topic: "status maszyny",
                        message: content,
                        queueName: queue,
                    });
                    yield newMessage.save();
                    console.log("Wiadomość zapisana w MongoDB");
                    channel.ack(msg); // potwierdzenie odbioru wiadomości
                }
                catch (error) {
                    console.error("Błąd zapisu wiadomości do MongoDB:", error);
                }
            }
        }));
    }
    catch (error) {
        console.error("Błąd podczas konsumowania wiadomości z RabbitMQ:", error);
    }
});
exports.consumeAndSaveRabbitMessages = consumeAndSaveRabbitMessages;
const publishMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { channel, queue } = yield (0, exports.connectRabbitMQ)();
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log("Wysłano wiadomość do RabbitMQ:", message);
});
exports.publishMessage = publishMessage;
