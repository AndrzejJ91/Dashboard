import amqplib from 'amqplib';
import dotenv from "dotenv";
import RabbitMQSchema from '../models/rabbitMQModles';

dotenv.config();

const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';

// 🔥 Kolejki, których używamy
const queueNames = ['Nowe_Maszyny', 'Status_Maszyny', 'Popsute_Maszyny'];

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(RABBITMQ_URI);
        console.log('✅ Połączono z RabbitMQ');
        const channel = await connection.createChannel();

        // 🔥 Tworzymy WSZYSTKIE kolejki
        for (const queue of queueNames) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`📌 Kolejka utworzona: ${queue}`);
        }

        return { connection, channel };
    } catch (error) {
        console.error('❌ Błąd połączenia z RabbitMQ:', error);
        throw error;
    }
};

// 🔥 Konsumowanie wiadomości z WSZYSTKICH kolejek
export const consumeAndSaveRabbitMessages = async () => {
    try {
        const { channel } = await connectRabbitMQ();

        for (const queue of queueNames) {
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const content = msg.content.toString();
                    console.log(`📥 Odebrano z ${queue}: ${content}`);

                    if (content.trim() === '') {
                        console.warn("⚠️ Pusta wiadomość – pomijam");
                        channel.ack(msg);
                        return;
                    }

                    try {
                        // Zapis do MongoDB
                        const newMessage = new RabbitMQSchema({
                            title: "Nowa wiadomość",
                            topic: queue,  
                            message: content,
                            queueName: queue,  
                        });
                        await newMessage.save();
                        console.log(`✅ Wiadomość zapisana w MongoDB z ${queue}`);
                        channel.ack(msg);
                    } catch (error) {
                        console.error("❌ Błąd zapisu wiadomości:", error);
                    }
                }
            });
        }
    } catch (error) {
        console.error("❌ Błąd podczas konsumowania wiadomości:", error);
    }
};

// 🔥 Wysyłanie wiadomości do konkretnej kolejki
export const publishMessage = async (queueName: string, message: string) => {
    try {
        const { channel } = await connectRabbitMQ();

        if (!queueNames.includes(queueName)) {
            console.error(`❌ Błąd: Nieznana kolejka ${queueName}`);
            return;
        }

        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        console.log(`📤 Wysłano do ${queueName}: ${message}`);
    } catch (error) {
        console.error('❌ Błąd wysyłania wiadomości:', error);
    }
};
