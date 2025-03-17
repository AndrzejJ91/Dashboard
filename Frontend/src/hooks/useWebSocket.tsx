import { useEffect, useState } from 'react'



const useWebSocket = () => {
  const [messages, setMessages] = useState<{
    _id: any;topic: String, message: String
}[]>([]);

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("🟢 Połączono z WebSocket");

    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📩 Otrzymano wiadomość:", data);

     

      // 🛠️ Sprawdzenie, czy wiadomość już istnieje (zapobiega duplikatom)
      setMessages((prev) =>
        prev.some((msg) => msg.message === data.message) ? prev : [data, ...prev]
      );
    };

    ws.onclose = () => {
      console.warn("❌ Połączenie WebSocket zamknięte. Próba ponownego połączenia...");
      setTimeout(() => useWebSocket(), 3000);
    };


    return () => {
      ws.close();

    }

  }, [])

  return messages;
}

export default useWebSocket
