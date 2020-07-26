import React from 'react';
import styled from 'styled-components';
import CalculatorBody2 from './CalculatorBody-v2';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Main = styled.div`
  display: flex;
  height: max-content;
  width: max-content;
  @media only screen and (min-width: 900px) {
    justify-content: center;
  };
  @media only screen and (max-width: 900px) {
    margin-top: 0;
  };
`

const App = () => {
  return (
    <Container>
      <Main>
        <CalculatorBody2 />
      </Main>
    </Container>
  )
}

export default App; 