import React from 'react';

function FormattedDate(props) {
  return (
    <h2>
      It is {props.date.toLocaleTimeString()}.
    </h2>
  )
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
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
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return <FormattedDate date={this.state.date} />;
  }
}
export default Clock;
