import React, { useState, useCallback, useRef, FunctionComponent, MutableRefObject } from 'react';
import styled from 'styled-components';
import ReactListenableFrame, { ReactListenableFrameSender } from 'react-listenable-frame';

import Button from './Button';
import Log from './Log';
import GlobalStyles from './GlobalStyles';
import { timestamp } from './utils';

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
`;

const FramesWrap = styled.div`
  width: 100%;
  height: 530px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const FramesWrapColumn = styled.div`
  width: calc(50% - 5px);
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledFrame = styled(ReactListenableFrame)`
  width: 100%;
  height: calc(100% - 40px);
  border: solid 1px black;
  box-sizing: border-box;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 30px;
`;

const StyledLog = styled(Log)`
  width: 100%;
  height: calc(100% - 587px);
`;

const useOnMessage = (
  frameNumber: number,
  messages: string[],
  setMessages: (messages: string[]) => void,
) => useCallback(
  (event: MessageEvent) => {
    let entry: string = '';

    switch (event.data) {
      case 'ready':
        entry = `Frame #${frameNumber} is ready`;
        break;
      case 'ping':
        entry = `Recieved ping signal from Frame #${frameNumber}`;
        break;
    }

    if (entry) {
      setMessages([...messages, `${timestamp()} ${entry}`]);
    }
  },
  [frameNumber, messages, setMessages],
);

const useOnPingClick = (
  ref: MutableRefObject<ReactListenableFrameSender | null>,
  frameNumber: number,
  messages: string[],
  setMessages: (messages: string[]) => void,
) => useCallback(() => {
  if (ref.current) {
    ref.current!('ping', '*');
  }
  setMessages([...messages, `${timestamp()} Ping singal sent to Frame #${frameNumber}`]);
}, [ref, messages, setMessages]);

const MainApp: FunctionComponent = () => {
  const [messages, setMessages] = useState<string[]>([`${timestamp()} Initialized`]);

  // Messages listeners
  const onMessage01 = useOnMessage(1, messages, setMessages);
  const onMessage02 = useOnMessage(2, messages, setMessages);

  // Senders refs
  const ref01 = useRef<ReactListenableFrameSender | null>(null);
  const ref02 = useRef<ReactListenableFrameSender | null>(null);

  // Ping buttons callbacks
  const onPing01Click = useOnPingClick(ref01, 1, messages, setMessages);
  const onPing02Click = useOnPingClick(ref02, 2, messages, setMessages);

  return (
    <Root>
      <GlobalStyles />
      <Title>"React Listenable Frame" Showcase</Title>
      <FramesWrap>
        <FramesWrapColumn>
          <StyledFrame title="Frame #1" src="/frame01.html" senderRef={ref01} onMessage={onMessage01} />
          <StyledButton onClick={onPing01Click}>Ping Frame #1</StyledButton>
        </FramesWrapColumn>
        <FramesWrapColumn>
          <StyledFrame title="Frame #2" src="/frame02.html" senderRef={ref02} onMessage={onMessage02} />
          <StyledButton onClick={onPing02Click}>Ping Frame #2</StyledButton>
        </FramesWrapColumn>
      </FramesWrap>
      <StyledLog messages={messages} />
    </Root>
  );
};

MainApp.displayName = `MainApp`;

export default MainApp;
