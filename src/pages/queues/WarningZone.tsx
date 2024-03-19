import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Row,  } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

export const WarningZone: React.FC<IResourceComponentsProps> = () => {
    const params = useParams<{ name: string }>()
    if(params.name)
    return <Row gutter={16}>
        <Button>Remove Jobs</Button>
        <Button onClick={() => {
            axios.post("/api/queues/"+params.name+'/empty', {})
        }}>Empty</Button>
        <Button onClick={() => {
            axios.post("/api/queues/"+params.name+'/clean', {status: "completed"})
        }}>Clean</Button>
        <Button onClick={() => {
            axios.post("/api/queues/"+params.name+'/obliterate', {force: false})
        }}>Obliterate</Button>
    </Row>

    return null;
}