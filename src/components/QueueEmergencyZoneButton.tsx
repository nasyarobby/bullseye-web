import { Button } from "antd";
import { WarningZoneIcon } from "./Icons";
import { useGo } from "@refinedev/core";

const QueueEmergencyZoneButton: React.FC<{ queueSlug?: string, hideLabel?: boolean }> = (props) => {
    const go = useGo();

    return <Button
        type="primary"
        danger
        icon={<WarningZoneIcon />}
        onClick={() => {
            go({
                to: `/warning-zone/${props.queueSlug}`,
                type: "push",
            });
        }}
    >
        Emergency Zone
    </Button>
}

export default QueueEmergencyZoneButton;