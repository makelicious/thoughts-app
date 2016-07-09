import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import App from 'app';
import logo from './assets/logo.png';
import { initDemo, goToBoard } from 'intro/actions';

function DescriptionColumn(props) {
  return (
    <div className="landing-page__column">
      <div className="landing-page__description__container">

        <img src={logo} className="landing-page__logo" alt="ideahigh" />
        <p className="landing-page__description">
          Do you often feel distracted?<br />
          Sometimes its because of the sheer workload you have to manage at school or work.
          Forgetting important meetings or deadlines is stressful.
          <br /><br />
          Ideahigh provides you a way to create and organize your thoughts in a brand new manner.
        </p>
        <button onClick={props.onProceed} className="landing-page__button">
          LETS GO
        </button>

      </div>
    </div>
  );
}

const LandingPage = React.createClass({
  componentDidMount() {
    this.props.dispatch(initDemo());
  },
  goToBoard() {
    this.props.dispatch(goToBoard());
  },
  render() {

    return (
      <ReactCSSTransitionGroup
        component="div"
        className="landing-page"
        transitionName="landing-page"
        transitionEnterTimeout={700}
        transitionLeaveTimeout={700}>
        <div className="landing-page__column">
          <App />
        </div>
        {
          !this.props.movedToBoard &&
            <DescriptionColumn onProceed={this.goToBoard} />
        }
      </ReactCSSTransitionGroup>

    );
  }
});

function stateToProps(state) {
  return {
    movedToBoard: state.intro.movedToBoard
  };
}

export default connect(stateToProps)(LandingPage);
