# Używamy oficjalnego obrazu node.js
FROM node:22.11.0

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy cały projekt do katalogu roboczego
COPY . .

# Ustawianie zmiennych środowiskowych dla Dockera
ENV PORT=3000
ENV MONGO_URL=mongodb://mongodb:27017/IBM  
ENV MQTT_URL=mqtt://mqtt:1883  
ENV RABBITMQ_URI=amqp://rabbitmq

# Exponujemy port aplikacji
EXPOSE 3000

# Uruchamiamy aplikację
CMD ["npm", "run", "dev"]
