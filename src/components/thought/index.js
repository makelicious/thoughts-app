import React from 'react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import walker from 'utils/walker';
import TextInput from 'components/text-input';
import Checkbox from './components/checkbox';

import {
  CHECKBOX_REGEXP,
  parseHashtags,
  parseTodos
} from 'utils/thought';

import { replaceNth, breakText } from 'utils/text';

export const ThoughtContent = React.createClass({
  shouldComponentUpdate(newProps) {
    return newProps.expanded !== this.props.expanded ||
      newProps.thought !== this.props.thought;
  },
  render() {
    /*
     * Renderers for our custom markdown components
     */

    const customRenderers = {
      Link: (markdownProps) => {
        return (
          <a href={markdownProps.href} target="_blank">
            {markdownProps.children}
          </a>
        )
      },
      Checkbox: (markdownProps) => {
        return (
          <Checkbox
            onClick={this.props.onCheckboxClick}
            index={markdownProps.literal.index}
            checked={markdownProps.literal.checked} />
        );
      },

      Hashtag: (markdownProps) => {
        const hashtag = markdownProps.literal.hashtag;

        const addHashtagFilter = (event, hashtag) => {
          event.stopPropagation();
          event.preventDefault();

          this.props.onHashtagClick(hashtag);
        }

        return (
          <a onClick={(event) => addHashtagFilter(event, hashtag)} title={hashtag} href="#">
            {hashtag}
          </a>
        )
      }
    };
    return (
      <ReactMarkdown
        softBreak="br"
        source={this.props.expanded ? this.props.thought.text : breakText(this.props.thought.text)}
        allowedTypes={ReactMarkdown.types.concat(['Checkbox', 'Hashtag'])}
        renderers={customRenderers}
        walker={walker} />
    )

  }
})


function updateText(thought, newText) {
  return {
    ...thought,
    text: newText,
    hashtags: parseHashtags(newText),
    todos: parseTodos(newText)
  };
}

export default React.createClass({
  focus() {
    this.refs.input.focus();
  },
  componentDidUpdate(prevProps) {
    if(!prevProps.editable && this.props.editable) {
      this.focus();
    }
  },
  emitUpdatedText(newText) {
    this.props.onChange(updateText(this.props.thought, newText));
  },
  updateCheckbox(index, currentlyChecked) {
    const newText = replaceNth(
      this.props.thought.text,
      index,
      CHECKBOX_REGEXP,
      currentlyChecked ? '[]' : '[x]'
    );

    const updatedThought = updateText(this.props.thought, newText);

    this.props.onChange(updatedThought);
    this.props.onSubmit(updatedThought);
  },

  expandThought() {
    this.setState({
      expanded: true
    });
  },
  minimizeThought() {
    this.setState({
      expanded: false
    });
  },

  getInitialState() {
    return {
      expanded: false
    };
  },
  render() {


    const createdAt = moment(this.props.thought.createdAt).format('MMMM Do YYYY, h:mm:ss a');

    const className = classNames('thought', this.props.className, {
      'thought--editable': this.props.editable,
      'thought--expanded': this.state.expanded
    });

    return (
      <div ref="container" className="thought-container">
        <div style={this.props.style} onDoubleClick={this.props.onDoubleClick} className={className} onMouseEnter={this.expandThought} onMouseLeave={this.minimizeThought}>
          {
            this.props.editable ? (
              <TextInput
                ref={'input'}
                onChange={this.emitUpdatedText}
                onCancel={this.props.onCancel}
                onDelete={this.props.onDelete}
                value={this.props.thought.text}
                onSubmit={() => this.props.onSubmit(this.props.thought)} />
            ) : (
              <ThoughtContent
                onHashtagClick={this.props.onHashtagClick}
                onCheckboxClick={this.updateCheckbox}
                expanded={this.state.expanded}
                thought={this.props.thought} />
            )
          }
            <div className="thought-createdAt">{createdAt}</div>
        </div>
      </div>
    )
  }
});
