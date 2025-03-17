import mongoose from "mongoose";
import mqtt from "mqtt";
import Mqtt from "../models/mqttModles";
import { mqttClient } from "../config/mqtt";

process.env.MONGO_URI = "mongodb://localhost:27017/IBM"; // 👈 Wymuszamy tę samą bazę dla testów

beforeAll(async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🛠 Testy używają MongoDB pod adresem:", mongoose.connection.name);
});

afterAll(async () => {
    await mongoose.connection.close();
    mqttClient.end();
});

test("Powinno poprawnie połączyć się z MQTT brokerem", async () => {
    expect(mqttClient.connected).toBe(true);
});

test("Powinno subskrybować temat 'test'", async () => {
    await new Promise<void>((resolve, reject) => {
        mqttClient.subscribe("test", { qos: 1 }, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
});

test("Powinno publikować i zapisywać wiadomość w MongoDB", async () => {
    const testTopic = "test";
    const testMessage = "Testowa wiadomość";

    await new Promise<void>((resolve, reject) => {
        mqttClient.publish(testTopic, testMessage, { qos: 1 });

        mqttClient.on("message", async (topic, message) => {
            if (topic === testTopic) {
                try {
                    let savedMessage = null;
                    let attempts = 0;

                    while (!savedMessage && attempts < 5) {
                        await new Promise((res) => setTimeout(res, 500));
                        savedMessage = await mongoose.connection.collection("mqtts").findOne({
                            topic: testTopic,
                            message: testMessage
                        });
                        attempts++;
                    }

                    console.log("🔎 Sprawdzam MongoDB...", savedMessage);
                    expect(savedMessage).toBeTruthy();
                    expect(savedMessage?.message).toBe(testMessage);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
});
