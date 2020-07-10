FROM node:alpine

#Create app directory
WORKDIR /app

#Install nodemon for hot reloading
RUN npm install nodemon -g

#Install app dependencies
#A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .

EXPOSE 8080
CMD [ "nodemon", "-L", "app.js" ]