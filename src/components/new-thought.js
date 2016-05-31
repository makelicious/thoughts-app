import React from 'react';

import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import ReactMarkdown from 'react-markdown';
import walker from '../utils/walker';
import TextInput from './text-input';

export default React.createClass({
  getInitialState() {
    return {
      currentValue: ''
    };
  },
  componentDidMount() {
    if(this.props.editable){
      document.addEventListener('keydown', this.focusToInput);
    }
  },
  componentWillUnmount() {
    if(this.props.editable){
      document.removeEventListener('keydown', this.focusToInput);
    }
  },
  focusToInput(event) {
    if(event.target !== this.refs.editor) {
      findDOMNode(this.refs.editor).focus();
      this.setState({
        focused: true
      });
    }
  },
  setValue(event) {
    this.setState({ currentValue: event.target.value });
  },
  submit() {
    if(this.state.currentValue.length === 0) {
      return;
    }
    this.props.onSubmit(this.state.currentValue);
    this.setState({ currentValue: '' });
  },
  render() {
    const className = classNames('new-thought', 'new-thought--editable', this.props.className, {
      'new-thought--modified': this.state.currentValue.length > 0,
      'new-thought--untouched': this.state.currentValue.length === 0
    });

    return (
      <div className={className}>
        <TextInput
          ref="editor"
          onChange={this.setValue}
          value={this.state.currentValue}
          onSubmit={this.submit} />
      </div>
    )
  }
});
