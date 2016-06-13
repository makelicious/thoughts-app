import React from 'react';
import classNames from 'classnames';

import { getDailyBackground } from 'utils/background';

export default React.createClass({
  getInitialState() {
    return {
      background: null
    };
  },
  componentDidMount() {

    getDailyBackground('earthporn').then((image) => {
      this.setState({
        background: {
          image
        }
      });
    });
  },
  render() {
    const props = this.props;

    const style = this.state.background ? {
      backgroundImage: `url(${this.state.background.image})`,
      opacity: 1
    } : {};

    return (
      <div {...props}>
        <div className="background" style={style} />
        {props.children}
      </div>
    );
  }
});
