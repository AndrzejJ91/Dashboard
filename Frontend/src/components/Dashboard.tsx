import MessageList from './MessageListMqtt';
import MessageListRabbitmq from './MessageListRabbitmq';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ Usuwamy token
    navigate('/login'); // ✅ Przekierowanie na stronę logowania
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col p-6 relative">
      {/* Przycisk Log Out */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 w-28 h-10 px-4 text-sm font-medium text-white 
          bg-blue-500 rounded-lg 
          transition-all duration-300 ease-in-out hover:bg-blue-600 cursor-pointer hover:shadow-lg"
      >
        Log Out
      </button>

      {/* Tytuł Dashboard */}
      <h1 className="lg:text-3xl text-2xl font-bold text-gray-800 text-center mb-6">
        Dashboard
      </h1>

      {/* Główna zawartość */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Sekcja MQTT */}
        <div className="bg-white p-6 rounded-lg shadow-2xl h-full max-h-[80vh] overflow-y-auto">
          <MessageList />
        </div>

        {/* Sekcja RabbitMQ */}
        <div className="bg-white p-6 rounded-lg shadow-2xl h-full max-h-[80vh] overflow-y-auto">
          <MessageListRabbitmq />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

