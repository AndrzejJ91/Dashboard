import mqtt from 'mqtt';
import Mqtt from '../models/mqttModles';
import dotenv from 'dotenv';


dotenv.config();


const MQTT_URL = process.env.MQTT_URL || (process.env.DOCKER_ENV ? 'mqtt://mqtt:1883' : 'mqtt://localhost:1883');


// List of topics to subscribe to
const topics = ['Machine_Status', 'New_Machines', 'Machine_Errors'];


export const mqttClient = mqtt.connect(MQTT_URL);



mqttClient.on('connect', () => {
    
    console.log("Connected to MQTT broker");

    

    mqttClient.subscribe(topics, {qos: 1}, (error) => {
        if (error) {
            console.error("Subscription error:", error);
        }else {
            console.log(`✅ Subscribed to topic: ${topics}`);
        }
    });
});

mqttClient.on('message', async (topic, message) => {

      try {
        const messageStr = await message.toString();
        
        console.log(`📩 Received message from topic"${topic}": ${messageStr}`);

                
        // Save the message in the database with the exact topic it was received from
        const newMessage = await new Mqtt({ topic, category: topic, message: messageStr })
        const saveDoc = await newMessage.save();
        console.log(`📥 MQTT: Message saved from topic "${topic}"`, saveDoc);
        

    } catch (error) {
        console.error("Error saving message:", error);
    };
});


mqttClient.on('error', (error) => {
    console.error("Error connecting to MQTT broker:", error);
});
