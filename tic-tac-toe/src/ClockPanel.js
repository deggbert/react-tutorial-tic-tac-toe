import React, {Suspense} from 'react';
import TestErrorBoundary from './TestErrorBoundary';
import ThemedComponent from './ThemedComponent';
import ThemeTogglerButton from './ThemeTogglerButton';

const Clock = React.lazy(() => {
  return Promise.all([
    import('./Clock'),
    // Set artificial load delay to test suspense
    new Promise(resolve => setTimeout(resolve, 3000)) 
  ])
  .then(([moduleExports]) => moduleExports);
});
const BuggyClock = React.lazy(() => import('./BuggyClock'));

const ClockPanel = React.memo(function() {
  console.log('ClockPanel Rendered');

  return (
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
      <ThemeTogglerButton />
    </div>
  );
});
export default ClockPanel;