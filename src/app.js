import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import {
  getThoughts,
  saveThoughts
} from './utils/storage';

import {
  parseTodos,
  parseHashtags,
  createThought,
  getUnfinishedTodos
} from './utils/thought';

import Thought from './components/thought';
import Hashtag from './components/hashtag';
import Notification from './components/notification';

export default React.createClass({
  getInitialState() {
    return {
      thoughts: getThoughts(),
      editableThought: null,
      currentText: '',
      hashtagFilters: []
    }
  },
  componentDidMount() {
    document.addEventListener('keydown', this.createAutomatically);
    this.scrollToBottom();
  },
  componentWillUnmount() {
    document.removeEventListener('keydown', this.createAutomatically);
  },
  createAutomatically(event) {
    if(this.state.editableThought || event.metaKey) {
      return;
    }
    const newThought = this.createThought('', false);
    this.setEditable(newThought);
  },
  scrollToBottom() {
    const thoughtsContainerEl = findDOMNode(this.refs.thoughts);
    thoughtsContainerEl.scrollTop = thoughtsContainerEl.scrollHeight;
  },
  createThought(text, save = true) {
    const newThought = createThought(text);
    const updatedThoughts = this.state.thoughts.concat(newThought);

    this.setState({
      thoughts: updatedThoughts
    });

    if(save) {
      saveThoughts(updatedThoughts);
    }

    this.scrollToBottom();
    return newThought;
  },
  deleteThought(thought) {
    const updatedThoughts = this.state.thoughts.filter((thoug) =>
      thought !== thoug
    );

    this.setState({
      thoughts: updatedThoughts
    });

    saveThoughts(updatedThoughts);
  },
  setEditable(thought) {
    this.setState({ editableThought: thought }, () => {

      this.refs['thought-' + thought.id].focus();
    });

  },
  stopEditing(thought) {
    this.setState({ editableThought: null });

    if(thought.text === '') {
      this.deleteThought(thought);
      return;
    }

    saveThoughts(this.state.thoughts);
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
  resetFilters() {
    this.setState({
      hashtagFilters: []
    });
  },
  updateThought(thought, text) {
    const updatedThoughts = this.state.thoughts.map((thoug) => {
      if(thoug !== thought) {
        return thoug;
      }

      thoug.text = text;
      thoug.todos = parseTodos(text);
      thoug.hashtags = parseHashtags(text);

      return thoug;
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
        return hashtagFilters.some((hashtag) =>
          thought.hashtags.indexOf(hashtag) > -1
        );
      });

    return (
      <div className="thoughts-container">

        { /* Filters bar */
          hashtagFilters.length > 0 && (
            <div className="filters">
              <span onClick={this.resetFilters} className="filters__close"></span>
              {
                hashtagFilters.map((hashtag, i) => (
                  <Hashtag key={i}>{hashtag}</Hashtag>
                ))
              }
            </div>
          )
        }
        {
          unfinishedTodos.length > 0 && (
            <Notification onClick={() => this.addFilter('unfinished-todo')} />
          )
        }
        <div ref="thoughts" className="thoughts">
          {
            filteredThoughts.map((thought, i) => {
              return (
                <Thought
                  key={i}
                  onClick={() => this.setEditable(thought)}
                  onChange={(newValue) => this.updateThought(thought, newValue)}
                  onSubmit={() => this.stopEditing(thought)}
                  onHashtagClicked={this.addFilter}
                  editable={this.state.editableThought === thought}
                  ref={`thought-${thought.id}`}
                  thought={thought} />

              )
            })
          }
        </div>
      </div>
    );
  }
});
