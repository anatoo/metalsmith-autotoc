
var async = require('async');
var cheerio = require('cheerio');
var entities = require('entities');
var slug = require('slug');

var TocItem = function() {
  TocItem.prototype.init.apply(this, arguments);
};

TocItem.prototype = {
  /**
   * @param {Object} [params]
   * @param {String} [params.id]
   * @param {String} [params.text]
   */
  init: function(params) {
    params = params || {};
    this.id = params.id || '';
    this.text = params.text || '';
    this.children = [];
    this.parent = null;
  },
  /**
   * @param {TocItem} tocItem
   */
  add: function(tocItem) {
    if (tocItem.parent) {
      throw 'tocItem.parent exists';
    }
    tocItem.parent = this;
    this.children.push(tocItem);
  },

  toJSON: function() {
    return {
      id: this.id,
      text: this.text,
      children: this.children
    };
  }
};

/**
 * @param {Function} [options.slug]
 * @param {String} [options.selector]
 * @param {String} [options.headerIdPrefix]
 */
module.exports = function(options) {
  options = options || {};
  options.selector = options.selector || 'h2, h3, h4, h5, h6';
  options.headerIdPrefix = options.headerIdPrefix || '';
  options.slug = options.slug || function(innerHTML, originalId) {
    if (originalId) {
      return originalId;
    }
    return options.headerIdPrefix + slug(innerHTML);
  };

  function getRootLevel(headers) {
    return headers.map(function(header) {
      return header.level;
    }).sort()[0] - 1;
  }

  function buildTocItems(headers) {
    if (headers.length === 0) {
      return [];
    }

    var root = new TocItem();
    var toc = root;

    var lastLevel = getRootLevel(headers);

    headers.forEach(function(header) {
      var id = header.id;
      var text = header.text;
      var level = header.level;

      while (level != 1 + lastLevel) {
        if (level < 1 + lastLevel) {
          toc = toc.parent;
          lastLevel--;
        } else if (level > 1 + lastLevel) {
          var emptyToc = new TocItem();
          toc.add(emptyToc);
          toc = emptyToc;
          lastLevel++;
        }
      }

      var newToc = new TocItem({
        text: text,
        id: id
      });

      toc.add(newToc);
      toc = newToc;
      lastLevel = level;
    });

    return root.children;
  }

  return function(files, metalsmith, done) {
    var fileList = Object.keys(files).map(function(path) {
      return files[path];
    });

    async.each(fileList, function(file, done) {
      if (!file.autotoc) {
        done();
      } else {
        var $ = cheerio.load(file.contents, { decodeEntities: false });
        var headers = [];
        $([file.autotocSelector, options.selector, 'h3, h4'].filter(function(n){ return n !== undefined; }).join(', ')).each(function(){
            var $this = $(this);
            $this.attr('id', options.slug(entities.decode($this.text()), $this.attr('id')));
            headers.push(
                { id: $this.attr('id'),
                  text: entities.decode($this.text()),
                  level: parseInt($this.prop("tagName").match(/^h([123456])$/i)[1], 10)});
        });
        file.toc = buildTocItems(headers);
        file.contents = new Buffer($.html());
        done();
      }
    }, function() {
      done();
    });
  };
};
