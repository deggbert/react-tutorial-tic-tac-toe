import React, {Suspense} from 'react';
import TestErrorBoundary from './TestErrorBoundary';
import ThemedComponent from './ThemedComponent';
import { ThemeContext, themes } from './theme-context';

const Clock = React.lazy(() => {
  return Promise.all([
    import('./Clock'),
    // Set artificial load delay to test suspense
    new Promise(resolve => setTimeout(resolve, 3000)) 
  ])
  .then(([moduleExports]) => moduleExports);
});

const BuggyClock = React.lazy(() => import('./BuggyClock'));

function ClockPanel() {
  return (
    <ThemeContext.Consumer>
      {({theme, toggleFn}) => (
        <div className='clocks'>
          <h1>Clocks</h1>
          <hr />
          <h2>Suspense Clock</h2>
          <ThemedComponent>
            <TestErrorBoundary>
              <Suspense fallback={<h2>Loading...</h2>}>
                  <Clock />
              </Suspense>
            </TestErrorBoundary> 
          </ThemedComponent>
          <hr />
          <h2>Error Boundary Clock</h2>
          <ThemedComponent>
            <TestErrorBoundary>  
              <Suspense fallback={<h2>Loading...</h2>}>
                <BuggyClock />
              </Suspense>
            </TestErrorBoundary>
          </ThemedComponent>
          <button  onClick={toggleFn}>
            {theme === themes.dark ? 'Dark Theme' : 'Light Theme'}
          </button>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}

export default ClockPanel;