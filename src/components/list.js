import React from 'react';
import Item from './item';

import '../css/list.css';

const ROW_HEIGHT = 60;
const OVERSCAN_ROWS = 5;

class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleStartIndex: 0,
      visibleEndIndex: 0,
      overscanStartIndex: 0,
      overscanEndIndex: 0
    };
    this.list = Array.from(Array(1000)).map((item, index) => `item-${index}`);
  }

  componentDidMount() {
    let viewportHeight = this.viewport.offsetHeight;
    let visibleRowsCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    let visibleStartIndex = 0;
    let visibleEndIndex = visibleRowsCount;
    let overscanStartIndex = 0;
    let overscanEndIndex = visibleEndIndex + OVERSCAN_ROWS;
    this.setState({
      visibleStartIndex,
      visibleEndIndex,
      overscanStartIndex,
      overscanEndIndex
    });
  }

  onScroll = (evt) => {
    let scrollTop = evt.target.scrollTop;
    let viewportHeight = this.viewport.offsetHeight;
    let rowsCount = this.list.length;
    let { visibleStartIndex, visibleEndIndex } = this.getVisibleBoundaries(viewportHeight, scrollTop, rowsCount);
    let overscanStartIndex = this.getOverscanStartIdx(visibleStartIndex);
    let overscanEndIndex = this.getOverscanEndIdx(visibleEndIndex, rowsCount);
    this.setState({
      visibleStartIndex,
      visibleEndIndex,
      overscanStartIndex,
      overscanEndIndex
    });
  }

  getVisibleBoundaries = (viewportHeight, scrollTop, rowsCount) => {
    let renderedRowsCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    let visibleStartIndex = Math.max(0, Math.round(scrollTop / ROW_HEIGHT));
    let visibleEndIndex = Math.min(rowsCount, visibleStartIndex + renderedRowsCount);
    return { visibleStartIndex, visibleEndIndex }
  }

  getOverscanStartIdx = (visibleStartIndex) => {
    return Math.max(0, Math.floor(visibleStartIndex / 10) * 10 - OVERSCAN_ROWS);
  }

  getOverscanEndIdx = (visibleEndIndex, rowsCount) => {
    return Math.min(rowsCount, Math.ceil(visibleEndIndex / 10) * 10 + OVERSCAN_ROWS);
  }

  getRenderRows = () => {
    if (!this.list) return [];
    let { overscanStartIndex, overscanEndIndex } = this.state;
    let i = overscanStartIndex;
    let renderRows = [];
    while (i < overscanEndIndex) {
      renderRows.push(this.list[i]);
      i++;
    }
    return renderRows;
  }

  render() {
    let { overscanStartIndex, overscanEndIndex } = this.state;
    let renderRows = this.getRenderRows();
    let startOffset = overscanStartIndex * ROW_HEIGHT;
    let endOffset = (this.list.length - overscanEndIndex) * ROW_HEIGHT;
    return (
      <div className="list-wrapper">
        <div className="list-container">
          <div className="list" ref={ref => this.viewport = ref} onScroll={this.onScroll}>
            <div style={{paddingTop: startOffset, paddingBottom: endOffset}}>
              {renderRows.map((item, index) => (
                <Item key={`item-${index}`} height={ROW_HEIGHT} value={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;