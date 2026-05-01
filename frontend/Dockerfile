FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Expose the Vite default port
EXPOSE 5173

# Start the Vite server and expose it to the network
CMD ["npm", "run", "dev", "--", "--host"]