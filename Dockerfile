FROM --platform=linux/amd64 node:20-slim

# Combine apt-get update and install with cleanup to reduce image size
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libssl-dev vim && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /gateway

COPY ./*.json ./

RUN npm install

RUN npm install @vonage/auth

COPY ./src ./src

COPY ./prisma ./prisma

COPY ./.env .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
