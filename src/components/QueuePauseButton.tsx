import React from "react";
import { PauseQueueIcon, ResumeQueueIcon } from "./Icons";
import { Button } from "antd";
import axios from "axios";

const QueuePauseButton: React.FC<{ queueSlug?: string, hideLabel?: boolean }> = (props) => {
    const [isPausedResp, setIsPausedResp] = React.useState(false)

    React.useEffect(() => {
        if (props.queueSlug)
            axios.get<{ isPaused: boolean }>('/api/queues/' + props.queueSlug + '/is-paused')
                .then((response) => {
                    setIsPausedResp(response.data.isPaused)
                })
    }, [props.queueSlug])

    if (isPausedResp) {

        return <Button
            type="primary"
            icon={<ResumeQueueIcon />}

            onClick={(e) => {
                e.preventDefault();
                if (props.queueSlug)
                    axios.post<{ isPaused: boolean }>('/api/queues/' + props.queueSlug + '/resume')
                        .then(response => {
                            setIsPausedResp(response.data.isPaused)
                        })
            }}
        >
            {props.hideLabel ? "" : "Resume Queue"}
        </Button>
    }

    return <Button
        type="primary"
        icon={<PauseQueueIcon />}

        onClick={(e) => {
            e.preventDefault();

            if (props.queueSlug)
                axios.post<{ isPaused: boolean }>('/api/queues/' + props.queueSlug + '/pause')
                    .then(response => {
                        setIsPausedResp(response.data.isPaused)
                    })
        }}

    >
        {props.hideLabel ? "" : "Pause Queue"}
    </Button>
}

export default QueuePauseButton