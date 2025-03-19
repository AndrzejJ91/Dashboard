import React from 'react';

interface Message {
  _id: string;
  topic: string;
  message: string;
  queueName: string;
  status: string;
  attempts: number;
  scheduledAt?: Date;
  createdAt: Date;
}

const MessageItemRabbitmq: React.FC<{ message: Message }> = ({ message }) => {
  // Status color
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
        return 'bg-green-200 text-green-700';
      case 'pending':
        return 'bg-yellow-200 text-yellow-700';
      case 'failed':
        return 'bg-red-200 text-red-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <li className="bg-white border border-gray-300 p-5 rounded-lg shadow-xl mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">📦 Queue: {message.queueName}</h3>
        <span className={`text-sm px-2 py-1 rounded-md ${getStatusStyle(message.status)}`}>
          {message.status}
        </span>
      </div>

      {/* Message content */}
      <p className="text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-3 italic">
        „{message.message}”
      </p>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
        <p>📌 <strong>Topic:</strong> {message.topic}</p>
        <p>🔄 <strong>Attempts:</strong> {message.attempts}</p>
        <p>⏳ <strong>Scheduled:</strong> {message.scheduledAt ? message.scheduledAt.toLocaleString() : "Brak"}</p>
        <p>📅 <strong>Created:</strong> {message.createdAt.toLocaleString()}</p>
      </div>
    </li>
  );
};

export default MessageItemRabbitmq;
