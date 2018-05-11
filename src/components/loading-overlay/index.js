import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Brain from './assets/brain.svg';

export default function LoadingOverlay(props) {
  return (
    <ReactCSSTransitionGroup
      transitionName="loading-overlay"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={1000}
    >
      {props.visible && (
        <div className="loading-overlay">
          <div className="loading-overlay__brains">
            <Brain className="loading-overlay__brain" />
            <div className="loading-overlay__text">Gathering thoughts...</div>
          </div>
        </div>
      )}
    </ReactCSSTransitionGroup>
  );
}
