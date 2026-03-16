FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY api/package*.json ./
RUN npm install

COPY api/prisma ./prisma
RUN npx prisma generate

COPY api/ .
RUN npm run build

RUN chmod +x start.sh

EXPOSE 8080

CMD ["sh", "start.sh"]
