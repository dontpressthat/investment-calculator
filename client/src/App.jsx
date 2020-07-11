import React from 'react';
import styled from 'styled-components';
import CalculatorBody from './CalculatorBody';

const Main = styled.div`
  height: max-content;
  min-height: 800px;
  width: 600px;
`

const App = () => {
  return (
    <React.Fragment>
      <Main>
        <CalculatorBody />
      </Main>
    </React.Fragment>
  )
}

export default App; 