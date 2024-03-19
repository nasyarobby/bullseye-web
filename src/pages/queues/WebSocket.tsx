import { Avatar, Button, List, Timeline } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { FaBullhorn, FaHardHat, FaRobot } from 'react-icons/fa';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { JobList } from '../jobs';
import Title from 'antd/lib/typography/Title';
import { PageHeader } from '@refinedev/antd';
import { NewQueueIcon } from '../../components/Icons';
import QueuePauseButton from '../../components/QueuePauseButton';

export const WebSocketDemo = (props: React.PropsWithChildren) => {
  //Public API that will echo messages sent to it back to the client

  const { lastMessage, readyState } = useWebSocket('ws://localhost:3000/ws/queues-stats', {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    reconnectInterval: 10 * 1000,
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

export const LiveQueueProcessing = (props: React.PropsWithChildren<{ name?: string }>) => {

  const [workers, setWorkers] = useState<{ name: string, job: string }[]>([])
  const [events, setEvents] = useState<{ children: React.ReactNode, color: string }[]>([])


  const { lastMessage, readyState } = useWebSocket('ws://localhost:3001/ws/queues-stats/' + props.name, {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    reconnectInterval: 10 * 1000,
    onMessage: (e) => {
      console.log("WS", JSON.parse(e.data))
      const msg = JSON.parse(e.data) as { type: "workers" | "onActive" | "onCompleted" | "onFailed", data: object };
      if (msg.data?.workers)
        setWorkers(msg.data.workers);

      if (msg.type === "onActive") {
        setEvents(past => [...past, { children: <>Processing {msg.data.id} <br /> at  {new Date().toISOString()}</>, color: "blue" }])
      }

      if (msg.type === "onCompleted") {
        setEvents(past => [...past, {
          children: <>
            Completed {msg.data.id}
            <br />at {new Date().toISOString()}<br />{msg.data.returnValue}
            </>, 
            color: "green"
        }])
      }

      if (msg.type === "onFailed") {
        setEvents(past => [...past, { children: <>
          Failed {msg.data.id} at {new Date().toISOString()}<br />{msg.data.returnValue}
          </>, 
          color: "red" }])
      }
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
      <PageHeader title="Queue Name" subTitle="Live">
          <QueuePauseButton queueSlug={props.name}/>
      <List
        itemLayout="horizontal"
        dataSource={workers}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={item.job ? { backgroundColor: "green" } : {}} icon={<FaRobot />} />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.job ? <>Processing job <span style={{fontWeight: "bold"}}>{item.job}</span></> : 'idle'}
            />
          </List.Item>
        )}
      />
      <Timeline
        pending={["Processing..."]}
        reverse={true}
        items={events}
      />
      </PageHeader>
    </div>
  );
};

