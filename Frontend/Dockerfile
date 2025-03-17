# Używamy oficjalnego obrazu Node.js
FROM node:22.11.0

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty plików
COPY . .

# Exponowanie portu aplikacji
EXPOSE 5173

# Uruchamianie aplikacji w trybie deweloperskim
CMD ["npm", "run", "dev", "--", "--host"]

