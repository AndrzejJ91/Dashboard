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

       // 🔥 Retrieve only messages from the selected queue
        const response = await axios.get(
          selectedQueue === "all"
            ? 'http://localhost:3000/api/rabbit-messages'
            : `http://localhost:3000/api/rabbit-messages?queueName=${selectedQueue}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transformation: convert dates to Date objects
        const transformed = response.data.map((msg: any) => ({
          ...msg,
          scheduledAt: msg.scheduledAt ? new Date(msg.scheduledAt) : undefined,
          createdAt: new Date(msg.createdAt),
        }));

        setRabbitMessages(transformed);
      } catch (error) {
        console.error('Error while fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedQueue]);

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-xl h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 my-5 text-center">📦 RabbitMQ Messages</h2>

      {/* 🔽 Queue filter */}
      <select
        className="w-full bg-gray-300 p-2 rounded-md mb-4"
        value={selectedQueue}
        onChange={(e) => setSelectedQueue(e.target.value)}
      >
        <option value="all">All Queues</option>
        <option value="Machine_Status">Machine Status</option>
        <option value="Broken_Machines">Broken Machines</option>
        <option value="New_Machines">New Machines</option> 
      </select>

      {/* 📩 Message list */}
      {rabbitMessages.length === 0 ? (
        <p className="text-gray-600 text-center">🚫 No messages in this queue</p>
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

