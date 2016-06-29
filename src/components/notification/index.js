import React from 'react';

import Bell from './bell.svg';

export default function Notification(props) {
  return (
    <div onClick={props.onClick} className="notification">
      <Bell />
    </div>
  );
}
