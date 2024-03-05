import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo  = (props: React.PropsWithChildren) => {
  //Public API that will echo messages sent to it back to the client

  const { lastMessage, readyState } = useWebSocket('ws://localhost:3000/ws/queues-stats', {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    reconnectInterval: 10*1000,
    onMessage: (e) => {
        console.log("WS", JSON.parse(e.data))
    }
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      {props.children}
    </div>
  );
};