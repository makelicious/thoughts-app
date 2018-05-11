import React from 'react';
import { connect } from 'react-redux';

import { setSearchTerm, clearSearch } from 'concepts/thoughts/actions';

export const Search = React.createClass({
  emptySearch() {
    this.props.dispatch(clearSearch());
  },
  render() {
    const updateSearchTerm = event => {
      event.stopPropagation();
      this.props.dispatch(setSearchTerm(event.target.value));
    };

    return (
      <div className="search">
        {this.props.searchTerm.length > 0 ? (
          <div className="search__empty" onClick={this.emptySearch} />
        ) : null}
        <input
          className="search__input"
          value={this.props.searchTerm}
          placeholder="Search"
          onChange={updateSearchTerm}
        />
      </div>
    );
  },
});

function storeToProps(store) {
  return {
    searchTerm: store.editor.searchTerm,
  };
}

export default connect(storeToProps)(Search);
