# Using the official Node.js image
FROM node:22.11.0

# Setting the working directory
WORKDIR /app

# Copying package.json and package-lock.json files
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying the rest of the files
COPY . .

# Exposing the application port
EXPOSE 5173

# Running the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]

