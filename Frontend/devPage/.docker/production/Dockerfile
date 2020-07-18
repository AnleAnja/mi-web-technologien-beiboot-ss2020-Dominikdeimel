FROM node:alpine

#Create app directory
WORKDIR /app

RUN npm install sass -g

#Install app dependencies
#A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .
RUN sass --quiet --style=compressed assets/scss:public/css

EXPOSE 8080
CMD [ "node", "src/app.js" ]