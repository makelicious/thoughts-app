import React from 'react';
import { find } from 'lodash';
import { connect } from 'react-redux';

import {
  getUnfinishedTodos,
  UNFINISHED_TODO_TAG
} from 'utils/thought';

import {
  isUp,
  isEsc,
  isEnter,
  isThoughtCreatingKeypress,
  isBackspace
} from 'utils/keys';

import Background from 'containers/background';

import Thought from 'components/thought';

import Notification from 'components/notification';
import FilterBar from 'components/filter-bar';
import Scaler from 'components/scaler';
import Search from 'components/search';
import LoadingOverlay from 'components/loading-overlay';
import HashtagList from 'components/hashtag-list';

import {
  createThought,
  deleteThought,
  modifyThought,
  stopEditing,
  setEditable,
  resetFilters,
  removeFilter,
  addFilter,
  requestMoreThoughts
} from 'concepts/thoughts/actions';

const App = React.createClass({
  componentDidMount() {
    document.addEventListener('keydown', this.checkForSpecialKey, true);
    window.addEventListener('scroll', this.requestMoreThoughts, true);
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkForSpecialKey, true);
    window.removeEventListener('scroll', this.requestMoreThoughts, true);
  },
  distanceFromBottom() {
    const doc = document.documentElement;
    const scrollFromTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return document.body.scrollHeight - scrollFromTop - window.innerHeight;
  },
  requestMoreThoughts() {
    if (this.distanceFromBottom() < 400) {
      this.props.dispatch(requestMoreThoughts());
    }
  },
  updateThought(thought) {
    this.props.dispatch(modifyThought(thought));
  },
  deleteThought(thought) {
    this.props.dispatch(deleteThought(thought));
  },
  setEditable(thought) {
    this.props.dispatch(setEditable(thought));
  },
  stopEditing(thought) {
    this.props.dispatch(stopEditing(thought));
  },
  addFilter(hashtag) {
    this.refs.thoughts.scrollToTop();
    this.props.dispatch(addFilter(hashtag));
  },
  removeFromFilter(hashtag) {
    this.refs.thoughts.scrollToTop();
    this.props.dispatch(removeFilter(hashtag));
  },
  resetFilters() {
    this.refs.thoughts.scrollToTop();
    this.props.dispatch(resetFilters());
  },
  resetEditable() {
    const id = this.props.editableThoughtId;
    if (id) {
      const thought = find(this.props.thoughts, { id });
      this.props.dispatch(stopEditing(thought));
    }
  },
  checkForSpecialKey(event) {
    const thoughts = this.props.thoughts;
    const editing = this.props.editableThoughtId !== null;

    // Edit the most recent thought
    if (!editing && isUp(event.keyCode) && thoughts.length > 0) {
      this.setEditable(thoughts[0]);
      return;
    }

    // Reset filters with ESC
    if (!editing && isEsc(event.keyCode)) {
      this.resetFilters();
      return;
    }

    if (!editing &&
       isBackspace(event.keyCode) &&
       event.target.tagName !== 'INPUT') {
      event.preventDefault();
    }

    // Create thought
    if (!this.props.editableThoughtId &&
        isThoughtCreatingKeypress(event) &&
        event.target.tagName !== 'INPUT') {
      const initialText = this.props.hashtagFilters.length === 0 ? '' :
          `${this.props.hashtagFilters.join(' ')} `;

      // Prevents event so that thought isnt created with one empty line
      if (isEnter(event.keyCode)) {
        event.preventDefault();
      }


      this.props.dispatch(createThought(initialText));
    }
  },
  render() {
    const thoughts = this.props.thoughts;
    const hashtagFilters = this.props.hashtagFilters;
    const currentlyVisibleThoughts = this.props.currentlyVisibleThoughts;
    const unfinishedTodos = getUnfinishedTodos(thoughts);

    const filteredThoughts = hashtagFilters.length === 0 ?
      thoughts :
      thoughts.filter((thought) => {
        // Show thoughts that match current filters or that have been
        // edited while current filter was on

        const edited = this.props.editedWhileFilterOn.indexOf(thought.id) > -1;

        const hasMatchingTag = hashtagFilters.every((hashtag) =>
          thought.hashtags.indexOf(hashtag) > -1
        );

        return edited || hasMatchingTag;

      });
    // list is hidden when filters is on, or landing page is showing
    const hashtagList = (hashtagFilters.length === 0 && this.props.board !== null) ?
      <HashtagList
        onAddTag={this.addFilter}
        hashtags={this.props.hashtags} />
        :
      null;



    return (
      <Background className="app" onClick={this.resetEditable}>
        <div className="overlays">
          <Search />
          <FilterBar
            hashtags={hashtagFilters}
            thoughts={thoughts}
            onAddTag={this.addFilter}
            onRemoveTag={this.removeFromFilter}
            onReset={this.resetFilters} />
            {hashtagList}
          {
            unfinishedTodos.length > 0 && (
              <Notification onClick={() => this.addFilter(UNFINISHED_TODO_TAG)} />
            )
          }
        </div>
        <Scaler
          ref="thoughts"
          className="thoughts"
          allVisible={currentlyVisibleThoughts >= this.props.thoughts.length}>
          {
            filteredThoughts.slice(0, currentlyVisibleThoughts).map((thought) => (
              <Thought
                key={thought.id}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  this.setEditable(thought);
                }}
                onChange={this.updateThought}
                onSubmit={this.stopEditing}
                onCancel={() => this.stopEditing(thought)}
                onDelete={() => this.deleteThought(thought)}
                onHashtagClick={this.addFilter}
                editable={this.props.editableThoughtId === thought.id}
                thought={thought} />
            ))
          }
        </Scaler>
        <LoadingOverlay visible={this.props.board !== 'me' && this.props.thoughtsLoading} />
      </Background>
    );
  }
});

function storeToProps(store) {
  return {
    thoughts: store.thoughts,
    board: store.location.board,
    thoughtsLoading: store.editor.thoughtsLoading,
    editableThoughtId: store.editor.editableThoughtId,
    editedWhileFilterOn: store.editor.editedWhileFilterOn,
    currentlyVisibleThoughts: store.editor.currentlyVisibleThoughts,
    hashtagFilters: store.editor.hashtagFilters,
    hashtags: store.hashtags
  };
}


export default connect(storeToProps)(App);
