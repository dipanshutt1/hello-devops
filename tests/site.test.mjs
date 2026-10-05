import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync('index.html', 'utf8');

test('page has a title, heading, and mobile viewport', () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<h1>[^<]+<\/h1>/);
  assert.match(html, /name="viewport"/);
});

test('stylesheet and JavaScript references point to nonempty files', () => {
  const css = html.match(/<link[^>]+href="([^"]+\.css)"/);
  const js = html.match(/<script[^>]+src="([^"]+\.js)"/);
  assert.ok(css, 'Missing stylesheet link');
  assert.ok(js, 'Missing JavaScript script tag');
  for (const match of [css, js]) {
    assert.ok(statSync(match[1]).size > 0, `${match[1]} must not be empty`);
  }
});

test('clicking the hello button changes the message', () => {
  assert.match(html, /id="hello-button"/);
  assert.match(html, /id="message"/);
  let onClick;
  const message = { textContent: '' };
  const document = {
    querySelector(selector) {
      if (selector === '#hello-button') return {
        addEventListener(event, callback) {
          assert.equal(event, 'click');
          onClick = callback;
        }
      };
      if (selector === '#message') return message;
      throw new Error(`Unexpected selector: ${selector}`);
    }
  };
  runInNewContext(readFileSync('script.js', 'utf8'), { document });
  assert.equal(typeof onClick, 'function');
  onClick();
  assert.match(message.textContent, /Hello/);
});
