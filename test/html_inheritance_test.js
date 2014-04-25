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

var getFiles = function(fileName){
  return {
    actualMain: grunt.file.read('tmp/main/test/fixtures/'+fileName+'.html'),
    actualVer: grunt.file.read('tmp/ver1/test/fixtures/'+fileName+'.html'),

    expectedMain: grunt.file.read('test/expected/main/'+fileName+'.html'),
    expectedVer: grunt.file.read('test/expected/ver1/'+fileName+'.html'),
  }
}

var testEqual = function(test, fileName){
    var files = getFiles(fileName)

    test.equal(files.actualMain, files.expectedMain, 'main version should equal.');
    test.equal(files.actualVer, files.expectedVer, 'inherited version should equal.');

    test.done();
}

exports.html_inheritance = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  replace: function(test) {
    testEqual(test, "replace");
  },
  remove: function(test) {
    testEqual(test, "remove");
  },

  insert: function(test) {
    testEqual(test, "insert");
  },
  attributes: function(test) {
    testEqual(test, "attributes");
  },
};
