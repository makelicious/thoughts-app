import { expect } from 'chai';
import { parseTodos } from '../thought';

describe('Thought utility', () => {

  describe('parseTodos', () => {
    it('should return all todos from given string', () => {
      expect(parseTodos('foobar').length).to.equal(0);
      expect(parseTodos('foobar []').length).to.equal(1);
      expect(parseTodos('[] foo [] bar []').length).to.equal(3);
      expect(parseTodos('![](foo)').length).to.equal(0);
      expect(parseTodos(' #ruoka 13.6 klo 11.30 ![](https://i.imgur.com/ybOxY29.png) about tän näköstä').length).to.equal(0);
    });
  });

});
