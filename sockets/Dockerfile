FROM node:10.13.0-alpine

COPY package.json /app/package.json

RUN cd /app && npm install

COPY . /app/

EXPOSE 3000

WORKDIR /app

CMD ["npm", "start"]
