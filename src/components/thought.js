import React from 'react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import walker from 'utils/walker';
import TextInput from 'components/text-input';

import {
  CHECKBOX_REGEXP,
  parseHashtags,
  parseTodos
} from 'utils/thought';

import { replaceNth } from 'utils/text';

export default React.createClass({
  focus() {
    this.refs.input.focus();
  },
  updateText(newText) {
    this.props.onChange({
      ...this.props.thought,
      text: newText,
      hashtags: parseHashtags(newText),
      todos: parseTodos(newText)
    })
  },
  updateCheckbox(index, currentlyChecked) {
    const newText = replaceNth(
      this.props.thought.text,
      index,
      CHECKBOX_REGEXP,
      currentlyChecked ? '[]' : '[x]'
    );

    this.updateText(newText);
  },
  render() {

    /*
     * Renderers for our custom markdown components
     */

    const customRenderers = {
      Checkbox: (props) => {

        const onChange = (event) => {
          event.stopPropagation();
          this.updateCheckbox(
            props.literal.index,
            props.literal.checked
          )
        }

        return (
          <input
            onClick={onChange}
            readOnly
            type="checkbox"
            checked={props.literal.checked} />
        );
      },

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
                onChange={this.updateText}
                onCancel={this.props.onCancel}
                onDelete={this.props.onDelete}
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
