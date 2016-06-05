/*
 * This is the component that handles thought scaling by window position
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import { debounce } from 'lodash';
import bezier from 'bezier';

export default React.createClass({
  getInitialState() {
    return {
      scales: {},
      target: window.innerHeight / 2
    };
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
    const target = this.calculateTargetPosition();
    const scales = this.props.children.reduce((scales, child) => {
      scales[child.key] = this.getScale(findDOMNode(this[`elements-${child.key}`]));
      return scales;
    }, {});

    this.setState({scales, target});
  },
  calculateTargetPosition() {
    const scrollArea = this.refs['scroll-area'];
    const style = window.getComputedStyle(scrollArea);
    const topPadding = parseInt(style.getPropertyValue('padding-top'), 10);
    const bottomPadding = parseInt(style.getPropertyValue('padding-bottom'), 10);

    const points = [0, 0.495, 0.50, 0.505, 1];

    if(scrollArea.scrollHeight === scrollArea.clientHeight) {
      return window.innerHeight / 2;
    }

    const scrollPercentage = scrollArea.scrollTop / (scrollArea.scrollHeight - scrollArea.clientHeight);
    const curvedPercentage = bezier(points, scrollPercentage);

    return Math.min(
      window.innerHeight - bottomPadding,
      Math.max(topPadding, curvedPercentage * window.innerHeight)
    );
  },
  getScale(node) {
    const bounds = node.getBoundingClientRect();

    const shortestDistance = Math.min(
      Math.abs(bounds.bottom - this.state.target),
      Math.abs(bounds.top - this.state.target)
    );

    // Completely outside viewport
    if(bounds.bottom < 0 || bounds.top > window.innerHeight) {
      return 0;
    }

    return 1 - shortestDistance / window.innerHeight;
  },
  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedScale);
  },
  render() {

    // Can be rendered for debugging
    const targetLine =
      <div style={{
          position: 'fixed',
          width: '100%',
          height: '1px',
          background: 'red',
          zIndex: 2,
          top: `${this.state.target}px`
        }} />

    const children = this.props.children.map((child) => {
      const scale = this.state.scales[child.key];

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
