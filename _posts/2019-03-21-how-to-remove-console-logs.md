---
layout: single
header:
  teaser: /assets/images/javascript-2019-03-21.png
title: "How to remove console log from your JavaScript files?"
date: 2019-03-21 12:00:00 -0800
categories: Web
tags:
  - JavaScript
  - Regex
---
## Overview:
Learn how to remove [JavaScript console methods](https://developer.mozilla.org/en-US/docs/Web/API/Console){:target="_blank"} such as console log programmatically from your JavaScript files.

## Solutions:
### 1. sed 
sed is defined as following on [GNU](https://www.gnu.org/software/sed/manual/sed.html){:target="_blank"} site.
> sed is a stream editor. A stream editor is used to perform basic text transformations on an input stream (a file or input from a pipeline).

#### sed command
You can run the following command to remove console methods from your input JavaScript file: `in.js` and the output JavaScript file would be `out.js`.

```
sed -E 's/console.(log|debug)\((.*)\);?//g' <in.js >out.js
```

Description of -E flag from `man sed` 
>  Interpret regular expressions as extended (modern) regular expressions rather than basic regular expressions (BRE's). The re_format(7) manual page fully describes both formats.

You can edit this list: `log|debug` to remove the console method you want to remove. For example,if you want to remove console log, debug, info and count, change that list to `log|debug|info|count`.

You can use this [regex test website](https://regex101.com/r/kC7rXR/3){:target="_blank"} to check if it works.

### 2. gulp-strip-debug package
If your have a lot of files to clean up. You should use gulp and gulp-strip-debug package to efficiently remove console methods.

#### i. Install gulp if you haven't. 
```terminal
npm install --save-dev gulp
```
Gulp is a build system that automates development tasks. Read more about [Gulp on Google developers document](https://developers.google.com/web/ilt/pwa/introduction-to-gulp){:target="_blank"}.

#### ii. Install gulp-strip-debug package
```terminal
npm install --save-dev gulp-strip-debug
```

#### iii. Create a gulpfile
Configure gulp using a file called `gulpfile.js` to set the input and output file path using JavaScript below.

```javascript
const gulp = require('gulp');
const stripDebug = require('gulp-strip-debug');

gulp.task('strip-debug', () =>
  gulp.src('./**.js') // input file path
    .pipe(stripDebug()) // execute gulp-strip-debug
    .pipe(gulp.dest('./')) // output file path 
);
```

#### iv. Add Command to your package.json
In your scripts object inside your package.json, you can add a new command, let's say, command alias is cleanup which will execute `gulp strip-debug`.

```javascript
"scripts": {
  ...
  "cleanup": "gulp strip-debug"
}
```

#### v. Execute npm run cleanup
Now, run `npm run cleanup` command. and it will remove console, alert and debugger from your JavaScript files. 

![gulp-strip-debug execution](/assets/images/gulp-strip-debug-execution-2019-03-21.png)

With this, you can remove console methods from your JavaScript files programmatically. 

{% include eof.md %}