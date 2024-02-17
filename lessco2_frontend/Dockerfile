FROM node:18-alpine

WORKDIR /usr/app

RUN npm install --global pm2

COPY ./package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

USER node

EXPOSE 3000

CMD [ "pm2-runtime", "npm", "--", "preview" ]