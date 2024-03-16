import { useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table } from "antd";
// import { theme } from "antd";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
import {
    FaPlay as StartIcon,
    FaStop as StopIcon
} from "react-icons/fa";

// const { useToken } = theme;

export const PM2Connect: React.FC<IResourceComponentsProps> = () => {
    // const { token } = useToken();
    // const go = useGo();

    const [response, setResponse] = useState<string[]>([])

    const { sendJsonMessage, readyState } = useWebSocket('ws://localhost:3001/ws/pm2/pm2:cmd', {
        shouldReconnect: () => true,
        reconnectInterval: 10 * 1000,
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            if (['stop', 'start'].includes(data.msg.action)) {
                sendJsonMessage({ cmd: 'introduce' })
            }
            else {
                setResponse(state => [data, ...state])
            }
        },
    });
    console.log(JSON.parse(response[0]?.msg?.list || "{}"))

    return <>
        <div>Test</div>
        <Button onClick={e => {
            sendJsonMessage({ cmd: 'introduce' })
        }}>Refresh</Button>
        <Button onClick={e => {
            sendJsonMessage({ cmd: 'pm2', stop: 'all' })
        }}>Stop all</Button>
        <Button onClick={e => {
            sendJsonMessage({ cmd: 'pm2', start: 'all' })
        }}>Start all</Button>

        <Button onClick={e => {
            sendJsonMessage({ cmd: 'pm2', logs: '0' })
        }}>Start all</Button>

        <div>
            <Table
                dataSource={response[0] && response[0].msg.list ? JSON.parse(response[0].msg.list) : []}
                rowKey="label"
                pagination={{ showSizeChanger: true }}
                bordered
                size="small"
            >
                <Table.Column dataIndex={"pid"} title="Host" render={() => {
                    return response[0].msg.from
                }} />
                <Table.Column dataIndex={["pm2_env", "pm_id"]} title="PM ID" />
                <Table.Column dataIndex={["pm2_env", "name"]} title="Name" />
                <Table.Column dataIndex={["pm2_env", "status"]} title="Status" />
                <Table.Column dataIndex={["pm2_env", "restart_time"]} title="RT" />
                <Table.Column dataIndex={["pm2_env", "pm_uptime"]} title="Uptime"
                    render={(val) => {
                        return Math.ceil((+new Date() - val) / 1000) + "s";
                    }}
                />
                <Table.Column dataIndex={["pm2_env", "script"]} title="Script" />
                <Table.Column dataIndex={["pm2_env", "args"]} title="Status" render={val => val?.join(" ")} />
                <Table.Column dataIndex={"pid"} title="PID" />
                {/* <Table.Column dataIndex={"name"} title="Name" /> */}
                <Table.Column dataIndex={["monit", "memory"]} title="Mem" render={(val) => {
                    return Math.ceil(val / 1024 / 1024) + "Mb"
                }} />
                <Table.Column dataIndex={["monit", "cpu"]} title="CPU" />
                <Table.Column dataIndex={""} title="Actions" render={(val) => {
                    const StopButton = () => {
                        return <Button
                            onClick={e => {
                                const payload = {
                                    to: response[0].msg.from,
                                    cmd: 'pm2',
                                    stop: val.pm2_env.pm_id
                                };
                                console.log("Stopping", payload)
                                sendJsonMessage(payload);
                            }
                            }
                        ><StopIcon color={"#FF4040"} /></Button>
                    }

                    const StartButton = () => {
                        return <Button
                            onClick={e => {
                                const payload = {
                                    to: response[0].msg.from,
                                    cmd: 'pm2',
                                    start: val.pm2_env.pm_id
                                };
                                console.log("Stopping", payload)
                                sendJsonMessage(payload);
                            }
                            }
                        ><StartIcon color={"#40FF40"} /></Button>
                    }

                    const StatusButton = () => {
                        if (val.pm2_env.status === 'stopped')
                            return <StartButton />
                        else return <StopButton />
                    }

                    return <StatusButton />
                }} />

            </Table>
        </div>
        <div>{JSON.stringify(response)}</div>
    </>
};
