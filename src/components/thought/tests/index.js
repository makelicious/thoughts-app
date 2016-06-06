import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';

import Thought  from '../';

function createThought(text) {
  return {
    text
  }
}

describe('<Thought />', () => {

  describe('checkbox rendering', () => {

    it('renders checkboxes from custom markdown', () => {
      const thought = render(
        <Thought thought={createThought('[] []')} />
      );
      expect(thought.find('[type="checkbox"]')).to.have.length(2);
    });

    it('renders checked checkboxes from markdown', () => {
      const thought = render(
        <Thought thought={createThought('[] [x]')} />
      );
      expect(thought.find('[checked]')).to.have.length(1);
    });
  });

  describe('hashtag rendering', () => {

    it('renders hashtags as links', () => {
      const thought = render(
        <Thought thought={createThought('#foobar #baz')} />
      );
      expect(thought.find('a')).to.have.length(2);
    });

    it('renders hashtags that have underscore in them', () => {
      const thought = render(
        <Thought thought={createThought('#foo_bar #baz')} />
      );
      expect(thought.find('a')).to.have.length(2);
      expect(thought.find('a:first-child').text()).to.equal('#foo_bar');
      expect(thought.find('a:last-child').text()).to.equal('#baz');
    });
  });

  describe('url rendering', () => {

    it('renders urls as links', () => {
      const thought = render(
        <Thought thought={createThought('http://google.com')} />
      );
      expect(thought.find('a')).to.have.length(1);
      expect(thought.find('a').text()).to.equal('http://google.com');
    });
  });
});
