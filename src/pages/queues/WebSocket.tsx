import { Avatar, List, Timeline } from 'antd';
import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { PageHeader } from '@refinedev/antd';
import QueuePauseButton from '../../components/QueuePauseButton';
import { WsLiveQueueProcessingMsgPayload } from '../../@types';

export const WebSocketDemo = (props: React.PropsWithChildren) => {
  //Public API that will echo messages sent to it back to the client

  const {
    // lastMessage,
    readyState } = useWebSocket('ws://localhost:3000/ws/queues-stats', {
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

  const [workers, setWorkers] = useState<{ name: string, job: string, progress: string | null }[]>([])
  const [events, setEvents] = useState<{ children: React.ReactNode, color: string }[]>([])

  function updateWorkerProgress(id: string, progress: string) {
    setWorkers(prev => {
      const newState = prev.map(worker => {
        return {
          name: worker.name,
          job: worker.job,
          progress: worker.job === id ? progress : worker.progress
        }
      })
      return newState;
    })
  }

  const {
    // lastMessage, 
    readyState } = useWebSocket('ws://localhost:3001/ws/queues-stats/' + props.name, {
      reconnectAttempts: 5,
      shouldReconnect: () => true,
      reconnectInterval: 10 * 1000,
      onMessage: (e) => {
        console.log("WS", JSON.parse(e.data))
        const msg = JSON.parse(e.data) as WsLiveQueueProcessingMsgPayload;

        if (msg.data.workers) {
          setWorkers(prev => {
            return msg.data.workers.map(worker => {
              const prevProgress = prev.find(w => w.job === worker.job);
              return {
                name: worker.name,
                job: worker.job,
                progress: prevProgress
                  && worker.progress !== null
                  && prevProgress.progress !== worker.progress ?
                  worker.progress : prevProgress?.progress,
              }
            })
          });
        }

        if (msg.type === "onActive") {
          setEvents(past => [...past, { children: <>Processing {msg.data.id} <br /> at  {new Date().toISOString()}</>, color: "blue" }])
        }

        // if (msg.type === "onProgress") {
        //   setEvents(past => [...past, { children: <>Job <b>{msg.data.id}</b><br />Progress updated {JSON.stringify(msg.data.progress)} <br /> at  {new Date().toISOString()}</>, color: "blue" }])
        // }

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
          setEvents(past => [...past, {
            children: <>
              Failed {msg.data.id} at {new Date().toISOString()}<br />{msg.data.returnValue}
            </>,
            color: "red"
          }])
        }
      }
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Live',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <PageHeader title="Queue Name" subTitle={connectionStatus}>
        <QueuePauseButton queueSlug={props.name} />
        <List
          itemLayout="horizontal"
          dataSource={workers}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={item.job ? { backgroundColor: "green" } : {}} icon={<FaRobot />} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.job ? <>Processing job <span style={{ fontWeight: "bold" }}>{item.job}</span><br />{JSON.stringify(item.progress)}</> : 'idle'}
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

