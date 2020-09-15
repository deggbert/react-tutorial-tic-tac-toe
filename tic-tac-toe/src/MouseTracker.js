import React, { useRef } from 'react';

function Ball(props) {
  const ball = useRef(null);
  const parentRef = props.parentRef.current;
  const mousePosition = props.mousePosition;

  let ballLeft, ballTop;
  if (!ball.current) {
    ballLeft = 0;
    ballTop = 0;
  } else {
    ballLeft = mousePosition.x - ball.current.offsetWidth/2;
    ballTop = mousePosition.y - ball.current.offsetWidth/2;

    if (ballLeft < 0) ballLeft = 0;
    if (ballTop < 0) ballTop = 0;
    if (ballLeft + ball.current.offsetWidth > parentRef.clientWidth) ballLeft = parentRef.clientWidth - ball.current.offsetWidth; 
    if (ballTop + ball.current.offsetHeight > parentRef.clientHeight) ballTop = parentRef.clientHeight - ball.current.offsetHeight; 
  }


  return (
    <img src="https://en.js.cx/clipart/ball.svg" alt="Soccer Ball" className="ball" ref={ball} style={{ left: ballLeft, top: ballTop }} />
  );

}

class MousePosition extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      x: 0,
      y: 0,
    }
  }

  handleMouseMove = (event) => {
    const rect = this.ref.current.getBoundingClientRect();
    this.setState({
      x: event.clientX - rect.left - this.ref.current.clientLeft,
      y: event.clientY - rect.top - this.ref.current.clientTop,
    });
  }

  render() {
    return (
      // <div className="ballContainer" >
      <div className="ballContainer" ref={this.ref} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state, this.ref)}
      </div>
    );
  }
}

function MouseTracker() {
  return (
    <div className="mouseTracker">
      <h3> Move the mouse around.</h3>
      <MousePosition render={(mousePosition, ref) => (
        <Ball mousePosition={mousePosition} parentRef={ref} />
      )}/>
    </div>
  );
}
export default MouseTracker;
