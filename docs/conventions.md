# Conventions
## Code 

The project is following the [standard Javascript rules](https://standardjs.com/rules.html).
To allow for an easy contribution, the most important rules can be summarized as followed:

**Use 2 spaces for indentation**
```js
function helloWorld () {
  console.log('Hello world')
}
```

**Use single quotes for strings except to avoid escaping**
```js
console.log('Hello world')
```

**No unused variables**
```js
function myFunction () {
  var result = something()   
}
```

**Always use === instead of ==**
```js
if (name === 'John')
```

**Commas should have a space after them**
```js
var list = [1, 2, 3, 4]
```

**Keep else statements on the same line as their curly braces**
```js
if (condition) {
  // ...
} else {
  // ...
}
```

**For multi-line if statements, use curly braces**
```js
if (options.quiet !== true) {
  console.log('done')
}
```

**Multiple blank lines not allowed**
```js
var value = 'Hello world'
console.log(value)
```

**Commas must be placed at the end of the current line**
```js
var obj = {
    foo: 'foo',
    bar: 'bar'   
  }
```

**Dot should be on the same line as property**
```js
console
    .log('hello')
```

For further information, check the [standard Javascript Style Guide](https://standardjs.com/rules.html)

## Commit Messages
When committing, please follow the following guidelines:

* Commit should be in english
* Use past tense
* Use the body to explain _what_ and _why_ 
* Commit should be written in imperative
* Keep the summary as short as possible

## Issue template

For opening an issue, please follow the [issue template](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel/blob/master/docs/issue_template.md)

## Pull-Request Template

For opening a pull request, please follow the [pull-request template](https://github.com/mi-classroom/mi-web-technologien-beiboot-ss2020-Dominikdeimel/blob/master/docs/pull_request_template.md)
