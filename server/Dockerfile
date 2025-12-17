FROM node:20-alpine

FROM node:20-alpine

COPY package*.json ./

RUN npm ci --only=production

COPY . .

USER node

EXPOSE 4000

CMD ["npm", "start"]