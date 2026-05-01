# Use the official Node.js lightweight image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the TypeScript code into JavaScript
RUN npm run build

ENV TASK_SERVICE_URL=http://task-service:3000

EXPOSE 3001

# Start the application using your optimized start script
CMD ["npm", "start"]
