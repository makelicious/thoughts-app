import React from 'react';

import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import ReactMarkdown from 'react-markdown';
import walker from '../utils/walker';
import TextInput from './text-input';

export default React.createClass({
  focus() {
    findDOMNode(this.refs.input).focus();
  },
  render() {
    const customRenderers = {
      Checkbox: (props) =>
        <input readOnly type="checkbox" checked={props.literal.trim().toLowerCase() === 'x'} />
    };

    const className = classNames('thought', this.props.className, {
      'thought--editable': this.props.editable
    });

    return (
      <div className="thought-container">
        <div onClick={this.props.onClick} className={className}>
          {
            this.props.editable ? (
              <TextInput
                ref={'input'}
                onChange={this.props.onChange}
                value={this.props.thought.text}
                onSubmit={this.props.onSubmit} />
            ) : (
              <ReactMarkdown
                softBreak="br"
                source={this.props.thought.text}
                allowedTypes={ReactMarkdown.types.concat('Checkbox')}
                renderers={customRenderers}
                walker={walker} />
            )
          }
        </div>
      </div>
    )
  }
});
