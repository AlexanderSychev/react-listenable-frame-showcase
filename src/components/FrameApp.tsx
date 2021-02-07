import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components'

import GlobalStyles from './GlobalStyles';
import Log from './Log';
import Button from './Button';
import { timestamp } from './utils';

const Root = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const Title = styled.h1`
  text-align: center;
  margin: 0;
  font-size: 1.75em;
`;

const StyledLog = styled(Log)`
  width: 100%;
  height: calc(100% - 82px);
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 30px;
`;

export interface FrameAppProps {
  frameNumber?: string;
}

const FrameApp: FunctionComponent<FrameAppProps> = ({ frameNumber = '0' }) => {
  const [messages, setMessages] = useState<string[]>([`${timestamp()} Frame initialized`]);

  useEffect(() => {
    parent.postMessage('ready', '*');
  }, []);

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data === 'ping') {
      setMessages([...messages, `${timestamp()} Ping message received from parent frame`]);
    }
  }, [messages, setMessages]);

  useEffect(() => {
    addEventListener('message', onMessage);
    return () => removeEventListener('message', onMessage);
  }, [onMessage]);

  const onPingClick = useCallback(() => {
    window.parent.postMessage('ping', '*');
    setMessages([...messages, `${timestamp()} Sent ping signal to parent frame`]);
  }, [messages, setMessages]);

  return (
    <Root>
      <GlobalStyles />
      <Title>Frame #{frameNumber}</Title>
      <StyledLog messages={messages} />
      <StyledButton onClick={onPingClick}>
        Ping parent frame
      </StyledButton>
    </Root>
  );
};

FrameApp.displayName = 'FrameApp';

export default FrameApp;
