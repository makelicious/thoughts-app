import React from 'react';
import classNames from 'classnames';

import Hashtag from 'components/hashtag';


export default function FilterBar(props) {

  const className = classNames('filter-bar', {
    'filter-bar--visible': props.hashtags.length > 0
  });

  return (
    <div className={className}>
      <span onClick={props.onReset} className="filter-bar__close"></span>
      {
        props.hashtags.map((hashtag, i) => (
          <Hashtag className="filter-bar__hashtag" onClick={() => props.onRemoveTag(hashtag)} key={i}>
            {hashtag}
          </Hashtag>
        ))
      }
    </div>
  )
}
