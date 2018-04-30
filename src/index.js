'use strict';

// NodeJS library
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var SVGO = require('svgo');
var Stream = require('stream').Stream;

// NPM library
var File = require('vinyl');
var PluginError = require('plugin-error');
var log = require('fancy-log');
var through = require('through2');
var request = require('request');
var buffers = require('buffers');
var async = require('async');
var chalk = require('chalk');

var rImages = /url((?:\(['|"]?)(.*?.svg(?:[#?][^"|']*)?)(?:['|"]?\)))(?!.*\/\*svg:skip\*\/)/ig;

function gulpCssSvg(opts) {
  opts = JSON.parse(JSON.stringify(opts || {}));
  opts.maxWeightResource = opts.maxWeightResource || 32768;
  opts.baseDir = opts.baseDir || '';
  opts.verbose = process.argv.indexOf('--verbose') !== -1;

  // Creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, callbackStream) {
    var currentStream = this;
    var cache = [];

    if (file.isNull()) {
      // Do nothing if no contents
      currentStream.push(file);

      return callbackStream();
    }

    if (file.isBuffer()) {
      var src = file.contents.toString();
      var result = [];

      async.whilst(
        function () {
          result = rImages.exec(src);

          return result !== null;
        },
        function (callback) {
          if (cache[result[2]]) {
            src = src.replace(result[1], cache[result[2]]);
            callback();
            return;
          }

          var strRes = '';
          encodeResource(result[2], file, opts, function (fileRes) {
            if (undefined !== fileRes) {
              if (fileRes.contents.length > opts.maxWeightResource) {
                if (opts.verbose) {
                  log('Ignores ' + chalk.yellow(result[1]) + ', file is too big ' + chalk.yellow(fileRes.contents.length + ' bytes'));
                }
                callback();
                return;
              }

              strRes = 'data:' + mime.getType(fileRes.path) + ';charset=utf8,';
              new SVGO().optimize(fileRes.contents.toString('utf8'), {path: fileRes.path}).then(function (optomized) {
                strRes += optomized.data.replace(/"/g, '\'')
                  .replace(/</g, '%3C')
                  .replace(/>/g, '%3E')
                  .replace(/{/g, '%7B')
                  .replace(/}/g, '%7D')
                  .replace(/#/g, '%23');
                strRes = '("' + strRes + '")';
                src = src.replace(result[1], strRes);

                // Store in cache
                cache[result[2]] = strRes;
                callback();
              }).catch(function (error) {
                log('Failed to process ' + chalk.yellow(fileRes.path) + ' - ' + chalk.yellow(error));
                callback();
              });
            }
          });
        },
        function () {
          file.contents = Buffer.from(src);
          currentStream.push(file);

          return callbackStream();
        }
      );
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-css-svg', 'Stream not supported!'));
    }
  });

  // Returning the file stream
  return stream;
}

function encodeResource(img, file, opts, doneCallback) {
  var fileRes = new File();

  if (/^data:/.test(img)) {
    log('Ignores ' + chalk.yellow(img.substring(0, 30) + '...') + ', already encoded');
    doneCallback();
    return;
  }

  if (img[0] === '#') {
    log('Ignores ' + chalk.yellow(img.substring(0, 30) + '...') + ', SVG mask');
    doneCallback();
    return;
  }

  if (/^(http|https|\/\/)/.test(img)) {
    if (opts.verbose) {
      log('Fetch ' + chalk.yellow(img));
    }
    // Different case for uri start '//'
    if (img[0] + img[1] === '//') {
      img = 'http:' + img;
    }

    fetchRemoteRessource(img, function (resultBuffer) {
      if (resultBuffer === null) {
        log('Error: ' + chalk.red(img) + ', unable to fetch');
        doneCallback();
        return;
      }
      fileRes.path = img;
      fileRes.contents = resultBuffer;
      doneCallback(fileRes);
    });
  } else {
    var location = '';
    var binRes = '';

    location = img.charAt(0) === '/' ? (opts.baseDir || '') + img : path.join(path.dirname(file.path || ''), (opts.baseDir || '') + '/' + img);
    location = location.replace(/([?#].*)$/, '');

    if (!fs.existsSync(location)) {
      log('Error: ' + chalk.red(location) + ', file not found');
      doneCallback();
      return;
    }

    binRes = fs.readFileSync(location);

    fileRes.path = location;
    fileRes.contents = binRes;

    doneCallback(fileRes);
  }
}

function fetchRemoteRessource(url, callback) {
  var resultBuffer;
  var buffList = buffers();
  var imageStream = new Stream();

  imageStream.writable = true;
  imageStream.write = function (data) {
    buffList.push(Buffer.from(data));
  };
  imageStream.end = function () {
    resultBuffer = buffList.toBuffer();
  };

  request(url, function (error, response) {
    if (error) {
      callback(null);
      return;
    }

    // Bail if we get anything other than 200
    if (response.statusCode !== 200) {
      callback(null);
      return;
    }

    callback(resultBuffer);
  }).pipe(imageStream);
}

// Exporting the plugin main function
module.exports = gulpCssSvg;
