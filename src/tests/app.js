import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';
import proxyquire from 'proxyquire';
import { createThought } from 'utils/thought';

global.document = {
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {};

function createApp(props) {
  const defaultProps = {
    hashtagFilters: [],
    editedWhileFilterOn: [],
    thoughts: []
  };

  const App = proxyquire('app', {
    'react-redux': {
      connect: () => (comp) => comp
    }
  }).default;

  return render(<App {...defaultProps} {...props} />);
}


describe('<App />', () => {
  it('renders thoughts', () => {
    const appWith1Thought = createApp({
      thoughts: [createThought('foo')]
    });

    expect(appWith1Thought.find('.thought')).to.have.length(1);

    const with2Thoughts = createApp({
      thoughts: [
        createThought('foo #bar'),
        createThought('hello')
      ]
    });

    expect(with2Thoughts.find('.thought')).to.have.length(2);
  });

  it('filters thoughts based on given filters', () => {
    const app = createApp({
      thoughts: [
        createThought('foo #bar'),
        createThought('hello')
      ],
      hashtagFilters: ['#bar']
    });

    expect(app.find('.thought')).to.have.length(1);
  });
  it('filters thoughts with hashtag with dashes', () => {
    const app = createApp({
      thoughts: [
        createThought('foo #bara-barer'),
        createThought('hello')
      ],
      hashtagFilters: ['#bara-barer']
    });

    expect(app.find('.thought')).to.have.length(1);
  });
});
