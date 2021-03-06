/*
 * This is the component that handles thought scaling by window position
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import { debounce } from 'lodash';
import bezier from 'bezier';

const MAX_THOUGHTS_SCALED = 20;

export default React.createClass({
  getInitialState() {
    return {
      scales: {},
      target: window.innerHeight / 2,
    };
  },
  componentDidMount() {
    this.debouncedScale = debounce(this.calculateScales, 5, { maxWait: 10 });
    window.addEventListener('scroll', this.debouncedScale, true);

    this.debouncedScale();
  },
  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedScale, true);
  },
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.calculateScales();
    }
  },
  scrollToTop() {
    findDOMNode(this.refs['scroll-area']).scrollTop = 0;
  },
  getContainerDistanceFromTop() {
    const bodyBounds = document.body.getBoundingClientRect();
    const container = findDOMNode(this.refs['scroll-area']);
    const containerBounds = container.getBoundingClientRect();

    return containerBounds.top - bodyBounds.top;
  },
  getScrollPercentage() {
    const doc = document.documentElement;
    const scrollFromTop =
      (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (scrollFromTop === 0) {
      return 0;
    }

    return scrollFromTop / (document.body.scrollHeight - window.innerHeight);
  },
  calculateScales() {
    const target = this.calculateTargetPosition();

    const childrenToScale = this.props.children.slice(0, MAX_THOUGHTS_SCALED);

    const scales = childrenToScale.reduce((currentScales, child) => {
      const $el = findDOMNode(this[`elements-${child.key}`]);

      // eslint-disable-next-line no-param-reassign
      currentScales[child.key] = this.getScale($el, target);
      return currentScales;
    }, {});

    this.setState({ scales, target });
  },
  calculateTargetPosition() {
    const scrollArea = findDOMNode(this.refs['scroll-area']);

    const points = [0, 0.495, 0.5, 0.505, 1];

    const distanceFromTop = this.getContainerDistanceFromTop();

    // Scroll bar not visible
    if (scrollArea.scrollHeight === scrollArea.clientHeight) {
      return distanceFromTop;
    }

    const scrollPercentage = this.getScrollPercentage();

    const curvedPercentage = bezier(points, scrollPercentage);

    const position = Math.min(
      window.innerHeight,
      Math.max(distanceFromTop, curvedPercentage * window.innerHeight),
    );

    return this.props.allVisible
      ? position
      : Math.min(window.innerHeight / 2, position);
  },
  getScale(node, target) {
    const bounds = node.getBoundingClientRect();

    let shortestDistance = Math.min(
      Math.abs(bounds.bottom - target),
      Math.abs(bounds.top - target),
    );

    // Target is inside the element
    if (target < bounds.bottom && target > bounds.top) {
      shortestDistance = 0;
    }

    // Completely outside viewport
    if (bounds.bottom < -400 || bounds.top > window.innerHeight + 400) {
      return 0;
    }

    return Math.max(0, 1 - shortestDistance / window.innerHeight);
  },
  render() {
    const children = this.props.children.map((child, i) => {
      if (i > MAX_THOUGHTS_SCALED) {
        return child;
      }

      const scale = this.state.scales[child.key];

      const style =
        scale === undefined
          ? undefined
          : {
            transform: `scale(${0.3 + 0.7 * scale}, ${0.3 + 0.7 * scale})`,
              opacity: 0.1 + 0.9 * scale,
          };

      return React.cloneElement(child, {
        ...child.props,
        style,
        ref: el => {
          this[`elements-${child.key}`] = el;
        },
      });
    });

    return (
      <div className={this.props.className} ref="scroll-area">
        {children}
      </div>
    );
  },
});
