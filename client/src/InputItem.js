import React from 'react';
import styled from 'styled-components';

const itemHeight = '30px';

const Container = styled.div`
  position: ${props => props.position};
  width: ${props => props.width};
  height: ${props => props.height};
  display: ${props => props.display};
  flex-flow: ${props => props.flow};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  margin: ${props => props.margin};
  background-color: ${props => props.bgColor};
  label, span {
    text-align: center;
    height: 100%;
    line-height: ${itemHeight};
    white-space: nowrap;
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 300;
  };
`;

const Input = styled.input`
  width: ${props => props.width};
  height: ${itemHeight};
  ::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  };
  ::-webkit-outer-spin-button{
    -webkit-appearance: none;
    margin: 0; 
  };
  input[type=number] {
    -moz-appearance: textfield;
  };
  border: 1px solid #e0e0e0;
  color: #333333;
  background-color: #fff;
  padding-left: ${props => props.paddingLeft || '10px'};
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 0px;
  font-size: 16px;
  &.readOnly {
    background-color: ${props => props.readOnlyBgColor};
  };
  font-family: 'Roboto Condensed', sans-serif;
  outline: ${props => props.readOnly ? 'none' : null};
  outline-color: #c3d4c7;
  box-shadow: none;
`;

const DollarPrefix = styled.div`
  position: relative;
  width: ${props => props.width};
  &::before {
    position: absolute;
    content: '$';
    font-size: 16px;
    font-family: 'Roboto Condensed', sans-serif;
    color: #555555;
    font-weight: 400;
    left: 8px;
    top: 5px;
  };
`

const PercentSuffix = styled.div`
  position: relative;
  width: ${props => props.width};
  &::after {
    position: absolute;
    content: '%';
    font-size: 16px;
    font-family: 'Roboto Condensed', sans-serif;
    color: #555555;
    font-weight: 400;
    right: 7px;
    top: 5px;
  };
`

const InputItem = ({ label, name, name1, name2, value, value1, value2, handleChange, sign, readOnly, select }) => {
  let dollarPadding;
  let dollarSign;
  let percentSign;

  if (sign === 'dollar') {
    dollarPadding = '20px';
    dollarSign = <DollarPrefix />;
  } else if (sign === 'percent') {
    percentSign = <PercentSuffix />;
  } else if (name1 && name2) {
    dollarSign = <DollarPrefix />;
    percentSign = <PercentSuffix />;
  };

  const or = <Container><span>OR</span></Container>
  const select1 = (
    <Container>
      <input className='radio' type='radio' name='propertyMgmtRadio' value='1' onChange={handleChange} />
    </Container>
  );
  const select2 = (
    <Container>
      <input className='radio' type='radio' name='propertyMgmtRadio' value='2' onChange={handleChange} defaultChecked />
    </Container>
  );

  const readOnlyColor = () => {
    if (
      label === 'Cash on Cash Return' ||
      label === 'Net Income' ||
      label === 'Cap Rate'
      ) {
      return '#c3d4c7';
    } else {
      return '#f0f0f0'
    }
  };

  const singleInput = (
    <Container display='flex' justify='space-between' width='100%'>
      <Container width='45%' margin='5px'>
        <label>
          {label}
        </label>
      </Container>
      <Container width='50%' margin='5px'>
        {dollarSign}
        {percentSign}
        <Input type='number' name={name} value={value} onChange={handleChange} width='100%' paddingLeft={dollarPadding} readOnly={readOnly} className={readOnly ? 'readOnly' : null} readOnlyBgColor={readOnlyColor}></Input>
      </Container>
    </Container>
  );

  const doubleInput = (
    <Container display='flex' justify='space-between' width='100%'>
      <Container width='45%' margin='5px'>
        <label>
          {label}
        </label>
      </Container>
      <Container width='50%' margin='5px' display='flex' direction='row' justify='space-between'>
        <Container width={select ? '53%' : '45%'}>
          <Container display='flex' direction='row' align='center'>
            {select ? select1 : null}
            <Container margin={select ? '0 0 0 5px' : null}>
              {dollarSign}
              <Input type='number' name={name1} value={value1} onChange={handleChange} width='100%' paddingLeft='20px'></Input>
            </Container>
          </Container>
        </Container>
        {select ? null : or}
        <Container width={select ? '43%' : '35%'}>
          <Container display='flex' direction='row' align='center'>
            {select ? select2 : null}
            <Container margin={select ? '0 0 0 5px' : null}>
              {percentSign}
              <Input type='number' name={name2} value={value2} onChange={handleChange} width='100%'></Input>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
  return name1 && name2 ? doubleInput : singleInput;
};

export default InputItem;