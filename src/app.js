import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import {
  getThoughts,
  saveThoughts
} from './utils/storage';

import Thought from './components/thought';

function createThought(text) {
  return {
    text,
    createdAt: new Date()
  }
}

export default React.createClass({
  getInitialState() {
    return {
      thoughts: getThoughts(),
      editableThought: null,
      currentText: ''
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
    this.refs.newestThought.focus();
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
  setEditable(thought) {
    this.setState({ editableThought: thought });
  },
  stopEditing() {
    this.setState({ editableThought: null });
    saveThoughts(this.state.thoughts);
  },
  updateThought(thought, newValue) {
    const updatedThoughts = this.state.thoughts.map((thoug) => {
      if(thoug !== thought) {
        return thoug;
      }
      thoug.text = newValue;
      return thoug;
    });

    this.setState({
      thoughts: updatedThoughts
    });

  },
  render() {
    const thoughts = this.state.thoughts;
    const visibleThoughts = thoughts;

    return (
      <div className="thoughts-container">
        <div ref="thoughts" className="thoughts">
          {
            visibleThoughts.map((thought, i) => {

              return (
                <Thought
                  key={i}
                  onClick={() => this.setEditable(thought)}
                  onChange={(newValue) => this.updateThought(thought, newValue)}
                  onSubmit={this.stopEditing}
                  editable={this.state.editableThought === thought}
                  ref={i === visibleThoughts.length - 1 ? 'newestThought' : `thought${i}`}
                  thought={thought} />

              )
            })
          }
        </div>
      </div>
    );
  }
});
