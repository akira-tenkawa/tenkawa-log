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

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkImageClassShortcuts]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
