import React from 'react';
import { findDOMNode } from 'react-dom';
import { debounce } from 'lodash';
/*
 * This is the component that handles thought scaling by window position
 */

export default React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    this.debouncedScale = debounce(this.calculateScales, 100, {maxWait: 400});
    window.addEventListener('scroll', this.debouncedScale, true);

    // Also initializes the initial calculation
    this.scrollToBottom();

    window.onunload = () =>
      this.refs['scroll-area'].scrollTop = 0;
  },
  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedScale);
  },
  componentDidUpdate(prevProps) {
    if(prevProps.children.length < this.props.children.length) {
      this.scrollToBottom();
    }
  },
  scrollToBottom() {
    this.refs['scroll-area'].scrollTop = this.refs['scroll-area'].scrollHeight;
  },
  calculateScales() {
    const scales = this.props.children.reduce((scales, child) => {
      scales[child.key] = this.getScale(findDOMNode(this[`elements-${child.key}`]));
      return scales;
    }, {});

    this.setState(scales);
  },
  getScale(node) {
    const bounds = node.getBoundingClientRect();
    const windowMiddlepoint = window.innerHeight / 2;
    const scrollArea = this.refs['scroll-area'];
    const scrollAreaBounds = scrollArea.getBoundingClientRect();

    // Completely outside viewport
    if(bounds.bottom < 0 || bounds.top > window.innerHeight) {
      return 0;
    }

    const shouldScale = scrollArea.scrollHeight > window.innerHeight * 2;

    const height = bounds.bottom - bounds.top;
    const middlePoint = bounds.top + height / 2;

    const scrollTop = scrollArea.scrollTop;
    const scrollBottom = scrollArea.scrollTop + window.innerHeight;


    const currentBottomScrollPercentage = scrollBottom / scrollArea.scrollHeight;
    const currentTopScrollPercentage = 1 - scrollTop / scrollArea.scrollHeight;

    const bottomThreshold = 0.9;
    const topThreshold = 0.9;

    // Position in the viewport where thought is most visible
    let targetPosition = shouldScale ? windowMiddlepoint : scrollAreaBounds.bottom;

    // Distance from target as percentage on a scale from 1 (directly at target) - 0 (far away)
    let percentageFromTarget = Math.max(0, 1 - Math.abs(middlePoint / targetPosition - 1));

    // Somewhere near window bottom
    if(shouldScale && currentBottomScrollPercentage > bottomThreshold) {
      const untilBottomPercentage = ((currentBottomScrollPercentage - bottomThreshold) / (1 - bottomThreshold));
      targetPosition = windowMiddlepoint + untilBottomPercentage * windowMiddlepoint;
      percentageFromTarget = Math.max(0, 1 - Math.abs(middlePoint / targetPosition - 1));
    }

    // Somewhere near window top
    if(shouldScale && currentTopScrollPercentage > topThreshold) {
      const untilTopPercentage = ((currentTopScrollPercentage - topThreshold) / (1 - topThreshold));
      targetPosition = Math.max(1, windowMiddlepoint - untilTopPercentage * windowMiddlepoint);
      percentageFromTarget = Math.max(0, 1 - Math.abs((targetPosition - middlePoint) / (window.innerHeight)));
    }

    const middlePointThreshold = 0.8;
    const roundedPercentage = percentageFromTarget > middlePointThreshold ? 1 : percentageFromTarget;

    return roundedPercentage;
  },
  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedScale);
  },
  render() {
    const children = this.props.children.map((child) => {
      const scale = this.state[child.key];

      const style = scale === undefined ? {} : {
        transform: `scale(${(0.3 + 0.7 * scale)}, ${(0.3 + 0.7 * scale)})`,
        opacity: (0.1 + 0.9 * scale)
      };

      return React.cloneElement(child, {
        ...child.props,
        style,
        ref: (el) => {
          this[`elements-${child.key}`] = el;
        },
      })
    });

    return (
      <div className={this.props.className} ref="scroll-area">
        {children}
      </div>
    );
  }
})
