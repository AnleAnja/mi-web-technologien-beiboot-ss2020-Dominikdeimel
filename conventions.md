#Conventions
## Code 

The project is following the [standard](https://standardjs.com/rules.html) Javascript rules.
To allow for an easy contribution, the most important rules can be summarized as followed:

**Use 2 spaces for indentation**
```
function helloWorld () {
  console.log('Hello world')
}
```

**Use single quotes for strings except to avoid escaping**
```
console.log('Hello world')
```

**No unused variables**
```
function myFunction () {
  var result = something()   
}
```

**Always use === instead of ==**
```
if (name === 'John')
```

**Commas should have a space after them**
```
var list = [1, 2, 3, 4]
```

**Keep else statements on the same line as their curly braces**
```
if (condition) {
  // ...
} else {
  // ...
}
```

**For multi-line if statements, use curly braces**
```
if (options.quiet !== true) {
  console.log('done')
}
```

**Multiple blank lines not allowed**
```
var value = 'Hello world'
console.log(value)
```

**Commas must be placed at the end of the current line**
```
var obj = {
    foo: 'foo',
    bar: 'bar'   
  }
```

**Dot should be on the same line as property**
```
console
    .log('hello')
```

For further information, check the [standard Javascript Style Guide](https://standardjs.com/rules.html)