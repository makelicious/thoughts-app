/*
 * Walker receives an Abstract Syntax Tree (AST) from Markdown parser
 * and turns i.e. hashtags and checkboxes into our custom components
 */

import { Node } from 'commonmark';

import { HASHTAG_REGEXP } from 'utils/thought';

const LINK_REGEXP = /(?:\w+:)?\/\/(?:[^\s\.]+\.\S{2}|localhost[:?\d]*)\S*/g;

function endsWithSpace(str) {
  return Boolean(str.match(/\s$/));
}

/*
 * Markdown handles _ as a start of italic text i.e. _some italic_
 * but we want to disable this behaviour inside hashtags
 * ["#hash", "_", "tag"] => ["#hash_tag"]
 * ["http://www.korus.fi/", "#", "!Siru-sormus/zoom/e08rh/dataItem-ijwswu97"]
 */

function combineFollowingTexts(node, walker) {
  if (!node.literal.match(HASHTAG_REGEXP) &&
     !node.literal.match(LINK_REGEXP)) {
    return;
  }

  let nextNode = node.next;
  let resumeAt = node.next;

  if (endsWithSpace(node.literal)) {
    return;
  }

  while (nextNode && nextNode.type === 'Text') {
    // eslint-disable-next-line no-param-reassign
    node.literal += nextNode.literal;

    node.next.unlink();

    resumeAt = node.next;

    if (endsWithSpace(nextNode.literal)) {
      break;
    }

    nextNode = node.next;
  }

  // Skip walking on the unlinked nodes
  walker.resumeAt(resumeAt || node.parent.next, true);
}

function searchFromAst(node, fn) {

  const walker = node.walker();
  const result = [];

  let event;

  // eslint-disable-next-line no-cond-assign
  while ((event = walker.next())) {
    if (fn(event.node)) {
      result.push(event.node);
    }
  }
  return result;
}

function replaceInsideTextNode(node, replacerFn) {

  const literal = node.literal.trim();

  literal.split(' ').forEach((str) => {
    const newNode = replacerFn(str);
    node.parent.appendChild(newNode);
    node.insertBefore(newNode);

    const spaceNode = createTextNode(' ');
    node.parent.appendChild(spaceNode);
    node.insertBefore(spaceNode);
  });

  node.unlink();
}

function isCheckboxNode(node) {
  // Accepts [], [ ] and [x]

  return isTextNode(node) &&
    isTextNode(node.next) &&
    node.literal === '[' && // Has to start with [
    ( // Has to be followed with wither
      // node that is ]
      node.next.literal === ']' ||
      // or a random node and a node following that with ]
      (isTextNode(node.next.next) && node.next.next.literal === ']')
    );
}

function isTextNode(node) {
  return node && node.type === 'Text';
}

function createHashtagNode(hashtag) {
  const hashtagNode = new Node('Hashtag');

  hashtagNode.literal = {
    hashtag
  };

  const textNode = new Node('Text');
  textNode.literal = hashtag;
  hashtagNode.appendChild(textNode);

  return hashtagNode;
}

function createTextNode(text) {
  const textNode = new Node('Text');
  textNode.literal = text;
  return textNode;
}

function createLinkNode(url) {
  const linkNode = new Node('Link');
  linkNode.destination = url;

  // Create text node that goes inside link node
  const textNode = new Node('Text');
  textNode.literal = url;
  linkNode.appendChild(textNode);
  return linkNode;
}


function createCheckboxes(node, walker) {

  let resumeAt;

  // Calculate the index of this checkbox inside of one thought
  // it's used for selecting right todo to mark as done / undone on click

  const allCheckboxNodes = searchFromAst(walker.root, (currentNode) =>
    currentNode.type === 'Checkbox'
  );

  const hashtagIndex = allCheckboxNodes.length;

  const checkboxNode = new Node('Checkbox');
  checkboxNode.literal = {
    checked: node.next.literal.trim().toLowerCase() === 'x',
    index: hashtagIndex
  };

  node.parent.appendChild(checkboxNode);
  node.insertBefore(checkboxNode);

  if (node.next.next && node.next.next.literal === ']') {
    resumeAt = node.next.next.next;
    node.next.next.unlink();
  }

  resumeAt = resumeAt || node.next.next || node.parent.next;

  node.next.unlink();
  node.unlink();

  // Skip walking on the unlinked nodes
  walker.resumeAt(resumeAt, true);
}

function transformText(node) {
  replaceInsideTextNode(node, (str) => {
    if (str.match(HASHTAG_REGEXP)) {
      return createHashtagNode(str);
    }
    if (str.match(LINK_REGEXP)) {
      return createLinkNode(str);
    }
    return createTextNode(str);
  });
}

export default function doWalk({ node }, walker) {
  if (isCheckboxNode(node)) {
    createCheckboxes(node, walker);
    return;
  }

  if (isTextNode(node)) {
    combineFollowingTexts(node, walker);
    transformText(node);
  }
}
