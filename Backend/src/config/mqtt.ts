import mqtt from 'mqtt';
import Mqtt from '../models/mqttModles';
import dotenv from 'dotenv';


dotenv.config();


const MQTT_URL = process.env.MQTT_URL || (process.env.DOCKER_ENV ? 'mqtt://mqtt:1883' : 'mqtt://localhost:1883');


// Lista tematów do subskrypcji
const topics = ['Status_Maszyny', 'Nowe_Maszyny', 'Błędy_Maszyn'];


export const mqttClient = mqtt.connect(MQTT_URL);



mqttClient.on('connect', () => {
    
    console.log("Połączono z brokerem MQTT");

    

    mqttClient.subscribe(topics, {qos: 1}, (error) => {
        if (error) {
            console.error("Błąd subskrypcji:", error);
        }else {
            console.log(`✅ Zasubskrybowano temat: ${topics}`);
        }
    });
});

mqttClient.on('message', async (topic, message) => {

      try {
        const messageStr = await message.toString();
        
        console.log(`📩 Otrzymano wiadomość z tematu "${topic}": ${messageStr}`);

                
        // Zapisujemy wiadomość w bazie dokładnie z takim tematem, jakim przyszła
        const newMessage = await new Mqtt({ topic, category: topic, message: messageStr })
        const saveDoc = await newMessage.save();
        console.log(`📥 MQTT: Zapisano wiadomość" z tematu "${topic}"`, saveDoc);
        

    } catch (error) {
        console.error("Błąd zapisu wiadomości:", error);
    };
});


mqttClient.on('error', (error) => {
    console.error("Błąd połączenia z brokerem MQTT:", error);
});
