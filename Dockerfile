FROM --platform=linux/amd64 node:20-slim

RUN apt-get update && apt-get install -y openssl libssl-dev vim

WORKDIR /gateway

COPY ./*.json .

RUN npm install

RUN npm install @vonage/auth

COPY ./src ./src

COPY ./prisma ./prisma

COPY ./.env .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["npm" , "run" , "start"]