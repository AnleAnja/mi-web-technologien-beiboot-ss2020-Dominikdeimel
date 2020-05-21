# Installation guide 
## Setup 
### Installing Docker and Docker Compose
* Docker & Docker Compose for [Windows](https://docs.docker.com/docker-for-windows/install/)
* Docker & Docker Compose for [macOS](https://docs.docker.com/docker-for-mac/install/)
* [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) & Docker [Compose](https://docs.docker.com/compose/install/#install-compose) for Ubuntu
  
### Clone the Git Repository
`git clone https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel`

## Starting the system with Docker
To start the system use the following command:

### Windows
    cd .\.docker\
        
    docker-compose up -d 
   
### MacOS and Linux
    cd ./.docker
        
    docker-compose up -d 
    
 ### Frontend
   The Web-app is accessible via: http://localhost:8080
    
 ### Shutting down the system
  To shut down the system use the following command:
    
     docker-compose down

### Scaffolding

Example data to simulate 30 uploaded images.
The images are provided by [Unplash](https://unsplash.com/)

1. ```docker ps```

2. Copy the **Container Id** of the backend container

![](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel/blob/master/.github/images/docker_container.png)

3. ```docker cp ../example_content/userData <Container Id>:/app/``` 

Example images for manual upload can be found [here](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel/tree/master/example_content/example_images).

## Start the system without docker

### Frontend
  ```cd Frontend/imagetool```
 
  ```npm install```
 
  ```npm run serve```
  
  The Web-app is accessible via: http://localhost:8080
  
### Backend
 ```cd Backend```
 
 ```npm install```
  
  ```node app.js```
  
### Shutting down the system
  To shut down the system press **Ctrl + c**
