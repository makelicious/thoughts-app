/*
 * Walker receives an Abstract Syntax Tree (AST) from Markdown parser
 * and turns i.e. hashtags and checkboxes into our custom components
 */

import { Node } from 'commonmark';

const HASHTAG = /#[a-z]+/g;

function isTextNode(node) {
  return node && node.type === 'Text';
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

function isHashtagNode(node) {
  return isTextNode(node) && node.literal.match(HASHTAG);
}

function createHashtagNode(hashtag) {
  const hashtagNode = new Node('Link');
  hashtagNode.destination = `hashtags/${hashtag}`;
  hashtagNode.title = `hashtags/${hashtag}`;

  const textNode = new Node('Text');
  textNode.literal = hashtag;
  hashtagNode.appendChild(textNode)

  return hashtagNode;
}

function createHashtags({entering, node}) {

  if(!isHashtagNode(node)) {
    return;
  }

  const hashtags = node.literal.match(HASHTAG);
  const other = node.literal.split(HASHTAG);

  node.literal = node.literal.replace(HASHTAG, '');

  let prevNode = null;

  other.forEach((text, i) => {
    const textNode = new Node('Text');
    textNode.literal = text;

    node.parent.appendChild(textNode);

    if(prevNode) {
      prevNode.insertAfter(textNode);
    } else {
      node.insertBefore(textNode);
    }

    const last = i === other.length - 1;

    prevNode = textNode;

    if(last) {
      return;
    }

    const nextHashtag = hashtags[i];
    const hashtagNode = createHashtagNode(nextHashtag);

    node.parent.appendChild(hashtagNode);
    prevNode.insertAfter(hashtagNode);

    prevNode = hashtagNode;
  });

  node.unlink();
}

function createCheckboxes({entering, node}) {
  if(!isCheckboxNode(node)) {
    return;
  }
  const checkboxNode = new Node('Checkbox');
  checkboxNode.literal = node.next.literal;

  node.parent.appendChild(checkboxNode);
  node.insertBefore(checkboxNode);

  if(node.next.next && node.next.next.literal === ']') {
    node.next.next.unlink();
  }

  node.next.literal = ''; // TODO no idea why I cant just unlink this
  // node.next.unlink();
  node.unlink();
}

export default function walker(position) {
  createHashtags(position);
  createCheckboxes(position);
}
