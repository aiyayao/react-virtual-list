import React from 'react';

class Item extends React.PureComponent {

  render() {
    return (
      <div className="item" style={{height: this.props.height}}>{this.props.value}</div>
    );
  }
}

export default Item;