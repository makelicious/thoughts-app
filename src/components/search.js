import React from 'react';
import { connect } from 'react-redux';

import { setSearchTerm } from 'thoughts/actions';


export const Search = React.createClass({
  render() {
    const updateSearchTerm = (event) => {
      event.stopPropagation();
      this.props.dispatch(setSearchTerm(event.target.value));
    };
    return (
      <div className="search">
        <span className="search__button">{'\uD83D\uDD0D'}</span>
        <input
          value={this.props.searchTerm}
          className="search__input"
          placeholder="Search"
          onChange={updateSearchTerm}
          />
      </div>
    );
  }
});

function storeToProps(store) {
  return {
    searchTerm: store.editor.searchTerm
  };
}

export default connect(storeToProps)(Search);
