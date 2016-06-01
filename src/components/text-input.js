import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

import {
  isEnter
} from '../utils/keys';

export default React.createClass({
  checkForSubmit(event) {
    this.props.onKeyDown(event);
    if(isEnter(event.keyCode) && !event.shiftKey) {
      event.preventDefault();
      this.props.onSubmit();
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
        onKeyDown={this.checkForSubmit}></Textarea>
    );
  }
})
