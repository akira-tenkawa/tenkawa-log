// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

function parseImageClasses(value) {
  const match = value.trim().match(/^\{(\.[A-Za-z0-9_-]+(?:\s+\.[A-Za-z0-9_-]+)*)\}$/);

  if (!match) {
    return null;
  }

  return match[1]
    .trim()
    .split(/\s+/)
    .map((className) => className.slice(1))
    .filter(Boolean);
}

function visitNodes(node, callback) {
  callback(node);

  if (!node || !Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    visitNodes(child, callback);
  }
}

function remarkImageClassShortcuts() {
  return (tree) => {
    visitNodes(tree, (node) => {
      if (node.type !== 'paragraph' || !Array.isArray(node.children)) {
        return;
      }

      for (let index = 0; index < node.children.length - 1; index += 1) {
        const imageNode = node.children[index];
        const nextNode = node.children[index + 1];

        if (imageNode.type !== 'image' || nextNode.type !== 'text') {
          continue;
        }

        const classes = parseImageClasses(nextNode.value);

        if (!classes) {
          continue;
        }

        const existingClassName = imageNode.data?.hProperties?.className;
        const existingClasses = Array.isArray(existingClassName)
          ? existingClassName
          : typeof existingClassName === 'string'
            ? existingClassName.split(/\s+/).filter(Boolean)
            : [];

        imageNode.data ??= {};
        imageNode.data.hProperties ??= {};
        imageNode.data.hProperties.className = [...new Set([...existingClasses, ...classes])];

        node.children.splice(index + 1, 1);
      }
    });
  };
}

function isExternalLinkHref(href) {
  return /^https?:\/\//i.test(href) || /^\/\//.test(href);
}

function mergeRelValues(existingRel) {
  const relValues = Array.isArray(existingRel)
    ? existingRel
    : typeof existingRel === 'string'
      ? existingRel.split(/\s+/).filter(Boolean)
      : [];

  return [...new Set([...relValues, 'noopener', 'noreferrer'])].join(' ');
}

function rehypeExternalLinks() {
  return (tree) => {
    visitNodes(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'a') {
        return;
      }

      const href = node.properties?.href;

      if (typeof href !== 'string' || !isExternalLinkHref(href)) {
        return;
      }

      node.properties ??= {};
      node.properties.target = '_blank';
      node.properties.rel = mergeRelValues(node.properties.rel);
    });
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkImageClassShortcuts],
    rehypePlugins: [rehypeExternalLinks]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
