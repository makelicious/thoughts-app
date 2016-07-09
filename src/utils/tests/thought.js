import { expect } from 'chai';
import { parseTodos, parseHashtags } from '../thought';

describe('Thought utility', () => {

  describe('parseTodos', () => {
    it('returns all todos from given string', () => {
      expect(parseTodos('foobar').length).to.equal(0);
      expect(parseTodos('foobar []').length).to.equal(1);
      expect(parseTodos('[] foo [] bar []').length).to.equal(3);
      expect(parseTodos('![](foo)').length).to.equal(0);
      expect(parseTodos(' #ruoka 13.6 klo 11.30 ![](https://i.imgur.com/ybOxY29.png) about tän näköstä').length).to.equal(0);
    });
  });

  describe('parseHashtags', () => {
    it('parses hashtags with dashes in them', () => {
      expect(parseHashtags('#foo-barer')).to.deep.equal(['#foo-barer']);
    });
  });

});
