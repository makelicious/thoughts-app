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
  isThoughtCreatingKeypress
} from 'utils/keys';

import Thought from 'components/thought';

import Notification from 'components/notification';
import FilterBar from 'components/filter-bar';
import Scaler from 'components/scaler';
import Background from 'components/background';
import Search from 'components/search';

import {
  createThought,
  deleteThought,
  modifyThought,
  stopEditing,
  setEditable,
  resetFilters,
  removeFilter,
  addFilter
} from 'thoughts/actions';

const App = React.createClass({
  componentDidMount() {
    document.addEventListener('keydown', this.checkForSpecialKey, true);
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkForSpecialKey, true);
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
    this.props.dispatch(addFilter(hashtag));
  },
  removeFromFilter(hashtag) {
    this.props.dispatch(removeFilter(hashtag));
  },
  resetFilters() {
    this.props.dispatch(resetFilters());
  },
  resetEditable() {
    const id = this.props.editableThoughtId;
    console.log(id);
    if (id) {
      const thought = find(this.props.thoughts, { id });
      this.props.dispatch(stopEditing(thought));
    }
  },
  checkForSpecialKey(event) {
    console.log(event.target.tagName);
    const thoughts = this.props.thoughts;

    // Edit the most recent thought
    if (!this.props.editableThoughtId && isUp(event.keyCode) && thoughts.length > 0) {
      this.setEditable(thoughts[0]);
      return;
    }

    // Reset filters with ESC
    if (!this.props.editableThoughtId && isEsc(event.keyCode)) {
      this.resetFilters();
      return;
    }

    // Create thought
    if (!this.props.editableThoughtId &&
        isThoughtCreatingKeypress(event) &&
        event.target.tagName !== 'INPUT') {
      const initialText = `${this.props.hashtagFilters.join(' ')} `;
      this.props.dispatch(createThought(initialText));
    }
  },
  render() {
    const thoughts = this.props.thoughts;
    const hashtagFilters = this.props.hashtagFilters;
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

    // Use thought scaler only when filters are not used
    const ThoughtsWrapper = hashtagFilters.length === 0 ?
      Scaler :
      'div';

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

          {
            unfinishedTodos.length > 0 && (
              <Notification onClick={() => this.addFilter(UNFINISHED_TODO_TAG)} />
            )
          }
        </div>
        <ThoughtsWrapper ref="thoughts" className="thoughts">
          {
            filteredThoughts.map((thought) => (
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
        </ThoughtsWrapper>
      </Background>
    );
  }
});

function storeToProps(store) {
  return {
    thoughts: store.thoughts,
    editableThoughtId: store.editor.editableThoughtId,
    editedWhileFilterOn: store.editor.editedWhileFilterOn,
    hashtagFilters: store.editor.hashtagFilters
  };
}

export default connect(storeToProps)(App);
