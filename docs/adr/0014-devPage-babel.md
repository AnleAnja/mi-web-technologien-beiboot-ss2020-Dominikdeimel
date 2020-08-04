# Babel as a javascript transpiler 

* Status: Accepted

## Context and Problem Statement
For production mode all written Javascript code needs to be transpiled to not only work with modern, but also with older web browsers.
Optionally, when building for production, the written javascript code should also be minified.

## Considered Options

* [Babel](https://babeljs.io/) 
* [Minify-all](https://www.npmjs.com/package/minify-all) 
* [Minify-dir](https://www.npmjs.com/package/minify-dir) 

## Decision Outcome
Chosen Option: **Babel**

* Can transpile and minify javascript code
* Good customization options

### Positive Consequences
* Only one framework is needed for transpiling and minification
* Sufficient configuration with a babel config file

### Negative Consequences
* Babel generates a descent overhead
 


