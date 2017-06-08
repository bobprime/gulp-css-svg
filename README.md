# gulp-css-svg

[![Build Status](http://img.shields.io/travis/shysteph/gulp-css-svg.svg?style=flat)](https://travis-ci.org/shysteph/gulp-css-svg)
[![Coverage Status](http://img.shields.io/coveralls/shysteph/gulp-css-svg.svg?style=flat)](https://coveralls.io/r/shysteph/gulp-css-svg?branch=master)
[![Dependencies](http://img.shields.io/david/shysteph/gulp-css-svg.svg?style=flat)](https://david-dm.org/shysteph/gulp-css-svg) [![NPM Version](http://img.shields.io/npm/v/gulp-css-svg.svg?style=flat)](https://www.npmjs.org/package/gulp-css-svg) [![Download Month](http://img.shields.io/npm/dm/gulp-css-svg.svg?style=flat)](https://www.npmjs.org/package/gulp-css-svg)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/shysteph/gulp-css-svg?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This gulp task converts all svg urls found within a stylesheet (those within a url( ... ) declaration) into uri-encoded data URI strings WITHOUT doing a base64 encode.  This helps see what is going on and saves space.

Inspired by [grunt-image-embed](https://github.com/ehynds/grunt-image-embed) and written following [gulp's guidelines](https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin).

## Features

* Supports local and remote resources.
* Supports buffer (and stream **WIP**).
* [[>]](#optionsbasedir) Ability to define a relative base directory to gulpfile.js. Default is the current directory.
* [[>]](#optionsmaxweightresource) Ability to specify a weight limit. Default is 32kB which is IE8's limit.
* [[>]](#optionsextensionsallowed) Ability to filter on file extensions. Default there is no filter.
* [[>]](#ignore-a-specific-resource) Ignore a resource by specifying a directive comment in CSS.
* Existing data URIs will be ignored.
* Existing SVG masks will be ignored.

## Install

Install this plugin with the command:

```js
npm install --save-dev gulp-css-svg
```

## Usage

```js
var cssSvg = require('gulp-css-svg');

//Without options
gulp.task('default', function () {
    return gulp.src('src/css/input.css')
        .pipe(cssSvg())
        .pipe(gulp.dest('dist'));
});

//With options
gulp.task('default', function () {
    return gulp.src('src/css/input.css')
        .pipe(cssSvg({
            baseDir: "../../images",
            maxWeightResource: 100,
            extensionsAllowed: ['.gif', '.jpg']
        }))
        .pipe(gulp.dest('dist'));
});
```

## Options

#### options.baseDir
Type: `String`

Default value: ``

Note: If you have absolute image paths in your stylesheet, the path specified in this option will be used as the base directory. By default plugin used the current directory of gulpfile.js to find local resources.

#### options.maxWeightResource
Type: `Number`

Default value: `32768`

#### options.extensionsAllowed
Type: `Array`

Default value: `[]`

## Ignore a specific resource

You can ignore a resource with a comment `/*svg:skip*/` in CSS file after url definition.
```css
.ignored{
  background: url(image.png); /*svg:skip*/
}
.encoded{
  background: url(image.jpg);
}
```

## License
Copyright (c) 2014 [Stephanie Miller](https://github.com/shysteph) under the MIT License.
