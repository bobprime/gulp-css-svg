'use strict';

// NodeJS library
var assert = require('assert');

// NPM library
var gutil = require('gulp-util');
var es = require('event-stream');

// Local library
var svg = require('../src/index');

describe('gulp-css-svg', function () {
  // define here beforeEach(), afterEach()

  it('should not modify original options object', function () {
    var opts = {
      foo: 'bar'
    };

    svg(opts);
    assert.equal(opts.maxWeightResource, undefined);
  });

  describe('in buffer mode', function () {
    it('should convert url() content', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
      });
      done();
    });

    it('should convert url(\'\') content with quotes', function (done) {
      // create the fake file
      var urlString = 'url(\'test/fixtures/image/very-very-small.svg\')';
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:' + urlString + ' no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url(\"\") content with double quotes', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\"test/fixtures/image/very-very-small.svg\") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url() content with questionmark at end', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.svg?awesomeQuestionmark\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url() content with hashtag at end', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'test/fixtures/image/very-very-small.svg#awesomeHashtag\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if image weight is greater than maxWeightResource default value', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg({
        maxWeightResource: 10
      });

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if url() is already data url', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(\'data:image/svg+xml;charset=utf8,%3Csvg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class="st0" d="M63 45v18H9V45H0v27h72V45z"/%3E%3Cpath class="st0" d="M54 27h-9V0H27v27h-9l18 27z"/%3E%3C/svg%3E\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(\'data:image/svg+xml;charset=utf8,%3Csvg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class="st0" d="M63 45v18H9V45H0v27h72V45z"/%3E%3Cpath class="st0" d="M54 27h-9V0H27v27h-9l18 27z"/%3E%3C/svg%3E\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if url() begin with #', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{mask-image: url("#stark-svg-mask");}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{mask-image: url("#stark-svg-mask");}');
        done();
      });
    });

    it('should ignore if resource is not found', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found with error', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should use option base directory to fetch local resource with relative path', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg({
        baseDir: 'test/fixtures/image'
      });

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should use option base directory to fetch local resource with absolute path', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg({
        baseDir: 'test/fixtures/image'
      });

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if directive comment exist at end of line', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}');
        done();
      });
    });

    it('should use cache when css contain duplicate uri resource', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');

        done();
      });
    });

    it('should convert if remote resource (http://)', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(http://raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (https://)', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(https://raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (//)', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: new Buffer('.button_alert{background:url(//raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });
  });

  describe('in stream mode', function () {
    it('should throw a PluginError', function (done) {
      // create the fake file
      var fakeFile = new gutil.File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // Create a prefixer plugin stream
      var stream = svg();

      assert.throws(
        function () {
          stream.write(fakeFile);
        },
        function (err) {
          if (err instanceof Error && err.message === 'Stream not supported!') {
            return true;
          }
        }
      );
      done();
    });
  });

  describe('with null contents', function () {
    it('do nothing if file is null', function (done) {
      // create the fake file
      var fakeFile = new gutil.File(null);

      // Create a css-svg plugin stream
      var stream = svg();

      // write the fake file to it
      stream.write(fakeFile);

      // wait for the file to come back out
      stream.once('data', function (file) {
        // make sure it came out the same way it went in
        assert(file.isNull());

        // check the contents
        assert.equal(file.contents, null);
        done();
      });
    });
  });
})
;
