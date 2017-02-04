import React from 'react';
import Hashtag from 'components/hashtag';

export default function HashtagList(props) {
  console.log(props);
  console.log(props.hashtags);
  return (
    <div className="hashtags">
      <ul
        className="hashtags__list">
        {props.hashtags.map(hashtag =>
        <li
          key={hashtag}
          className="hashtags__list__item"
          onClick={() => props.onAddTag(hashtag)}>
          {hashtag}
        </li>
      )}
      </ul>
    </div>
  )
}
