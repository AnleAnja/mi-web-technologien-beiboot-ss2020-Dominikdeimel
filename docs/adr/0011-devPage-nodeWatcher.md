# Nodemon as an Node.js Watcher for hot reloading

* Status: Accepted

## Context and Problem Statement
As part of the 6th issue, a front-end development environment on a node basis is to be provided. 
In order to provide an additional hot reload function, an appropriate node watcher must be implemented.

## Considered Options

* [Nodemon](https://nodemon.io/) 
* [Chokidar](https://github.com/paulmillr/chokidar) 
* [Supervisor](https://github.com/petruisfan/node-supervisor) 

## Decision Outcome
Chosen Option: **Nodemon**

* Automatic file extension detection
* Can be used as CLI

### Positive Consequences
* Can be directly implemented in a Dockerfile
* No further JS Code needed 
 


