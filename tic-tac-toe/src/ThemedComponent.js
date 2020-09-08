import React from 'react';
import { ThemeContext } from './theme-context';

class ThemedComponent extends React.Component {
  static contextType = ThemeContext;

  render() {
    console.log('ThemedComponent Rendered'); //TODO: REMOVE

    let props = this.props;
    let theme = this.context.theme;
    return  (
      <div style={{backgroundColor: theme.background, color: theme.foreground}}>
        {props.children}
      </div> 
    );
  }
}
export default ThemedComponent;