import React from 'react';
import classNames from 'classnames';
import Hashtag from 'components/hashtag';

import { getAssociatedHashtags } from 'utils/thought';

export default function FilterBar(props) {
  const thoughts = props.thoughts;

  const associatedHashtags =
    props.hashtags.length === 0
      ? []
      : getAssociatedHashtags(props.hashtags, thoughts)
          // Associated is not one of the selected hashtag filters
          .filter(hashtag => props.hashtags.indexOf(hashtag) === -1);

  const className = classNames('filter-bar', {
    'filter-bar--visible': props.hashtags.length > 0,
  });

  return (
    <div className={className}>
      <div>
        <span onClick={props.onReset} className="filter-bar__close" />
        {props.hashtags.map((hashtag, i) => (
          <span key={i}>
            <Hashtag
              className="filter-bar__hashtag"
              onClick={() => props.onRemoveTag(hashtag)}
            >
              {hashtag}
            </Hashtag>&nbsp;
          </span>
        ))}
      </div>
      {associatedHashtags.length > 0 && (
        <div className="filter-bar__associated-hashtags">
          <div className="filter-bar__associated-hashtags__title">
            Related categories
          </div>
          <div>
            {associatedHashtags.map((hashtag, i) => (
              <span key={i}>
                <Hashtag
                  className="filter-bar__associated-hashtags__hashtag"
                  onClick={() => props.onAddTag(hashtag)}
                >
                  {hashtag}
                </Hashtag>&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
