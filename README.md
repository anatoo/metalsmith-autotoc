# metalsmith-autotoc

> A metalsmith plugin to generate table of contents of a document.

This plugin generate table of contents object to document's metadata.

## Installation

```bash
$ npm install metalsmith-autotoc
```

## Example

Source file `src/index.html`:

```html
---
autotoc: true
template: 'layout.eco'
---
<h2>aaa</h2>

<p>paragraph</p>

<h2>bbb</h2>

<p>paragraph</p>

<h2>ccc</h2>

<p>paragraph</p>
```

Template file `templates/layout.eco`:

```eco
<ul>
<% for tocItem in @toc: %>
  <li><a href="#<%= tocItem.id %>"><%= tocItem.text %></a></li>
<% end %>
</ul>

<%- @contents %>
```

Build file `build.js`:

```javascript
var metalsmith = require('metalsmith');
var autotoc = require('metalsmith-autotoc');
var templates = require('metalsmith-templates');

metalsmith(__dirname)
  .source('./src')
  .destination('./dest')
  .use(autotoc({selector: 'h2, h3, h4'}))
  .use(templates({
    engine: 'eco',
    directory: './templates'
  }))
  .build();
```

Results file `dest/index.html`:

```
<ul>

  <li><a href="#aaa">aaa</a></li>

  <li><a href="#bbb">bbb</a></li>

  <li><a href="#ccc">ccc</a></li>

</ul>

<h2 id="aaa">aaa</h2>

<p>paragraph</p>

<h2 id="bbb">bbb</h2>

<p>paragraph</p>

<h2 id="ccc">ccc</h2>

<p>paragraph</p>
```

## License

MIT
