import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { findDOMNode } from 'react-dom';

import {
  isEnter,
  isBackspace,
  isEsc,
} from 'utils/keys';

export default React.createClass({
  getInitialState() {
    return { value: this.props.value };
  },
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value || nextState.value !== this.state.value;
  },
  focus() {
    const $el = findDOMNode(this.refs.editor);
    const length = this.state.value.length;

    // Focus textarea
    $el.focus();

    setTimeout(() => {
      // Set cursor to the end of text
      $el.setSelectionRange(length, length);
    });
  },
  componentWillReceiveProps(newProps) {

    // const currentText = newProps.value;
    // const prevText = this.props.value;
    //
    // if(newProps.suggestion && currentText.length > prevText.length) {
    //
    //   this.setState({
    //     value: newProps.suggestion
    //   }, () => {
    //     const $el = findDOMNode(this.refs.editor);
    //     $el.setSelectionRange(currentText.length, newProps.suggestion.length);
    //   });
    //
    //   return;
    // }
    //
    // if(newProps.value !== this.state.value) {
    //   this.setState({ value: newProps.value });
    // }

  },
  checkSpecialKeys(event) {
    if(isEnter(event.keyCode) && !event.shiftKey) {
      event.preventDefault();
      this.props.onSubmit();
      return;
    }

    if(isBackspace(event.keyCode) && this.props.value === '') {
      event.preventDefault();
      this.props.onDelete();
      return;
    }

    if(isEsc(event.keyCode)) {
      this.props.onCancel();
      return;
    }
  },
  updateValue(event) {
    const value = event.target.value;
    this.setState({ value });
    this.props.onChange(value);
  },
  render() {
    return (
      <Textarea
        className="text-input"
        ref="editor"
        onChange={this.updateValue}
        value={this.state.value}
        placeholder="What are you thinking?"
        onKeyDown={this.checkSpecialKeys}></Textarea>
    );
  }
})
