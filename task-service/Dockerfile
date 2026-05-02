FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

RUN cp -r /app/src/generated /app/dist/generated

CMD ["sh", "-c", "npx prisma db push && npm start"]