'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.html_inheritance = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  replace: function(test) {

    var actualMain = grunt.file.read('tmp/main/replace.html');
    var actualVer = grunt.file.read('tmp/ver1/replace.html');

    var expectedMain = grunt.file.read('test/expected/main/replace.html');
    var expectedVer = grunt.file.read('test/expected/ver1/replace.html');

    test.equal(actualMain, expectedMain, 'main version should equal.');
    test.equal(actualVer, expectedVer, 'inherited version should equal.');

    test.done();
  },
  remove: function(test) {

    var actualMain = grunt.file.read('tmp/main/remove.html');
    var actualVer = grunt.file.read('tmp/ver1/remove.html');

    var expectedMain = grunt.file.read('test/expected/main/remove.html');
    var expectedVer = grunt.file.read('test/expected/ver1/remove.html');

    test.equal(actualMain, expectedMain, 'main version should equal.');
    test.equal(actualVer, expectedVer, 'inherited version should equal.');

    test.done();
  },

  insert: function(test) {

    var actualMain = grunt.file.read('tmp/main/insert.html');
    var actualVer = grunt.file.read('tmp/ver1/insert.html');

    var expectedMain = grunt.file.read('test/expected/main/insert.html');
    var expectedVer = grunt.file.read('test/expected/ver1/insert.html');

    test.equal(actualMain, expectedMain, 'main version should equal.');
    test.equal(actualVer, expectedVer, 'inherited version should equal.');

    test.done();
  },
};
