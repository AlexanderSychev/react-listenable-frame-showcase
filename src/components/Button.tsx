import React, { FunctionComponent, MouseEventHandler } from 'react';
import styled from 'styled-components';

/** `Button` component properties */
export interface ButtonProps {
  /** Additional CSS class */
  className?: string;
  /** Type of button */
  type?: 'submit' | 'reset' | 'button';
  /** Button click handler */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Root = styled.button`
  box-sizing: border-box;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;

  transition: all .3s;
  background-color: black;
  border: solid 1px black;
  color: white;

  &:hover {
    cursor: pointer;
    background-color: white;
    color: black;
  }
`;

/** Common button component */
const Button: FunctionComponent<ButtonProps> = ({ className, type, children, onClick }) => (
  <Root className={className} type={type} onClick={onClick}>{children}</Root>
);

Button.displayName = `Button`;

export default Button;
