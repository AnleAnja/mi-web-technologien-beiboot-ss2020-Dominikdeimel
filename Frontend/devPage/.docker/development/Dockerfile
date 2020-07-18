FROM node:alpine

#Create app directory
WORKDIR /app

#Install nodemon for hot reloading
RUN npm install nodemon sass -g

#Install app dependencies
#A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

EXPOSE 8080
CMD [ "node", "entryPoint.js" ]