import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import App from 'app';
import logo from './assets/logo.png';
import { initDemo, goToBoard } from 'concepts/intro/actions';

function DescriptionColumn(props) {
  return (
    <div className="landing-page__column">
      <div className="landing-page__description__container">

        <img src={logo} className="landing-page__logo" alt="ideahigh" />
        <p className="landing-page__description">
          Do you ever feel distracted?<br />
          Sometimes {'it\'s'} because of the sheer workload you have to manage at school or work.
          Forgetting awesome ideas or missing deadlines is stressful. <br /> <br />

          Ideahigh provides you a way to create and organize your thoughts in a brand new manner.

        </p>
        <button onClick={props.onProceed} className="button landing-page__button">
          {'LET\'S GO'}
        </button>
        <div className="landing-page__footer">
          <a
            onClick={props.onPrivacyPolicy}
            className="landing-page__footer__link"
            href="#">Privacy policy
          </a>
        </div>
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
  showPrivacyPolicy() {
    this.setState({ privacyPolicyVisible: true });
  },
  hidePrivacyPolicy() {
    this.setState({ privacyPolicyVisible: false });
  },
  getInitialState() {
    return {
      privacyPolicyVisible: false
    };
  },
  render() {

    return (
      <div className="landing-page__wrapper">
      {
        this.state.privacyPolicyVisible ? (
          <div className="modal">
            <span
              className="ebinraksi"
              onClick={this.hidePrivacyPolicy}
            >X</span>
            spurdoSpärde
          </div>
        ) : null
      }
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
                onProceed={this.goToBoard}
                onPrivacyPolicy={this.showPrivacyPolicy} />
          }
        </ReactCSSTransitionGroup>
      </div>

    );
  }
});

function stateToProps(state) {
  return {
    movedToBoard: state.intro.movedToBoard
  };
}

export default connect(stateToProps)(LandingPage);
