# Using the official Node.js image
FROM node:22.11.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Setting environment variables for Docker
ENV PORT=3000
ENV MONGO_URL=mongodb://mongodb:27017/IBM  
ENV MQTT_URL=mqtt://mqtt:1883  
ENV RABBITMQ_URI=amqp://rabbitmq

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
