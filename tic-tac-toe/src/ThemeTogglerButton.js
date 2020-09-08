import React from 'react';
import { ThemeContext, themes } from './theme-context';

function ThemeTogglerButton() {
  console.log('ThemeTogglerButton Rendered');

  return(
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background, color: theme.foreground}}>
          {theme === themes.dark ? 'Dark Theme' : 'Light Theme'}
        </button>
      )}
    </ThemeContext.Consumer>
  )
}
export default ThemeTogglerButton;