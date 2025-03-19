import React from 'react';

interface Message {
  _id: string;
  topic: string;
  message: string;
  date: Date;
  status: string;
  sender: string;
  qos: number;
  isRead: boolean;
}

interface MessageItemProps {
  message: Message;
  onMarkAsRead: (id: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onMarkAsRead }) => {
  // Kolor statusu
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
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
    <li key={message._id} className="bg-white border border-gray-300 p-5 rounded-lg shadow-xl mb-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">📩 {message.topic || "Wiadomość"}</h3>
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
        <p>📅 <strong>Date:</strong> {message.date.toLocaleString()}</p>
        <p>🆔 <strong>ID:</strong> {message._id}</p>
        <p>📨 <strong>Sender:</strong> {message.sender}</p>
        <p>📊 <strong>QoS:</strong> {message.qos}</p>
      </div>

      {/* Read status */}
      <p className="mt-3 text-sm">
        ✅ <strong>Read:</strong> 
        <span className={message.isRead ? "text-green-500" : "text-red-500 ml-1"}>
          {message.isRead ? "Yes" : "No"}
        </span>
      </p>

      {/* button "Mark as read" */}
      {!message.isRead && (
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 cursor-pointer rounded-lg transition-all duration-300 shadow-md"
          onClick={() => onMarkAsRead(message._id)}
        >
          ✅ Mark as read
        </button>
      )}
    </li>
  );
};

export default MessageItem;


