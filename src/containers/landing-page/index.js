import React from 'react';
import { connect } from 'react-redux';

import App from 'app';
import logo from './assets/logo.png';
import { initDemo } from 'intro/actions';

const LandingPage = React.createClass({
  componentDidMount() {
    this.props.dispatch(initDemo());
  },
  render() {
    return (
      <div className="landing-page">
        <div className="landing-page__column">
          <App />
        </div>
        <div className="landing-page__column">
          <img src={logo} className="landing-page__logo" alt="ideahigh" />
          <p className="landing-page__description">
            Do you ever feel distracted?<br />
            Sometimes it's because of the sheer workload you have to manage at school or work. Forgetting important meetings or deadlines is stressful.
            <br /><br />
            Ideahigh provides you a way to create and organize your thoughts in a brand new manner.
          </p>
          <button className="landing-page__button">
            LET'S GO
          </button>
        </div>
      </div>
    );
  }
});

export default connect()(LandingPage);
