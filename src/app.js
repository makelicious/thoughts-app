import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { find, without } from 'lodash';

import {
  getThoughts,
  saveThoughts
} from 'utils/storage';

import {
  sortByRelativity
} from 'utils/relater';

import {
  parseTodos,
  parseHashtags,
  createThought,
  getUnfinishedTodos,
  UNFINISHED_TODO_TAG
} from 'utils/thought';

import {
  isUp,
  isEsc,
  isThoughtCreatingKeypress
} from 'utils/keys';

import Thought from 'components/thought';
import Hashtag from 'components/hashtag';
import Notification from 'components/notification';
import FilterBar from 'components/filter-bar';
import Scaler from 'components/scaler';
import Background from 'components/background';

export default React.createClass({
  getInitialState() {
    return {
      thoughts: getThoughts(),
      editableThoughtId: null,
      currentText: '',
      hashtagFilters: [],
      suggestion: null,
      // Thoughts created or modified while filter view
      // It would probably be weird if they would just disappeared when you delete a tag
      editedWhileFilterOn: []
    }
  },
  componentDidMount() {
    document.addEventListener('keydown', this.checkForSpecialKey, true);
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkForSpecialKey, true);
  },
  checkForSpecialKey(event) {
    const thoughts = this.state.thoughts;

    // Edit the most recent thought
    if(!this.state.editableThoughtId && isUp(event.keyCode) && thoughts.length > 0) {
      this.setEditable(thoughts[thoughts.length - 1]);
      return;
    }

    // Reset filters with ESC
    if(!this.state.editableThoughtId && isEsc(event.keyCode)) {
      this.resetFilters();
      return;
    }

    // Create thought
    if(!this.state.editableThoughtId && isThoughtCreatingKeypress(event)) {
      const initialText = `${this.state.hashtagFilters.join(' ')} `;
      const newThought = this.createThought(initialText);
      this.setEditable(newThought);
      return;
    }
  },
  createThought(text) {
    const newThought = createThought(text);
    const updatedThoughts = this.state.thoughts.concat(newThought);

    this.setState({
      thoughts: updatedThoughts
    });

    return newThought;
  },
  deleteThought(thought) {
    const updatedThoughts = this.state.thoughts.filter((thoug) =>
      thought !== thoug
    );

    this.setState({
      thoughts: updatedThoughts,
      editableThoughtId: null
    });

    saveThoughts(updatedThoughts);
  },
  hasFilter() {
    return this.state.hashtagFilters.length > 0;
  },
  findThoughtById(id) {
    return find(this.state.thoughts, { id });
  },
  setEditable(thought) {
    // Something is already being edited
    if(this.state.editableThoughtId) {
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

    if(thought.text.trim() === '') {
      this.deleteThought(thought);
      return;
    }

    saveThoughts(this.state.thoughts);
  },
  resetEditable() {
    this.setState({ editableThoughtId: null });
  },
  addFilter(hashtag) {
    const filterExists = this.state.hashtagFilters.indexOf(hashtag) > -1;

    if(filterExists) {
      return;
    }

    this.setState({
      hashtagFilters: this.state.hashtagFilters.concat(hashtag),
      editedWhileFilterOn: []
    });
  },
  removeFromFilter(hashtag) {
    if(this.state.hashtagFilters.length === 1) {
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
      if(thoug !== thought) {
        return thoug;
      }
      return newThought;
    });

    const suggestions = newThought.text.length < 0 ?
      [] :
      this.state.thoughts.filter((thoug) =>
        thoug.id !== newThought.id && thoug.text.indexOf(newThought.text) === 0
      );

    this.setState({
      thoughts: updatedThoughts,
      suggestion: suggestions.length === 0 ? null : suggestions[0].text
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

        <FilterBar
          hashtags={hashtagFilters}
          thoughts={thoughts}
          onAddTag={this.addFilter}
          onRemoveTag={this.removeFromFilter}
          onReset={this.resetFilters} />


        <div className="thoughts-container">
          {
            unfinishedTodos.length > 0 && (
              <Notification onClick={() => this.addFilter(UNFINISHED_TODO_TAG)} />
            )
          }
          <ThoughtsWrapper ref="thoughts" className="thoughts">
            {
              filteredThoughts.map((thought) => {
                return (
                  <Thought
                    key={thought.id}
                    suggestion={this.state.suggestion}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.setEditable(thought);
                    }}
                    onChange={(newThought) =>
                      this.updateThought(thought, newThought)}
                    onSubmit={() => this.stopEditing(thought)}
                    onCancel={() => this.stopEditing(thought)}
                    onDelete={() => this.deleteThought(thought)}
                    onHashtagClick={this.addFilter}
                    editable={this.state.editableThoughtId === thought.id}
                    thought={thought} />

                )
              })
            }
          </ThoughtsWrapper>
        </div>
      </Background>
    );
  }
});
