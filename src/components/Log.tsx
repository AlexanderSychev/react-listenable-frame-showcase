import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

export interface LogProps {
  /** Additional CSS class */
  className?: string;
  /** List of messages to display */
  messages: string[];
}

const Root = styled.textarea`
  outline: none;
  resize: none;
  box-sizing: border-box;
  background: lightgray;
  padding: 10px;
  font-size: 12px;
  font-family: monospace;
  color: orangered;
`;

const Log: FunctionComponent<LogProps> = ({ messages, className }) => (
  <Root readOnly className={className} value={messages.join('\n')} />
);

Log.displayName = 'Log';

export default Log;
