import React from 'react';

function Square(props) {
  const className = 'square' + (props.winnerSquare ? ' winnerSquare' : '');
  return (
    <button 
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const winnerLine = this.props.winnerLine;
    return (
      <Square 
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} 
        winnerSquare={winnerLine?.includes(i)}
      />
    );
  }

  render() {
    let squares = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
    return (
      <div>{squares}</div>
    );
  }
}
export default Board;