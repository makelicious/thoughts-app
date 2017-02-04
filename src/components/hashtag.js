import React from 'react';
import classNames from 'classnames';

export default function Hashtag(props) {
  const className = classNames('hashtag', props.className);

  return (
    <span onClick={props.onClick} className={className}>
      {props.children}
    </span>
  );
}
