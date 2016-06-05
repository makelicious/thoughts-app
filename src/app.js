import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { find, sample } from 'lodash';

import {
  getThoughts,
  saveThoughts
} from 'utils/storage';

import {
  parseTodos,
  parseHashtags,
  createThought,
  getUnfinishedTodos,
  UNFINISHED_TODO_TAG
} from 'utils/thought';

import {
  isUp,
  isThoughtCreatingKeypress
} from 'utils/keys';

import Thought from 'components/thought';
import Hashtag from 'components/hashtag';
import Notification from 'components/notification';
import FilterBar from 'components/filter-bar';
import Scaler from 'components/scaler';

const backgrounds = [
  'https://images.unsplash.com/photo-1463595373836-6e0b0a8ee322?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1460804198264-011ca89eaa43?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1338&q=80',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1823&q=80',
  'https://images.unsplash.com/photo-1452473767141-7c6086eacf42?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1460378150801-e2c95cb65a50?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1447834353189-91c48abf20e1?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1443890484047-5eaa67d1d630?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1450849608880-6f787542c88a?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=994&q=80'
];

const randomBackground = sample(backgrounds);

export default React.createClass({
  getInitialState() {
    return {
      thoughts: getThoughts(),
      editableThoughtId: null,
      currentText: '',
      hashtagFilters: []
    }
  },
  componentDidMount() {
    document.addEventListener('keydown', this.checkForSpecialKey);
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkForSpecialKey);
  },
  checkForSpecialKey(event) {
    const thoughts = this.state.thoughts;

    // Edit the most recent thought
    if(!this.state.editableThoughtId && isUp(event.keyCode) && thoughts.length > 0) {
      this.resetFilters();
      this.setEditable(thoughts[thoughts.length - 1]);
      return;
    }

    // Create thought
    if(!this.state.editableThoughtId && isThoughtCreatingKeypress(event)) {
      this.resetFilters();

      const newThought = this.createThought('');
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
  setEditable(thought) {
    // Something is already being edited
    if(this.state.editableThoughtId) {
      const editableThought =
        find(this.state.thoughts, {id: this.state.editableThoughtId});
      this.stopEditing(editableThought);
    }

    this.setState({
      editableThoughtId: thought.id
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
      hashtagFilters: this.state.hashtagFilters.concat(hashtag)
    });
  },
  removeFromFilter(hashtag) {
    this.setState({
      hashtagFilters: this.state.hashtagFilters.filter((hash) => hash !== hashtag)
    });
  },
  resetFilters() {
    this.setState({
      hashtagFilters: []
    });
  },
  updateThought(thought, newThought) {
    const updatedThoughts = this.state.thoughts.map((thoug) => {
      if(thoug !== thought) {
        return thoug;
      }
      return newThought;
    });

    this.setState({
      thoughts: updatedThoughts
    });

    saveThoughts(updatedThoughts);
  },
  render() {
    const thoughts = this.state.thoughts;
    const hashtagFilters = this.state.hashtagFilters;

    const unfinishedTodos = getUnfinishedTodos(thoughts);

    const filteredThoughts = hashtagFilters.length === 0 ?
      thoughts :
      thoughts.filter((thought) => {
        return hashtagFilters.every((hashtag) =>
          thought.hashtags.indexOf(hashtag) > -1
        );
      });

    const ThoughtsWrapper = hashtagFilters.length === 0 ?
      Scaler :
      'div';

    return (
      <div style={{backgroundImage: `url(${randomBackground})`}} className="app" onClick={this.resetEditable}>

        <FilterBar
          hashtags={hashtagFilters}
          onRemoveTag={this.removeFromFilter}
          onReset={this.resetFilters} />

        {
          unfinishedTodos.length > 0 && (
            <Notification onClick={() => this.addFilter(UNFINISHED_TODO_TAG)} />
          )
        }
        <div className="thoughts-container">
          <ThoughtsWrapper ref="thoughts" className="thoughts">
            {
              filteredThoughts.map((thought) => {
                return (
                  <Thought
                    key={thought.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.setEditable(thought);
                    }}
                    onChange={(newThought) =>
                      this.updateThought(thought, newThought)}
                    onSubmit={() => this.stopEditing(thought)}
                    onCancel={() => this.stopEditing(thought)}
                    onDelete={() => this.deleteThought(thought)}
                    onHashtagClicked={this.addFilter}
                    editable={this.state.editableThoughtId === thought.id}
                    thought={thought} />

                )
              })
            }
          </ThoughtsWrapper>
        </div>
      </div>
    );
  }
});
