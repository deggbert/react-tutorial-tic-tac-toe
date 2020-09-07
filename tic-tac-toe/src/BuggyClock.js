import React from 'react';

function FormattedDate(props) {
  return (
    <h2>
      It is {props.date.toLocaleTimeString()}.
    </h2>
  )
}

class BuggyClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      counter: 0,
    };
  }

  componentDidMount() {
    this.intervalId = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  tick() {
    this.setState(({counter}) => ({
      date: new Date(),
      counter: counter + 1,
    }));
  }

  render() {
    if (this.state.counter === 7) {
      throw new Error('Buggy Clock Broke!');
    }

    return (
      <FormattedDate
        date={this.state.date} 
      />
    );
  }
}

export default BuggyClock;
