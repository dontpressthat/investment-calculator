import React from 'react';
import styled from 'styled-components';

const StyledSvg = styled.svg`
  fill: ${props => props.color};
`

export const Minus = ({ color }) => <StyledSvg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" color={color}><path d="M0 10h24v4h-24z"/></StyledSvg>;

export const Plus = ({ color }) => <StyledSvg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" color={color}><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></StyledSvg>;