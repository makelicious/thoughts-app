import { expect } from 'chai';
import { replaceNth } from '../text';
import { CHECKBOX_REGEXP } from 'utils/thought';

describe('Text utility', () => {
  describe('replaceNth', () => {
    it('replaces the nth occurence of pattern with replacer', () => {
      expect(
        replaceNth('#foobar hello world []', 0, CHECKBOX_REGEXP, '[x]'),
      ).to.equal('#foobar hello world [x]');
    });
  });
});
