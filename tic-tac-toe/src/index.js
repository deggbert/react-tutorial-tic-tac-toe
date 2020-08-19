import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      isAscending: true,
      stepNumber: 0,
      xIsNext: true,
      isDraw: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (caluculateWinner(squares, this.state.stepNumber).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  reverseSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = caluculateWinner(current.squares, this.state.stepNumber);
    const winner = winnerInfo.winner;
    const isDraw = winnerInfo.isDraw;

    let moves = history.map((step, move) => {
      const moveCol = (step.moveSquare % 3) + 1; 
      const moveRow = Math.floor(step.moveSquare / 3) + 1;
      const desc = move ?
        `Go to move #${move} (Col: ${moveCol}, Row: ${moveRow})` :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            className={move === this.state.stepNumber ? 'selected' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button><span className='bold'>{move === this.state.stepNumber ? ' <--' : ''}</span>
        </li>
      );
    });
    if (!this.state.isAscending) {
      moves.reverse()
    }

    let status1, status2;
    if (isDraw) {
      status1 = 'Draw: ';
      status2 = winner;
    } else if (winner) {
      status1 = 'Winner: '
      status2 = winner;
    } else {
      status1 = 'Next player: ';
      status2 = <span className='bold'>{this.state.xIsNext ? 'X' : 'O'}</span>
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winnerInfo.line}
          />
        </div>
        <div className="game-info">
          <div
            className={
              isDraw
                ? 'drawText'
              : winner
                ? 'winnerText'
              : ''
            }
          >
            {status1}{status2}
          </div>
          <div>Move Sort Order: <span className='bold'>{this.state.isAscending ? 'Ascending' : 'Descending'}</span></div>          
          Press to Sort in <button 
            onClick={() => this.reverseSortOrder()}
          >
            {this.state.isAscending ? 'Descending' : 'Ascending'}
          </button> Order
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function caluculateWinner(squares, stepNumber) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      } 
    }
  }

  if (stepNumber === 9) {
    return {
      winner: 'No Winner',
      line: null,
      isDraw: true,
    }
  }

  return {
    winner: null,
    line: null,
    isDraw: false,
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);