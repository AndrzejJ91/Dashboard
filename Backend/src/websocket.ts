import { WebSocketServer  } from "ws";


const wss = new WebSocketServer({port: 8080});

wss.on("connection", (ws) => {

    console.log("🔗 Nowe połączenie WebSocket");

    ws.on("message", (message) => {

            console.log(`📩 Otrzymano wiadomość: ${message}`);
    });

    

});



// Funkcja do wysyłania wiadomości do wszystkich klientów


export const broadCast = (data: any) => {

    wss.clients.forEach((client) => {
        if(client.readyState === 1) {
            client.send(JSON.stringify(data));

        };

    });

};


export {wss};