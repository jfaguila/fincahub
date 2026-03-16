FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY api/ .

RUN npm install

RUN npx prisma generate

RUN npm run build

RUN chmod +x start.sh

EXPOSE 3001

CMD ["sh", "start.sh"]
