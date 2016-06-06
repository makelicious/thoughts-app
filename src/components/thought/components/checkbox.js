import React from 'react';

export default function Checkbox(props) {

  const onChange = (event) => {
    event.stopPropagation();
    props.onCheckboxClick(
      props.index,
      props.checked
    )
  }

  return (
    <input
      onClick={onChange}
      readOnly
      type="checkbox"
      checked={props.checked} />
  );
}
