import React from 'react';
import { connect } from 'react-redux';
import { loadBackground } from 'concepts/background/actions';

const Background = React.createClass({
  componentDidMount() {
    this.props.dispatch(loadBackground());
  },
  render() {
    const style = this.props.background ? {
      backgroundImage: `url(${this.props.background})`
    } : null;

    return (
      <div className={this.props.className} onClick={this.props.onClick}>
        <div className="background" style={style} />
        {this.props.children}
      </div>
    );
  }
});

function stateToProps(state) {
  return {
    background: state.background.background
  };
}

export default connect(stateToProps)(Background);
