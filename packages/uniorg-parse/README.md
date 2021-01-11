# `uniorg-parse`

[Org-mode](https://orgmode.org/) parser compatible with [unified](https://github.com/unifiedjs/unified) ecosystem.

## Install

```sh
npm install uniorg-parse
```


## Use

```js
var unified = require('unified')
var createStream = require('unified-stream')
var uniorgPars = require('uniorg-parse')
var uniorg2rehype = require('uniorg-rehype')
var html = require('rehype-stringify')

var processor = unified().use(uniorgParse).use(uniorg2rehype).use(html)

process.stdin.pipe(createStream(processor)).pipe(process.stdout)
```


## API


### `processor().use(uniorgParse)`

Configure the `processor` to read Markdown as input and process **[uniorg](https://github.com/rasendubi/uniorg)** syntax trees.


### `parse(string)`

Parse string.

```js
import { parse } from 'uniorg-parse';

console.log(parse('* example document'))
```


## License

GPLv3 or later