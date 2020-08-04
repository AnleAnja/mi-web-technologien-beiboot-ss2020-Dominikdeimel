# Multiple docker compose files to realise a production and development build

* Status: Accepted

## Context and Problem Statement
As part of the 6th issue, a front-end development environment on a node basis is to be provided. 
This environment should be placed inside a docker container and must support a development and  production mode.

## Considered Options

* Multiple docker compose files
* Environment variables

## Decision Outcome
Chosen Option: **Multiple docker files**

* Cleaner implementation
* Simple start of dev services in development mode

### Positive Consequences
* No extra NPM scripts needed

### Negative Consequences
* Three docker compose files are needed
 


