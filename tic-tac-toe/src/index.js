import React from 'react';
import ReactDOM from 'react-dom';
import memoizeOne from 'memoize-one';

import './index.css';
import {ThemeContext, themes} from './theme-context';

import Board from './Board';
import Timer from './Timer';
import ClockPanel from './ClockPanel';


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
      history: [{
        squares: Array(9).fill(null),
        moveSquare: null,
      }],
      isAscending: true,
      stepNumber: 0,
      xIsNext: true,
      isTimerOn: false,
      startTime: null, 
    };
  }

  memoizeThemeProviderData = memoizeOne((theme, toggleTheme) => ({theme: theme, toggleTheme: toggleTheme}));

  toggleTheme = () => {
    this.setState(state => ({
      theme: 
        state.theme === themes.dark
          ? themes.light
        :themes.dark,
    }));
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const currentWinnerInfo = caluculateWinner(squares, this.state.stepNumber);
    let winner = currentWinnerInfo.winner;
    
    if (winner || squares[i]) {
      return;
    }

    if (this.state.stepNumber === 0) {
      this.setState({
        startTime: Date.now(),
        isTimerOn: true,
      });
    } else if ((this.state.stepNumber + 1) !== this.state.history.length) {
      this.setState({
        startTime: Date.now(),
        isTimerOn: true,
      });
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
    
    const newWinInfo = caluculateWinner(squares, this.state.stepNumber + 1);
    winner = newWinInfo.winner;
    let isDraw = newWinInfo.isDraw;

    if (winner || isDraw) {
      this.setState({
        isTimerOn: false,
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      isTimerOn: false,
    })
  }

  reverseSortOrder() {
    this.setState({
      isAscending: !this.state.isAscending,
    })
  }

  render() {
    console.log('Game Rendered'); //TODO: REMOVE
    
    const themeProviderData = this.memoizeThemeProviderData(this.state.theme, this.state.toggleTheme);

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = caluculateWinner(current.squares, this.state.stepNumber);
    const winner = winInfo.winner;
    const isDraw = winInfo.isDraw;

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
      status1 = 'DRAW: ';
      status2 = winner;
    } else if (winner) {
      status1 = 'WINNER: '
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
            winnerLine={winInfo.line}
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
        <div className='timer'>
          <Timer
            isTimerOn={this.state.isTimerOn}
            startTime={this.state.startTime}
            history={this.state.history}
            stepNumber={this.state.stepNumber}
            winner={winner}
            isDraw={isDraw}
          />
        </div>
        <ThemeContext.Provider value={themeProviderData}>
          <ClockPanel />
        </ThemeContext.Provider>
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

// Added Functionality



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);