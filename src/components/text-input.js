import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { findDOMNode } from 'react-dom';

import {
  isEnter,
  isBackspace,
  isEsc,
} from 'utils/keys';

export default React.createClass({
  focus() {
    const $el = findDOMNode(this.refs.editor);
    const length = this.props.value.length;

    // Focus textarea
    $el.focus();

    // Set cursor to the end of text
    $el.setSelectionRange(length, length);
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
  render() {
    return (
      <Textarea
        className="text-input"
        ref="editor"
        onChange={(event) => this.props.onChange(event.target.value)}
        value={this.props.value}
        placeholder="What are you thinking?"
        onKeyDown={this.checkSpecialKeys}></Textarea>
    );
  }
})
