# _devPage_ Development Environment 

As part of Issue 6, a front-end container based on Node.js is provided, which is deployed in an independent Docker Container. 
The goal was to implement different development tools to enable a sufficient development process.

## Components and features
This development environment is based on _Node.js_ and uses _Express_ for html serving and routing. 
Deployment takes place i an independent _docker container_.
Additionally, two deployment modes are supported. 
In development mode multiple development tools are enabled. 
These tools mainly consists out of an automated _SCSS Watcher_, _nodemon_ as a Node.js watcher and _babel_ as a javascript compiler.
A _ESLint_ configuration file is also integrated, which should automatically be adopted by the IDE.
To enable hot reload a _docker volume binding_ is implemented.
When building for production all watcher tools are disabled. 
When starting _SCSS_ and _babel_ will generate a minified CSS and javascript file once. 

## Start developing
Deployment takes place inside a docker container. There are different _docker-compose_ files for the different deployment modes.

### Setup 
1. Install Docker and Docker-compose
* Docker & Docker Compose for [Windows](https://docs.docker.com/docker-for-windows/install/)
* Docker & Docker Compose for [macOS](https://docs.docker.com/docker-for-mac/install/)
* [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) & Docker [Compose](https://docs.docker.com/compose/install/#install-compose) for Ubuntu

2. Clone the repository

`git clone https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel`

3. Change to the _devPage_ folder

`cd frontend/devPage`

4. Install dependencies

`npm install`

### Starting the container

1. Switch to the `.docker` folder

```cd Frontend/devPage/.docker```

2. Choose deployment mode
**Building for _development_**

```docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d```

**Building for _production_**

```docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d```
