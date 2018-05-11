import React from 'react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import walker from 'utils/walker';
import TextInput from 'components/text-input';
import Checkbox from './components/checkbox';

import Pen from './assets/pen.svg';
import Trash from './assets/trash.svg';

import {
  CHECKBOX_REGEXP,
  parseHashtags,
  parseTodos,
  parseImages,
} from 'utils/thought';

import { replaceNth, breakText } from 'utils/text';

const ALLOWED_MARKDOWN_TYPES = [
  'Text',
  'Paragraph',
  'Heading',
  'Softbreak',
  'Hardbreak',
  'Link',
  'Emph',
  'Code',
  'CodeBlock',
  'BlockQuote',
  'List',
  'Item',
  'Strong',
  'ThematicBreak',
  'Checkbox',
  'Hashtag',
];

export const ThoughtContent = React.createClass({
  shouldComponentUpdate(newProps) {
    return (
      newProps.expanded !== this.props.expanded ||
      newProps.thought !== this.props.thought
    );
  },
  render() {
    /*
     * Renderers for our custom markdown components
     */

    const customRenderers = {
      Link: markdownProps => (
        <a href={markdownProps.href} target="_blank">
          {markdownProps.children}
        </a>
      ),
      Checkbox: markdownProps => (
        <Checkbox
          onClick={this.props.onCheckboxClick}
          index={markdownProps.literal.index}
          checked={markdownProps.literal.checked}
        />
      ),

      Hashtag: markdownProps => {
        const hashtag = markdownProps.literal.hashtag;

        const addHashtagFilter = (event, hash) => {
          event.stopPropagation();
          event.preventDefault();

          this.props.onHashtagClick(hash);
        };

        return (
          <a
            onClick={event => addHashtagFilter(event, hashtag)}
            title={hashtag}
            href="#"
          >
            {hashtag}
          </a>
        );
      },
    };
    const images = parseImages(this.props.thought.text);

    const visibleContent = this.props.expanded
      ? this.props.thought.text
      : breakText(this.props.thought.text);

    return (
      <div>
        <ReactMarkdown
          softBreak="br"
          source={visibleContent}
          allowedTypes={ALLOWED_MARKDOWN_TYPES}
          renderers={customRenderers}
          walker={walker}
        />
        <div className="thought__attachments">
          {images.map((image, i) => (
            <a
              key={i}
              className="thought__image"
              target="_blank"
              href={image}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      </div>
    );
  },
});

function updateText(thought, newText) {
  return {
    ...thought,
    text: newText,
    hashtags: parseHashtags(newText),
    todos: parseTodos(newText),
  };
}

export default React.createClass({
  focus() {
    this.refs.input.focus();
  },
  componentDidUpdate(prevProps) {
    if (!prevProps.editable && this.props.editable) {
      this.focus();
    }
  },
  componentDidMount() {
    if (this.props.editable) {
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
      currentlyChecked ? '[]' : '[x]',
    );

    const updatedThought = updateText(this.props.thought, newText);

    this.props.onChange(updatedThought);
    this.props.onSubmit(updatedThought);
  },

  expandThought(e) {
    console.log(e);
    this.setState({
      expanded: true,
    });
  },
  minimizeThought() {
    this.setState({
      expanded: false,
    });
  },

  getInitialState() {
    return {
      expanded: false,
    };
  },
  render() {
    const createdAt = moment(this.props.thought.createdAt).format(
      'MMMM Do YYYY, h:mm a',
    );

    const className = classNames('thought__bubble', this.props.className, {
      'thought__bubble--editable': this.props.editable,
      'thought__bubble--expanded': this.state.expanded,
    });

    return (
      <div ref="container" className="thought">
        <div className="thought__wrapper">
          <div className="thought__tools">
            <div className="thought__tools__wrapper">
              <div
                onClick={this.props.onDoubleClick}
                className="thought__tools__tool"
              >
                <Pen className="thought__tool__icon" />
              </div>
              <div
                onClick={this.props.onDelete}
                className="thought__tools__tool"
              >
                <Trash className="thought__tool__icon" />
              </div>
            </div>
          </div>
          <div
            style={this.props.style}
            onDoubleClick={this.minimizeThought}
            className={className}
            onCLick
            onClick={this.expandThought}
          >
            {this.props.editable ? (
              <TextInput
                ref={'input'}
                onChange={this.emitUpdatedText}
                onCancel={this.props.onCancel}
                onDelete={this.props.onDelete}
                value={this.props.thought.text}
                onSubmit={() => this.props.onSubmit(this.props.thought)}
              />
            ) : (
              <ThoughtContent
                onHashtagClick={this.props.onHashtagClick}
                onCheckboxClick={this.updateCheckbox}
                expanded={this.state.expanded}
                thought={this.props.thought}
              />
            )}
            <div className="thought__info">
              <div className="thought__created-at">{createdAt}</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
