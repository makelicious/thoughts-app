import React from 'react';
import { find } from 'lodash';
import { connect } from 'react-redux';

import {
  saveThought,
  getThoughts,
  deleteThought,
  updateThought
} from 'utils/storage';

import {
  createThought,
  getUnfinishedTodos,
  sortByCreatedAt,
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

const App = React.createClass({
  getInitialState() {
    return {
      thoughts: [],
      editableThoughtId: null,
      currentText: '',
      hashtagFilters: [],
      // Thoughts created or modified while filter view
      // It would probably be weird if they would just disappeared when you delete a tag
      editedWhileFilterOn: []
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.board === this.props.board) {
      return;
    }

    // When board param changes, basically reset everything
    this.setState(this.getInitialState());
    this.loadThoughts(nextProps.board);
  },
  componentDidMount() {
    document.addEventListener('keydown', this.checkForSpecialKey, true);

    if (!this.isInIntroMode()) {
      this.loadThoughts(this.props.board);
    }
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkForSpecialKey, true);
  },
  isInIntroMode() {
    return !this.props.board;
  },
  loadThoughts(board) {
    getThoughts(board).then((thoughts) => {
      this.setState({
        thoughts: thoughts.sort(sortByCreatedAt)
      });
    });
  },
  checkForSpecialKey(event) {
    const thoughts = this.state.thoughts;

    // Edit the most recent thought
    if (!this.state.editableThoughtId && isUp(event.keyCode) && thoughts.length > 0) {
      this.setEditable(thoughts[0]);
      return;
    }

    // Reset filters with ESC
    if (!this.state.editableThoughtId && isEsc(event.keyCode)) {
      this.resetFilters();
      return;
    }

    // Create thought
    if (!this.state.editableThoughtId && isThoughtCreatingKeypress(event)) {
      const initialText = `${this.state.hashtagFilters.join(' ')} `;
      const newThought = this.createThought(initialText);
      this.setEditable(newThought);
      return;
    }
  },
  createThought(text) {
    const newThought = createThought(text);
    const updatedThoughts = [newThought].concat(this.state.thoughts);

    this.setState({
      thoughts: updatedThoughts
    });

    return newThought;
  },
  deleteThought(thought) {

    // Delete thought from state optimistically
    // Do nothing with the return value of the delete api request
    const updatedThoughts = this.state.thoughts.filter((thoug) =>
      thought !== thoug
    );

    this.setState({
      thoughts: updatedThoughts,
      editableThoughtId: null
    });

    if (!this.isInIntroMode()) {
      deleteThought(this.props.board, thought);
    }
  },
  hasFilter() {
    return this.state.hashtagFilters.length > 0;
  },
  findThoughtById(id) {
    return find(this.state.thoughts, { id });
  },
  setEditable(thought) {
    // Something is already being edited
    if (this.state.editableThoughtId) {
      const editableThought =
        this.findThoughtById(this.state.editableThoughtId);

      this.stopEditing(editableThought);
    }

    this.setState({
      editableThoughtId: thought.id,
      editedWhileFilterOn: this.hasFilter() ?
        this.state.editedWhileFilterOn.concat(thought.id) :
        this.state.editedWhileFilterOn
    });
  },
  stopEditing(thought) {
    this.resetEditable();

    if (thought.text.trim() === '') {
      this.deleteThought(thought);
      return;
    }

    if (this.isInIntroMode()) {
      return;
    }

    if (thought._id) {
      updateThought(this.props.board, thought)
      .then((updatedThought) => {
        this.updateThought(thought, updatedThought);
      });
    } else {
      saveThought(this.props.board, thought).then((savedThought) => {
        this.updateThought(thought, savedThought);
      });
    }
  },
  resetEditable() {
    this.setState({ editableThoughtId: null });
  },
  addFilter(hashtag) {
    const filterExists = this.state.hashtagFilters.indexOf(hashtag) > -1;

    if (filterExists) {
      return;
    }

    this.setState({
      hashtagFilters: this.state.hashtagFilters.concat(hashtag),
      editedWhileFilterOn: []
    });
  },
  removeFromFilter(hashtag) {
    if (this.state.hashtagFilters.length === 1) {
      this.resetFilters();
      return;
    }

    this.setState({
      hashtagFilters: this.state.hashtagFilters.filter((hash) => hash !== hashtag)
    });
  },
  resetFilters() {
    this.setState({
      hashtagFilters: [],
      editedWhileFilterOn: []
    });
  },
  updateThought(thought, newThought) {
    const updatedThoughts = this.state.thoughts.map((thoug) => {
      if (thoug !== thought) {
        return thoug;
      }
      return newThought;
    });

    this.setState({
      thoughts: updatedThoughts
    });
  },
  render() {
    const thoughts = this.state.thoughts;
    const hashtagFilters = this.state.hashtagFilters;

    const unfinishedTodos = getUnfinishedTodos(thoughts);

    const filteredThoughts = hashtagFilters.length === 0 ?
      thoughts :
      thoughts.filter((thought) => {
        const edited = this.state.editedWhileFilterOn.indexOf(thought.id) > -1;

        const hasMatchingTag = hashtagFilters.every((hashtag) =>
          thought.hashtags.indexOf(hashtag) > -1
        );

        return edited || hasMatchingTag;
      });

    const ThoughtsWrapper = hashtagFilters.length === 0 ?
      Scaler :
      'div';

    return (
      <Background className="app" onClick={this.resetEditable}>
        <div className="overlays">
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
                onChange={(updatedThought) =>
                  this.updateThought(thought, updatedThought)}
                onSubmit={(updatedThought) =>
                  this.stopEditing(updatedThought)}
                onCancel={() => this.stopEditing(thought)}
                onDelete={() => this.deleteThought(thought)}
                onHashtagClick={this.addFilter}
                editable={this.state.editableThoughtId === thought.id}
                thought={thought} />
            ))
          }
        </ThoughtsWrapper>
      </Background>
    );
  }
});

export default connect((store) => ({
  thoughts: store.thoughts
}))(App);
