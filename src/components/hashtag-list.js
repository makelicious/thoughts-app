import React from 'react';

export default function HashtagList(props) {
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
  );
}
