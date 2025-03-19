import { useEffect, useState } from 'react'



const useWebSocket = () => {
  const [messages, setMessages] = useState<{
    _id: any;topic: String, message: String
}[]>([]);

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("🟢 Connected to WebSocket");

    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📩 Message received:", data);

     

      // 🛠️ Check if the message already exists (prevents duplicates)
      setMessages((prev) =>
        prev.some((msg) => msg.message === data.message) ? prev : [data, ...prev]
      );
    };

    ws.onclose = () => {
      console.warn("❌ WebSocket connection closed. Attempting to reconnect...");
      setTimeout(() => useWebSocket(), 3000);
    };


    return () => {
      ws.close();

    }

  }, [])

  return messages;
}

export default useWebSocket
