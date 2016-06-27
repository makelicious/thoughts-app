import React from 'react';

import bell from './bell.svg';

export default function Notification(props) {
  return (
    <div onClick={props.onClick} className="notification">
      <img alt="notification" src={bell} />
    </div>
  );
}
