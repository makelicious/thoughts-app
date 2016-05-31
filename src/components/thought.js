import React from 'react';

import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

import ReactMarkdown from 'react-markdown';
import walker from '../utils/walker';
import TextInput from './text-input';


export default React.createClass({
  focus() {
    const $el = findDOMNode(this.refs.input);
    const length = this.props.thought.text.length;

    // Focus textarea
    $el.focus();

    // Set cursor to the end of text
    $el.setSelectionRange(length, length);

  },
  render() {
    const customRenderers = {
      Checkbox: (props) =>
        <input readOnly type="checkbox" checked={props.literal.trim().toLowerCase() === 'x'} />,

      Hashtag: (props) => {

        const hashtag = props.literal.hashtag;

        const addHashtagFilter = (event, hashtag) => {
          event.stopPropagation();
          event.preventDefault();

          this.props.onHashtagClicked(hashtag);
        }

        return (
          <a onClick={(event) => addHashtagFilter(event, hashtag)} title={hashtag} href="#">
            {hashtag}
          </a>
        )
      }
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
                allowedTypes={ReactMarkdown.types.concat(['Checkbox', 'Hashtag'])}
                renderers={customRenderers}
                walker={walker} />
            )
          }
        </div>
      </div>
    )
  }
});
