import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import proxyquire from 'proxyquire';

const Thought = proxyquire('../', {
  './assets/pen.svg': () => <div />,
  './assets/trash.svg': () => <div />
}).default;

function createThought(text) {
  return {
    text
  };
}

function shouldGenerateLinks(text, links) {

  const thought = render(
    <Thought thought={createThought(text)} />
  );
  expect(thought.find('a')).to.have.length(links.length);

  Array.from(thought.find('a')).forEach((link, i) => {
    expect(link.children[0].data).to.equal(links[i]);
  });
}

function checkboxesForText(text) {
  const thought = render(
    <Thought thought={createThought(text)} />
  );
  return thought.find('[type="checkbox"]');
}

describe('<Thought />', () => {

  describe('checkbox rendering', () => {

    it('renders checkboxes from custom markdown', () => {
      expect(checkboxesForText('[] []')).to.have.length(2);
      expect(checkboxesForText('#ruok []')).to.have.length(1);
      expect(checkboxesForText('#ruok_bar_baz []')).to.have.length(1);
      expect(checkboxesForText('#ruok-bar-baz []')).to.have.length(1);
      expect(checkboxesForText('[] #ruok_bar_baz [] [] [x]')).to.have.length(4);
      expect(checkboxesForText(`#shopping-list
- eggs [x]
- potatoes []
- more potatoes [x]
- toothbrush [x]
- tiger blood []`)).to.have.length(5);
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
      shouldGenerateLinks('#foo_bar #baz', ['#foo_bar', '#baz']);
      shouldGenerateLinks('#foo_bar_baz', ['#foo_bar_baz']);
      shouldGenerateLinks('[] #foo_bar_baz keke', ['#foo_bar_baz']);
      shouldGenerateLinks('[] #foo_bar_baz \nkeke', ['#foo_bar_baz']);
      shouldGenerateLinks('[] #foo_bar_baz__keke', ['#foo_bar_baz__keke']);
    });
  });

  describe('url rendering', () => {

    it('renders urls as links', () => {
      const LINK_WITH_HASH =
        'http://www.korus.fi/#!Siru-sormus/zoom/e08rh/dataItem-ijwswu97';

      shouldGenerateLinks('http://google.com', ['http://google.com']);
      shouldGenerateLinks(LINK_WITH_HASH, [LINK_WITH_HASH]);
      shouldGenerateLinks(`${LINK_WITH_HASH} foobar`, [LINK_WITH_HASH]);
      shouldGenerateLinks(`bar ${LINK_WITH_HASH} foobar`, [LINK_WITH_HASH]);
      shouldGenerateLinks(
        `#investing #esports nvidia osakkeet, ea? Activision
          http://google.com
          modern times group B`,
        ['#investing', '#esports', 'http://google.com']
      );
    });
  });
});
