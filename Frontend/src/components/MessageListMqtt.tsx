import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageItem from './MessageItem';

interface Message {
  _id: string;
  topic: string;
  category: String
  message: string;
  date: Date;
  status: string;
  sender: string;
  qos: number;
  isRead: boolean;
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectMessage, setSelectMessage] = useState<string>('all');


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/api/mqtt-messages', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const transformed: Message[] = response.data.map((msg: any) => ({
          _id: msg._id,
          category: msg.category,
          topic: msg.topic || "Missing title",
          message: msg.message,
          date: new Date(msg.createdAt),
          status: msg.status,
          sender: msg.sender,
          qos: msg.qos,
          isRead: msg.isRead,
        }));

        setMessages(transformed);
      } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
      }
    };

    fetchMessages();
  }, []);


  const filteredMessage = selectMessage === 'all'
  ? messages
  : messages.filter((msg) => msg.category === selectMessage);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    console.log("📩 Marking message as read, ID:", id);
    console.log("🛠️ Sending JWT token:", token);

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/mqtt-messages/${id}/read`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Response from backend:", response.data);
      setMessages(prev =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error("Error while marking the message as read:", error);
    }
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-xl h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 my-5 text-center">📡 MQTT Message</h2>

         {/* 🔽 Filtr tematu MQTT */}

        <select
          className='w-full bg-gray-300 p-2 rounded-md mb-4'
          value={selectMessage}
          onChange={(e) => setSelectMessage(e.target.value)}
        >
        <option value="all">All Topics</option>
        <option value="Machine_Status">Machine Status</option>
        <option value="Machine_Errors">Machine Errors</option>
        <option value="New_Machines">New Machines</option>
        </select>


      <div className="w-full flex flex-col items-center space-y-4">
        {filteredMessage.length === 0 ? (
          <p className="text-gray-600">No Messages</p>
        ) : (
          <ul className="w-full">
            {filteredMessage.map((msg) => (  // ✅ filtered list
              <MessageItem key={msg._id} message={msg} onMarkAsRead={markAsRead} />
  ))}
</ul>
        )}
      </div>
    </div>
  );
};

export default MessageList;


