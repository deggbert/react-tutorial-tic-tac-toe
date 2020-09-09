import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameLength: null,
      lastMove: 0,
      timeAddedFromReverts: 0,
    }
  }
  
  componentDidUpdate(prevProps) { 
    console.log('Timer - ComponentDidUpdate'); //TODO: REMOVE

    if (this.props.isTimerOn && this.props.isTimerOn !== prevProps.isTimerOn) {
      this.startTimer();
    } else if (!this.props.isTimerOn && this.props.isTimerOn !== prevProps.isTimerOn) {
      this.stopTimer();
    }
  }
  

  startTimer() {
    this.calcGameLength();
    this.intervalId = setInterval(
      () => this.tick(), 
      1000
    )
  }
  
  tick() {
    this.calcGameLength();
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  calcGameLength() {
    const startTime = this.props.startTime;
    const currentTime = Date.now();
    let gameLength;
    if (this.props.stepNumber < this.state.lastMove) {
      gameLength = this.state.gameLength + Math.round((currentTime - startTime) / 1000);
      this.setState({
        gameLength: gameLength,
        lastMove: this.props.stepNumber,
        timeAddedFromReverts: this.state.gameLength,
      });
    } else {
      gameLength = Math.round((currentTime - startTime) / 1000) + this.state.timeAddedFromReverts;
      this.setState({
        gameLength: gameLength,
        lastMove: this.props.stepNumber,
      });
    }
  }

  render() {
    console.log('Timer Rendered'); //TODO: REMOVE
    const gameLength = this.state.gameLength;

    return (
      <>
        <div className='bold'>Game Timer:</div>
        <div>
          { 
            gameLength === null
              ? 'Game has not yet started. Click a square to begin.'
            :this.props.winner || this.props.isDraw
              ? `This game took ${gameLength} seconds.`
            : `This game has been running for ${gameLength} seconds.`
          }
        </div>
      </>
    )
  }
}
export default Timer;
