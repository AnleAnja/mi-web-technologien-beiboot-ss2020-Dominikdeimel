# Sharp als Bibliothek zum Anpassen von Bilddateien

* Status: Angenommen

## Context and Problem Statement
Im Rahmen des Beiboot Projekts sollen vom Nutzer hochgeladene Bilder skaliert und zugeschnitten werden.
Hierfür soll eine geeignete Bibliothek implementiert werden.

## Considered Options

* [Sharp](https://github.com/lovell/sharp) 
* [Jimp](https://www.npmjs.com/package/jimp) 
* [Caman.js](http://camanjs.com/) 

## Decision Outcome

Es wurde sich für Sharp entschieden weil:
* sehr leichte Syntax
* schnelle Implementiertung der benötigten Funktionen
* zusätzliche Funtkionen für den weiteren Verlauf des Projekts (z.B. Scharfzeichnen)

### Positive Consequences
* Schnelle Implementierung in das Projekt
* Großer Funktionsumfang 

### Negative Consequences

