import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageItemRabbitmq from './MessageItemRabbitmq';

interface RabbitMessage {
  _id: string;
  topic: string;
  message: string;
  queueName: string;
  status: string;
  attempts: number;
  scheduledAt?: Date;
  createdAt: Date;
}

const MessageListRabbitmq: React.FC = () => {


  const [rabbitMessages, setRabbitMessages] = useState<RabbitMessage[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string>('all');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');

        // 🔥 Pobieramy tylko wiadomości z wybranej kolejki
        const response = await axios.get(
          selectedQueue === "all"
            ? 'http://localhost:3000/api/rabbit-messages'
            : `http://localhost:3000/api/rabbit-messages?queueName=${selectedQueue}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transformacja: konwersja dat na obiekty Date
        const transformed = response.data.map((msg: any) => ({
          ...msg,
          scheduledAt: msg.scheduledAt ? new Date(msg.scheduledAt) : undefined,
          createdAt: new Date(msg.createdAt),
        }));

        setRabbitMessages(transformed);
      } catch (error) {
        console.error('Błąd podczas pobierania wiadomości:', error);
      }
    };

    fetchMessages();
  }, [selectedQueue]); // 🔥 Za każdym razem, gdy zmienia się `selectedQueue`, pobieramy nowe dane

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-xl h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 my-5 text-center">📦 RabbitMQ Messages</h2>

      {/* 🔽 Filtr kolejki */}
      <select
        className="w-full bg-gray-300 p-2 rounded-md mb-4"
        value={selectedQueue}
        onChange={(e) => setSelectedQueue(e.target.value)}
      >
        <option value="all">Wszystkie kolejki</option>
        <option value="Status_Maszyny">Status Maszyny</option>
        <option value="Popsute_Maszyny">Popsute Maszyny</option>
        <option value="Nowe_Maszyny">Nowe Maszyny</option> 
      </select>

      {/* 📩 Lista wiadomości */}
      {rabbitMessages.length === 0 ? (
        <p className="text-gray-600 text-center">🚫 Brak wiadomości w tej kolejce</p>
      ) : (
        <ul className="w-full space-y-4">
          {rabbitMessages.map((msg) => (
            <MessageItemRabbitmq key={msg._id} message={msg} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageListRabbitmq;

