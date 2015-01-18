# metalsmith-autotoc

> A metalsmith plugin to generate table of contents of a document.

This plugin generate table of contents object to document's metadata.

## Installation

```bash
$ npm install metalsmith-autotoc
```

## Configuration

### headerIdPrefix

Default: ``

This value will be added to generated header ids as a prefix.

### selector

Default: `'h2,h3,h4,h5,h6'`

A list of header selectors to search. 

## Example

Source file `src/index.html`:

```html
---
autotoc: true
template: 'layout.eco'
---
<h2 id="aaa">aaa</h2>
<p>paragraph</p>

<h3 id="bbb">bbb</h3>
<p>paragraph</p>

<h3 id="ccc">ccc</h3>
<p>paragraph</p>

<h2 id="ddd">ddd</h2>
<p>paragraph</p>
```

Template file `templates/layout.eco`:

```eco
<% renderToc = (items) => %>
<ol class="toc">
  <% for item in items: %>
  <li><a href="#<%= item.id %>"><%= item.text %></a>
    <% if item.children.length > 0: %><%- renderToc(item.children) %><% end %>
  </li>
  <% end %>
</ol>
<% end %>

<% if @toc: %>
<%- renderToc(@toc) %>
<% end %>

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

<ol class="toc">
  <li><a href="#aaa">aaa</a>
    <ol class="toc">
      <li><a href="#bbb">bbb</a></li>
      <li><a href="#ccc">ccc</a></li>
    </ol>
  </li>
  <li><a href="#ddd">ddd</a></li>
</ol>

<h2 id="aaa">aaa</h2>
<p>paragraph</p>

<h3 id="bbb">bbb</h3>
<p>paragraph</p>

<h3 id="ccc">ccc</h3>
<p>paragraph</p>

<h2 id="ddd">ddd</h2>
<p>paragraph</p>
```

## License

MIT
