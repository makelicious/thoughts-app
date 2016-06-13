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

      function matchTags(text, tags) {

        const thought = render(
          <Thought thought={createThought(text)} />
        );
        expect(thought.find('a')).to.have.length(tags.length);

        Array.from(thought.find('a')).forEach((link, i) => {
          expect(link.children[0].data).to.equal(tags[i]);
        });
      }

      matchTags('#foo_bar #baz', ['#foo_bar', '#baz'])
      matchTags('#foo_bar_baz', ['#foo_bar_baz'])
      matchTags('[] #foo_bar_baz keke', ['#foo_bar_baz'])
      matchTags('[] #foo_bar_baz \nkeke', ['#foo_bar_baz'])
      matchTags('[] #foo_bar_baz__keke', ['#foo_bar_baz__keke'])
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
