import { IResourceComponentsProps } from "@refinedev/core";
import { Col, Row, Statistic } from "antd";
import { WsQueueStats } from "./WebSocket";
import { useParams } from "react-router-dom";

export const QueueStats: React.FC<IResourceComponentsProps> = () => {
    const params = useParams();

    console.log(params);
    return <Row gutter={16}>
            <WsQueueStats name={params.name}/>
    </Row>
}