'use strict';
const FileManager = require('../lib/fileManager');
const path = require('path');
const should = require('should');
const deride = require('deride');

describe('File Manager', () => {
  let fm, nullLogger;
  beforeEach(() => {
    nullLogger = deride.stub(['log', 'debug', 'error']);
    fm = new FileManager({
      target: path.join(__dirname, 'samples/filemanager'),
      logger: nullLogger
    });
  });

  it('should allow me to add additional exclude', () => {
    fm = new FileManager({
      target: path.join(__dirname, 'samples/filemanager'),
      logger: nullLogger,
      exclude: ['^test/']
    });
    const result = fm.all();
    const expected = [
      'file1.md',
      'file2'
    ];
    should(result).eql(expected);
  });

  it('should load all files in the target directory', () => {
    const result = fm.all();
    const expected = [
      'file1.md',
      'file2',
      'test/another-test/file4.txt',
      'test/excluded/excluded-file.js',
      'test/file3'
    ];
    should(result).eql(expected);
  });

  it('should const me exclude extensions', () => {
    const result = fm.excludeExtensions(['txt', 'md']);
     const expected = [
      'file2',
      'test/excluded/excluded-file.js',
      'test/file3'
    ];
    should(result).eql(expected);
  });

  it('should const me select by extension', () => {
    const result = fm.byExtensions(['txt', 'md']);
     const expected = [
      'file1.md',
      'test/another-test/file4.txt'
    ];
    should(result).eql(expected);
  });

  it('should const me select by path', () => {
    const result = fm.byPaths(['test/another-test']);
     const expected = [
      'test/another-test/file4.txt'
    ];
    should(result).eql(expected);
  });

  it('should const me get a files contents', done => {
    fm.readFile('test/file3', (err, contents) => {
      should.ifError(err);
      should(contents).eql('this is file 3');
      done();
    });
  });
});
