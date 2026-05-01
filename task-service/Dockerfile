# Use the official Node.js lightweight image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

# ← Add this line: copy generated prisma client into dist
RUN cp -r /app/src/generated /app/dist/generated

CMD ["npm", "start"]