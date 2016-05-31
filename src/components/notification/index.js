import React from 'react';

import bell from './bell.svg';

export default function Notification(props) {
  return (
    <div onClick={props.onClick} className="notification">
      <img src={bell} />
    </div>
  );
}
