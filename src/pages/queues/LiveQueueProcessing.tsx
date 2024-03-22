import { IResourceComponentsProps } from "@refinedev/core";
import { Row } from "antd";
import { LiveQueueProcessing } from "./WebSocket";
import { useParams } from "react-router-dom";

export const QueueStats: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()

    console.log(params);
    return <Row gutter={16}>
        <LiveQueueProcessing name={params.name} />
    </Row>
}