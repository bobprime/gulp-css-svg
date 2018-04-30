'use strict';

// NodeJS library
const assert = require('assert');

// NPM library
const File = require('vinyl');
const es = require('event-stream');
const {Readable} = require('stream');

// Local library
const svg = require('../src/index');

describe('gulp-css-svg', function () {
  // Define here beforeEach(), afterEach()

  it('should not modify original options object', function () {
    const opts = {
      foo: 'bar'
    };

    svg(opts);
    assert.equal(opts.maxWeightResource, undefined);
  });

  describe('in buffer mode', function () {
    it('should convert url() content', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg({verbose: true});

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
      });
      done();
    });

    it('should convert url(\'\') content with quotes', function (done) {
      // Create the fake file
      const urlString = 'url(\'test/fixtures/image/very-very-small.svg\')';
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:' + urlString + ' no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url("") content with double quotes', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url("test/fixtures/image/very-very-small.svg") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url() content with questionmark at end', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(\'test/fixtures/image/very-very-small.svg?awesomeQuestionmark\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert url() content with hashtag at end', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(\'test/fixtures/image/very-very-small.svg#awesomeHashtag\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if image weight is greater than maxWeightResource default value', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg({
        maxWeightResource: 10
      });

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if url() is already data url', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(\'data:image/svg+xml;charset=utf8,%3Csvg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class="st0" d="M63 45v18H9V45H0v27h72V45z"/%3E%3Cpath class="st0" d="M54 27h-9V0H27v27h-9l18 27z"/%3E%3C/svg%3E\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(\'data:image/svg+xml;charset=utf8,%3Csvg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class="st0" d="M63 45v18H9V45H0v27h72V45z"/%3E%3Cpath class="st0" d="M54 27h-9V0H27v27h-9l18 27z"/%3E%3C/svg%3E\') no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if url() begin with #', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{mask-image: url("#stark-svg-mask");}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{mask-image: url("#stark-svg-mask");}');
        done();
      });
    });

    it('should ignore if resource is not found', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(wrong/path/image.png) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http://www.google.com/favicon1356.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if remote resource is not found with error', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(http:////www.google.com/favicon.ico) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should use option base directory to fetch local resource with relative path', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg({
        baseDir: 'test/fixtures/image'
      });

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should use option base directory to fetch local resource with absolute path', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg({
        baseDir: 'test/fixtures/image'
      });

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should ignore if directive comment exist at end of line', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url(test/fixtures/image/very-very-small.png)/*base64:skip*/}');
        done();
      });
    });

    it('should use cache when css contain duplicate uri resource', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url(test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');

        done();
      });
    });

    it('should convert if remote resource (http://)', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(http://raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (https://)', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(https://raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });

    it('should convert if remote resource (//)', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: Buffer.from('.button_alert{background:url(//raw.githubusercontent.com/shysteph/gulp-css-svg/master/test/fixtures/image/very-very-small.svg) no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}')
      });

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isBuffer());

        // Check the contents
        assert.equal(file.contents.toString('utf8'), '.button_alert{background:url("data:image/svg+xml;charset=utf8,%3Csvg id=\'Layer_1\' xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 72 72\'%3E%3Cstyle%3E.st0%7Bfill:%23333%7D%3C/style%3E%3Cpath class=\'st0\' d=\'M63 45v18H9V45H0v27h72V45z\'/%3E%3Cpath class=\'st0\' d=\'M54 27h-9V0H27v27h-9l18 27z\'/%3E%3C/svg%3E") no-repeat 4px 5px;padding-left:12px;font-size:12px;color:#888;text-decoration:underline}');
        done();
      });
    });
  });

  describe('in stream mode', function () {
    it('should throw a PluginError', function (done) {
      // Create the fake file
      const fakeFile = new File({
        contents: new Readable({objectMode: true}).wrap(es.readArray(['stream', 'with', 'those', 'contents']))
      });

      // Create a prefixer plugin stream
      const stream = svg();

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
      // Create the fake file
      const fakeFile = new File(null);

      // Create a css-svg plugin stream
      const stream = svg();

      // Write the fake file to it
      stream.write(fakeFile);

      // Wait for the file to come back out
      stream.once('data', function (file) {
        // Make sure it came out the same way it went in
        assert(file.isNull());

        // Check the contents
        assert.equal(file.contents, null);
        done();
      });
    });
  });
});

