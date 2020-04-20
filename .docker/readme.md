# Installationsanleitung
## Vorbereitungen
### Installiern von Docker und Docker Compose
* Docker & Docker Compose für [Windows][https://docs.docker.com/docker-for-windows/install/]
* Docker & Docker Compose für [macOS][https://docs.docker.com/docker-for-mac/install/]
* [Docker][https://docs.docker.com/install/linux/docker-ce/ubuntu/] & Docker [Compose][https://docs.docker.com/compose/install/#install-compose] für Ubuntu
  
### Git Repository klonen
`git clone https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel`

## Starten des Systems
Zum Starten des Systems, führen sie bitte die nachfolgenden Befehle aus:

### Windows
    cd .\.docker\
        
    docker-compose up -d 
   
### MacOS und Linux
    cd ./.docker
        
    docker-compose up -d 
    
 ### Frontend
   Das Frontend können Sie nun unter folgender URL aufgerufen werden: http://localhost:8080
    
   ## Beenden des Systems
   Zum Beenden der Anwendung, führen Sie bitte folgenden Befehl aus:
    
        docker-compose down
    
