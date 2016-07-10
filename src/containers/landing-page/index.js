import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import App from 'app';
import logo from './assets/logo.png';
import ChromeLogo from './assets/chrome.svg?name=ChromeLogo';

import {
  initDemo,
  goToBoard,
  addToChrome
} from 'concepts/intro/actions';

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
        <button onClick={props.onProceed} className="button landing-page__button">
          {'LET\'S GO'}
        </button>
        {
          props.showChromeButton && (
            <button onClick={props.onAddToChrome} className="button landing-page__chrome-button">
              <ChromeLogo className="landing-page__chrome-button__icon" />
              Add Ideahigh to Chrome
            </button>
          )
        }
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
  addToChrome() {
    this.props.dispatch(addToChrome());
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
            <DescriptionColumn
              showChromeButton={this.props.showChromeButton}
              onAddToChrome={this.addToChrome}
              onProceed={this.goToBoard} />
        }
      </ReactCSSTransitionGroup>

    );
  }
});

function stateToProps(state) {
  return {
    movedToBoard: state.intro.movedToBoard,
    showChromeButton: state.intro.canBeInstalledToCurrentBrowser
  };
}

export default connect(stateToProps)(LandingPage);
