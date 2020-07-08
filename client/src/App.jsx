import React, { useState } from 'react';
import styled from 'styled-components';
import CalculatorBody from './CalculatorBody';
import Graph from './Graph';

const Main = styled.div`
  height: max-content;
  min-height: 800px;
  width: 600px;
  /* background-color: lightgray; */
`

const App = () => {
  return (
    <React.Fragment>
      <Main>
        <center>
          <h1>Investment Property Calculator</h1>
        </center>
        <CalculatorBody />
        <Graph />
      </Main>
    </React.Fragment>
  )
}

export default App; 