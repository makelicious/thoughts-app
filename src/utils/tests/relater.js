import { expect } from 'chai';
import { without } from 'lodash';
import moment from 'moment';

import { sortByRelativity } from '../relater';

function createThought(text, hashtags, createdAt) {
  return { text, hashtags, createdAt };
}

const THOUGHTS = [
  createThought('hello world', [], moment()), // ────────────────────┓
  createThought('Foobar', [], moment().add(1, 'hour')), //           │
  createThought('Hello peasants', [], moment().add(2, 'hour')), // <─┘
  createThought('Something unrelated', [], moment().add(3, 'hour')),
  createThought('derp herp', [], moment().add(4, 'hour')), // ──────────────┓
  createThought('jotain #bar', ['#bar'], moment().add(5, 'hour')), //  <─┓  │
  createThought('derp herp #bar', ['#bar'], moment().add(6, 'hour')), // ┘ <┘
  createThought('derp', [], moment().add(7, 'hour')), // <──────────────────────┓
  createThought('derp herp', [], moment().add(7, 'hour').add(2, 'minutes')) // <┘
];

describe('Thought relater', () => {

  it('orders given thoughts by the amount of relativity to given thought', () => {
    const sorted = sortByRelativity(
      THOUGHTS[0],
      without(THOUGHTS, THOUGHTS[0])
    );
    expect(sorted[0]).to.equal(THOUGHTS[2]);
  });

  it('gives value for matching hashtags', () => {
    const sorted = sortByRelativity(
      THOUGHTS[6],
      without(THOUGHTS, THOUGHTS[6])
    );
    expect(sorted[0]).to.equal(THOUGHTS[5]);
  });

  it('gives value based on how closely in time were the thoughts created', () => {
    const sorted = sortByRelativity(
      THOUGHTS[8],
      without(THOUGHTS, THOUGHTS[8])
    );
    expect(sorted[0]).to.equal(THOUGHTS[7]);
  });
});
