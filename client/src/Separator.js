import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: gray;
  margin: 0 10px 0 10px;
`

const Separator = () => {
  return (
    <Container>
      <Line />
    </Container>
  )
};

export default Separator;