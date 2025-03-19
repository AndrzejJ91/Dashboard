import amqplib from 'amqplib';
import dotenv from "dotenv";
import RabbitMQSchema from '../models/rabbitMQModles';

dotenv.config();

const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';

// 🔥 Queues we use
const queueNames = ['New_Machines', 'Machine_Status', 'Broken_Machines'];

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(RABBITMQ_URI);
        console.log('✅ Connected to RabbitMQ');
        const channel = await connection.createChannel();

        // 🔥 Create ALL queues
        for (const queue of queueNames) {
            await channel.assertQueue(queue, { durable: true });
            console.log(`📌 Queue created: ${queue}`);
        }

        return { connection, channel };
    } catch (error) {
        console.error('❌Error connecting to RabbitMQ:', error);
        throw error;
    }
};

// 🔥 Consuming messages from ALL queues
export const consumeAndSaveRabbitMessages = async () => {
    try {
        const { channel } = await connectRabbitMQ();

        for (const queue of queueNames) {
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const content = msg.content.toString();
                    console.log(`📥 Received from ${queue}: ${content}`);

                    if (content.trim() === '') {
                        console.warn("⚠️ Empty message – skipping");
                        channel.ack(msg);
                        return;
                    }

                    try {
                        // Saving to MongoDB
                        const newMessage = new RabbitMQSchema({
                            title: "New message",
                            topic: queue,  
                            message: content,
                            queueName: queue,  
                        });
                        await newMessage.save();
                        console.log(`✅ Message saved in MongoDB with ${queue}`);
                        channel.ack(msg);
                    } catch (error) {
                        console.error("❌ Error saving message:", error);
                    }
                }
            });
        }
    } catch (error) {
        console.error("❌ Error while consuming message:", error);
    }
};

// 🔥 Sending message to a specific queue
export const publishMessage = async (queueName: string, message: string) => {
    try {
        const { channel } = await connectRabbitMQ();

        if (!queueNames.includes(queueName)) {
            console.error(`❌ Error: Unknown queue ${queueName}`);
            return;
        }

        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        console.log(`📤 Sent to ${queueName}: ${message}`);
    } catch (error) {
        console.error('❌ Error sending message:', error);
    }
};
