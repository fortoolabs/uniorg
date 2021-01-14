import unified from 'unified';
import visit from 'unist-util-visit';
import inspectUrls from 'rehype-url-inspector';

import orgParse from 'uniorg-parse';
import org2rehype from 'uniorg-rehype';

const processor = unified()
  .use(orgParse)
  .use(extractExportSettings)
  .use(org2rehype)
  .use(inspectUrls, { inspectEach: processUrl })
  .use(toJson);

export default async function orgToHtml(file) {
  return await processor.process(file);
}

/**
 * Extract all `#+KEYWORD`'s from org post and attach them to
 * `file.data`.
 */
function extractExportSettings() {
  return transformer;

  function transformer(node, file) {
    // Visit every keyword in the org file and copy its value to the
    // file. file is then returned from processor.process, so all
    // keywords are available outside.
    visit(node, 'keyword', function (kw) {
      file.data[kw.key.toLowerCase()] = kw.value;
    });
  }
}

/**
 * Process each link to:
 * 1. Convert file:// links to path used by blog. file://file.org -> * /file.org
 * 2. Collect all links to file.data.links, so they can be used later * to calculate backlinks.
 */
function processUrl({ url: urlString, propertyName, node, file }) {
  // next/link does not handle relative urls properly. Use file.path
  // (the slug of the file) to normalize link against.
  let url = new URL(urlString, 'file://' + file.path);

  if (url.protocol === 'file:') {
    let href = url.pathname.replace(/\.org$/, '');
    node.properties[propertyName] = encodeURI(href);

    file.data.links = file.data.links || [];
    file.data.links.push(href);
  }
}

/** A primitive compiler to return node as is without stringifying. */
function toJson() {
  this.Compiler = (node) => {
    return node;
  };
}