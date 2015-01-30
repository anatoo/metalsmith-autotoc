var assert = require('assert');
var equal = require('assert-dir-equal');
var metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var autotoc = require('..');

describe('metalsmith-autotoc', function() {
  it('should generate table of contents', function(done) {
    metalsmith(__dirname + '/fixtures/basic')
      .use(autotoc({
        selector: 'h2, h3, h4, h5',
        headerIdPrefix: 'foo-'
        
      }))
      .use(templates({
        engine: 'eco',
        directory: './templates'
      }))
      .build(function(error) {
        if (error) {
          throw error;
        }
        equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
        done();
      });
  });
});
