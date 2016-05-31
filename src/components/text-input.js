import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default React.createClass({
  checkForSubmit(event) {
    if(event.keyCode === 13 && !event.shiftKey) {
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
